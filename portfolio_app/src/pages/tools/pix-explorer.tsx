import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AggregatedMetrics {
  Estado: string;
  DinheiroMovimentado: number;
  QuantidadeTransacoes: number;
  TicketMedio: number;
  ParticipacaoPF: number;
  ParticipacaoPJ: number;
  PagadoresUnicosPF: number;
  PagadoresUnicosPJ: number;
  RecebedoresUnicosPF: number;
  RecebedoresUnicosPJ: number;
  RelacaoPagadoresRecebedoresPF: number | null;
  RelacaoPagadoresRecebedoresPJ: number | null;
}

const PixExplorer: React.FC = () => {
  const [data, setData] = useState<AggregatedMetrics[]>([]);
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AggregatedMetrics; direction: 'asc' | 'desc' } | null>(null);
  const [filterState, setFilterState] = useState('');
  const mapRef = useRef<SVGSVGElement>(null);

  // Normalize state names to remove accents, convert to lowercase, and trim spaces
  const normalizeName = (name: string) =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pixResponse, geoJsonResponse] = await Promise.all([
          axios.get('/api/fetchPix'),
          fetch('/data/BR_UF_2024.geojson').then((res) => {
            if (!res.ok) throw new Error('Failed to fetch GeoJSON');
            return res.json();
          }),
        ]);
        const pixData = pixResponse.data;
        setData(pixData);
        setGeoJson(geoJsonResponse);

        // Debug: Log unmatched states and data issues
        const geoJsonStates = new Set(geoJsonResponse.features.map((f: any) => normalizeName(f.properties.NM_UF)));
        const pixStates = new Set(pixData.map((d: AggregatedMetrics) => normalizeName(d.Estado)));
        const unmatchedGeoJson = [...geoJsonStates].filter((state) => !pixStates.has(state));
        const unmatchedPix = [...pixStates].filter((state) => !geoJsonStates.has(state));
        if (unmatchedGeoJson.length > 0) {
          console.warn('GeoJSON states not found in Pix data:', unmatchedGeoJson);
        }
        if (unmatchedPix.length > 0) {
          console.warn('Pix data states not found in GeoJSON:', unmatchedPix);
        }
        // Log data for debugging
        console.log('Pix Data:', pixData);
        console.log('GeoJSON Features:', geoJsonResponse.features.map((f: any) => f.properties.NM_UF));
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load Pix data or GeoJSON');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0 && geoJson && mapRef.current) {
      // Debug: Validate data
      const invalidData = data.filter(
        (d) => !d.Estado || isNaN(d.DinheiroMovimentado) || d.DinheiroMovimentado === null
      );
      if (invalidData.length > 0) {
        console.warn('Invalid Pix data entries:', invalidData);
      }

      // Set up D3 map
      const svg = d3.select(mapRef.current);
      const width = 600;
      const height = 600;

      // Clear previous content
      svg.selectAll('*').remove();

      // Create projection
      const projection = d3.geoMercator().fitSize([width, height], geoJson);
      const path = d3.geoPath().projection(projection);

      // Color scale for transaction volume
      const validVolumes = data
        .map((d) => d.DinheiroMovimentado)
        .filter((v) => !isNaN(v) && v !== null);
      const volumeExtent = validVolumes.length > 0 ? d3.extent(validVolumes) : [0, 1];
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain(volumeExtent as [number, number]);

      // Create map
      svg
        .attr('width', width)
        .attr('height', height)
        .selectAll('path')
        .data(geoJson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', (d) => {
          const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
          if (!stateData) {
            console.warn(`No data for state: ${d.properties.NM_UF}`);
            return '#ccc';
          }
          if (isNaN(stateData.DinheiroMovimentado) || stateData.DinheiroMovimentado === null) {
            console.warn(`Invalid transaction volume for state: ${d.properties.NM_UF}`, stateData);
            return '#ccc';
          }
          return colorScale(stateData.DinheiroMovimentado);
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('opacity', 1)
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', '#ffcc00').style('opacity', 0.8);
          const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', '#fff')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .html(
              `${d.properties.NM_UF}<br>` +
              `Volume: R$${stateData ? stateData.DinheiroMovimentado.toLocaleString('pt-BR') : 'N/A'}<br>` +
              `Transactions: ${stateData ? stateData.QuantidadeTransacoes.toLocaleString('pt-BR') : 'N/A'}<br>` +
              `Avg Ticket: R$${stateData ? stateData.TicketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}`
            )
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function (event, d) {
          const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
          d3.select(this)
            .attr('fill', stateData && !isNaN(stateData.DinheiroMovimentado) && stateData.DinheiroMovimentado !== null
              ? colorScale(stateData.DinheiroMovimentado)
              : '#ccc')
            .style('opacity', 1);
          d3.select('.tooltip').remove();
        });

      // Add legend
      const legendWidth = 20;
      const legendHeight = 200;
      const legend = svg.append('g')
        .attr('transform', `translate(${width - 50}, 20)`);

      const legendScale = d3.scaleLinear()
        .domain(volumeExtent as [number, number])
        .range([legendHeight, 0]);

      const legendAxis = d3.axisRight(legendScale)
        .ticks(5)
        .tickFormat((d) => `R$${d.toLocaleString('pt-BR')}`);

      legend.append('g')
        .attr('transform', `translate(${legendWidth}, 0)`)
        .call(legendAxis);

      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.interpolateBlues(0));

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.interpolateBlues(1));

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#legend-gradient)');
    }
  }, [data, geoJson, loading, filterState]);

  const handleSort = (key: keyof AggregatedMetrics) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === null || bValue === null) return 0;
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    normalizeName(item.Estado).includes(normalizeName(filterState))
  );

  // Sort for bar charts (highest to lowest transaction volume and average ticket)
  const barChartSortedData = [...filteredData].sort((a, b) => b.DinheiroMovimentado - a.DinheiroMovimentado);
  const avgTicketSortedData = [...filteredData].sort((a, b) => b.TicketMedio - a.TicketMedio);

  // Bar Chart: Transaction Volume by State
  const barChartData = {
    labels: barChartSortedData.map((item) => item.Estado),
    datasets: [
      {
        label: 'Transaction Volume (BRL)',
        data: barChartSortedData.map((item) => item.DinheiroMovimentado),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart: Average Ticket by State
  const avgTicketChartData = {
    labels: avgTicketSortedData.map((item) => item.Estado),
    datasets: [
      {
        label: 'Average Ticket (BRL)',
        data: avgTicketSortedData.map((item) => item.TicketMedio),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart: PF vs PJ Participation (average across all states)
  const avgPF = filteredData.reduce((sum, item) => sum + item.ParticipacaoPF, 0) / (filteredData.length || 1);
  const avgPJ = filteredData.reduce((sum, item) => sum + item.ParticipacaoPJ, 0) / (filteredData.length || 1);
  const pieChartData = {
    labels: ['Individual (PF)', 'Business (PJ)'],
    datasets: [
      {
        data: [avgPF, avgPJ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Scatter Chart: Transaction Volume vs Average Ticket
  const scatterChartData = {
    datasets: [
      {
        label: 'States',
        data: filteredData.map((item) => ({
          x: item.DinheiroMovimentado,
          y: item.TicketMedio,
          label: item.Estado,
        })),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        pointRadius: 6,
      },
    ],
  };

  // Summary statistics
  const totalVolume = filteredData.reduce((sum, item) => sum + item.DinheiroMovimentado, 0);
  const totalTransactions = filteredData.reduce((sum, item) => sum + item.QuantidadeTransacoes, 0);
  const topState = barChartSortedData[0]?.Estado || 'N/A';
  const topStateVolume = barChartSortedData[0]?.DinheiroMovimentado || 0;

  // Download CSV
  const downloadCSV = () => {
    const headers = [
      'State',
      'Transaction Volume (BRL)',
      'Transaction Count',
      'Average Ticket (BRL)',
      '% Individuals (PF)',
      '% Businesses (PJ)',
      'Unique Payers (PF)',
      'Unique Payers (PJ)',
      'Unique Receivers (PF)',
      'Unique Receivers (PJ)',
      'Payers/Receivers Ratio (PF)',
      'Payers/Receivers Ratio (PJ)',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((item) => [
        item.Estado,
        item.DinheiroMovimentado,
        item.QuantidadeTransacoes,
        item.TicketMedio,
        item.ParticipacaoPF,
        item.ParticipacaoPJ,
        item.PagadoresUnicosPF,
        item.PagadoresUnicosPJ,
        item.RecebedoresUnicosPF,
        item.RecebedoresUnicosPJ,
        item.RelacaoPagadoresRecebedoresPF || 'N/A',
        item.RelacaoPagadoresRecebedoresPJ || 'N/A',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pix_data.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">Analyzing Pix transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center p-4 text-red-500 bg-red-100 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Pix Transaction Explorer</h1>

      {/* Summary Statistics Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-lg font-bold">
              {totalVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-lg font-bold">{totalTransactions.toLocaleString('pt-BR')}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Top State</p>
            <p className="text-lg font-bold">{topState}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Top State Volume</p>
            <p className="text-lg font-bold">
              {topStateVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Filter by State"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="p-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Transaction Volume by State</h2>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const state = barChartSortedData[context.dataIndex];
                      return [
                        `${context.dataset.label}: R$${context.parsed.y.toLocaleString('pt-BR')}`,
                        `Transactions: ${state.QuantidadeTransacoes.toLocaleString('pt-BR')}`,
                        `Avg Ticket: R$${state.TicketMedio.toLocaleString('pt-BR')}`,
                      ];
                    },
                  },
                },
              },
            }}
          />
          <h2 className="text-xl font-semibold mb-4 mt-8">Average Ticket by State</h2>
          <Bar
            data={avgTicketChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const state = avgTicketSortedData[context.dataIndex];
                      return [
                        `${context.dataset.label}: R$${context.parsed.y.toLocaleString('pt-BR')}`,
                        `Transactions: ${state.QuantidadeTransacoes.toLocaleString('pt-BR')}`,
                        `Volume: R$${state.DinheiroMovimentado.toLocaleString('pt-BR')}`,
                      ];
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Individual vs Business Participation</h2>
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.toFixed(2)}%`,
                  },
                },
              },
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Transaction Volume vs Average Ticket</h2>
          <Scatter
            data={scatterChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const state = context.raw as { label: string; x: number; y: number };
                      return [
                        `${state.label}`,
                        `Volume: R$${state.x.toLocaleString('pt-BR')}`,
                        `Avg Ticket: R$${state.y.toLocaleString('pt-BR')}`,
                      ];
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Transaction Volume (BRL)' },
                  ticks: {
                    callback: (value) => `R$${value.toLocaleString('pt-BR')}`,
                  },
                },
                y: {
                  title: { display: true, text: 'Average Ticket (BRL)' },
                  ticks: {
                    callback: (value) => `R$${value.toLocaleString('pt-BR')}`,
                  },
                },
              },
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Transaction Volume by State (Map)</h2>
          <svg ref={mapRef}></svg>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {[
                'State',
                'Transaction Volume (BRL)',
                'Transaction Count',
                'Average Ticket (BRL)',
                '% Individuals (PF)',
                '% Businesses (PJ)',
                'Unique Payers (PF)',
                'Unique Payers (PJ)',
                'Unique Receivers (PF)',
                'Unique Receivers (PJ)',
                'Payers/Receivers Ratio (PF)',
                'Payers/Receivers Ratio (PJ)',
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    handleSort(
                      header === 'State'
                        ? 'Estado'
                        : header === 'Transaction Volume (BRL)'
                        ? 'DinheiroMovimentado'
                        : header === 'Transaction Count'
                        ? 'QuantidadeTransacoes'
                        : header === 'Average Ticket (BRL)'
                        ? 'TicketMedio'
                        : header === '% Individuals (PF)'
                        ? 'ParticipacaoPF'
                        : header === '% Businesses (PJ)'
                        ? 'ParticipacaoPJ'
                        : header === 'Unique Payers (PF)'
                        ? 'PagadoresUnicosPF'
                        : header === 'Unique Payers (PJ)'
                        ? 'PagadoresUnicosPJ'
                        : header === 'Unique Receivers (PF)'
                        ? 'RecebedoresUnicosPF'
                        : header === 'Unique Receivers (PJ)'
                        ? 'RecebedoresUnicosPJ'
                        : header === 'Payers/Receivers Ratio (PF)'
                        ? 'RelacaoPagadoresRecebedoresPF'
                        : 'RelacaoPagadoresRecebedoresPJ'
                    )
                  }
                >
                  {header}
                  {sortConfig?.key ===
                    (header === 'State'
                      ? 'Estado'
                      : header === 'Transaction Volume (BRL)'
                      ? 'DinheiroMovimentado'
                      : header === 'Transaction Count'
                      ? 'QuantidadeTransacoes'
                      : header === 'Average Ticket (BRL)'
                      ? 'TicketMedio'
                      : header === '% Individuals (PF)'
                      ? 'ParticipacaoPF'
                      : header === '% Businesses (PJ)'
                      ? 'ParticipacaoPJ'
                      : header === 'Unique Payers (PF)'
                      ? 'PagadoresUnicosPF'
                      : header === 'Unique Payers (PJ)'
                      ? 'PagadoresUnicosPJ'
                      : header === 'Unique Receivers (PF)'
                      ? 'RecebedoresUnicosPF'
                      : header === 'Unique Receivers (PJ)'
                      ? 'RecebedoresUnicosPJ'
                      : header === 'Payers/Receivers Ratio (PF)'
                      ? 'RelacaoPagadoresRecebedoresPF'
                      : 'RelacaoPagadoresRecebedoresPJ') &&
                    (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.Estado}</td>
                <td className="px-4 py-2 border">
                  {item.DinheiroMovimentado.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="px-4 py-2 border">{item.QuantidadeTransacoes.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 border">
                  {item.TicketMedio.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="px-4 py-2 border">{item.ParticipacaoPF.toFixed(2)}%</td>
                <td className="px-4 py-2 border">{item.ParticipacaoPJ.toFixed(2)}%</td>
                <td className="px-4 py-2 border">{item.PagadoresUnicosPF.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 border">{item.PagadoresUnicosPJ.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 border">{item.RecebedoresUnicosPF.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 border">{item.RecebedoresUnicosPJ.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 border">
                  {item.RelacaoPagadoresRecebedoresPF
                    ? item.RelacaoPagadoresRecebedoresPF.toFixed(2)
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 border">
                  {item.RelacaoPagadoresRecebedoresPJ
                    ? item.RelacaoPagadoresRecebedoresPJ.toFixed(2)
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline CSS for tooltip and map */}
      <style jsx>{`
        .tooltip {
          z-index: 1000;
        }
        svg path {
          fill-opacity: 1;
          transition: fill 0.2s, opacity 0.2s;
        }
      `}</style>
    </div>
  );
};

export default PixExplorer;