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

  // Normalize state names with comprehensive mapping
  const normalizeName = (name: string) => {
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    const nameMap: { [key: string]: string } = {
      'sao paulo': 'São Paulo',
      'rio': 'Rio de Janeiro',
      'minas': 'Minas Gerais',
      'parana': 'Paraná',
      'ceara': 'Ceará',
      'goias': 'Goiás',
      'para': 'Pará',
      'piaui': 'Piauí',
      'roraima': 'Roraima',
      'amapa': 'Amapá',
      'rondonia': 'Rondônia',
      'tocantins': 'Tocantins',
      'maranhao': 'Maranhão',
      'espirito santo': 'Espírito Santo',
      'rio grande do sul': 'Rio Grande do Sul',
      'rio grande do norte': 'Rio Grande do Norte',
      'mato grosso': 'Mato Grosso',
      'mato grosso do sul': 'Mato Grosso do Sul',
      'distrito federal': 'Distrito Federal',
      'acre': 'Acre',
      'alagoas': 'Alagoas',
      'amazonas': 'Amazonas',
      'bahia': 'Bahia',
      'pernambuco': 'Pernambuco',
      'santa catarina': 'Santa Catarina',
      'sergipe': 'Sergipe',
      'paraiba': 'Paraíba'
    };
    return nameMap[normalized] || name;
  };

  // Comprehensive fallback data covering all Brazilian states
  const fallbackData: AggregatedMetrics[] = [
    { Estado: 'São Paulo', DinheiroMovimentado: 1000000, QuantidadeTransacoes: 5000, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 1000, PagadoresUnicosPJ: 500, RecebedoresUnicosPF: 800, RecebedoresUnicosPJ: 400, RelacaoPagadoresRecebedoresPF: 1.25, RelacaoPagadoresRecebedoresPJ: 1.25 },
    { Estado: 'Rio de Janeiro', DinheiroMovimentado: 800000, QuantidadeTransacoes: 4000, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 900, PagadoresUnicosPJ: 450, RecebedoresUnicosPF: 700, RecebedoresUnicosPJ: 350, RelacaoPagadoresRecebedoresPF: 1.28, RelacaoPagadoresRecebedoresPJ: 1.28 },
    { Estado: 'Minas Gerais', DinheiroMovimentado: 600000, QuantidadeTransacoes: 3000, TicketMedio: 200, ParticipacaoPF: 50, ParticipacaoPJ: 50, PagadoresUnicosPF: 800, PagadoresUnicosPJ: 400, RecebedoresUnicosPF: 600, RecebedoresUnicosPJ: 300, RelacaoPagadoresRecebedoresPF: 1.33, RelacaoPagadoresRecebedoresPJ: 1.33 },
    { Estado: 'Paraná', DinheiroMovimentado: 500000, QuantidadeTransacoes: 2500, TicketMedio: 200, ParticipacaoPF: 52, ParticipacaoPJ: 48, PagadoresUnicosPF: 700, PagadoresUnicosPJ: 350, RecebedoresUnicosPF: 500, RecebedoresUnicosPJ: 250, RelacaoPagadoresRecebedoresPF: 1.4, RelacaoPagadoresRecebedoresPJ: 1.4 },
    { Estado: 'Ceará', DinheiroMovimentado: 400000, QuantidadeTransacoes: 2000, TicketMedio: 200, ParticipacaoPF: 58, ParticipacaoPJ: 42, PagadoresUnicosPF: 600, PagadoresUnicosPJ: 300, RecebedoresUnicosPF: 400, RecebedoresUnicosPJ: 200, RelacaoPagadoresRecebedoresPF: 1.5, RelacaoPagadoresRecebedoresPJ: 1.5 },
    { Estado: 'Goiás', DinheiroMovimentado: 350000, QuantidadeTransacoes: 1750, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 500, PagadoresUnicosPJ: 250, RecebedoresUnicosPF: 350, RecebedoresUnicosPJ: 175, RelacaoPagadoresRecebedoresPF: 1.43, RelacaoPagadoresRecebedoresPJ: 1.43 },
    { Estado: 'Pará', DinheiroMovimentado: 300000, QuantidadeTransacoes: 1500, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 400, PagadoresUnicosPJ: 200, RecebedoresUnicosPF: 300, RecebedoresUnicosPJ: 150, RelacaoPagadoresRecebedoresPF: 1.33, RelacaoPagadoresRecebedoresPJ: 1.33 },
    { Estado: 'Piauí', DinheiroMovimentado: 250000, QuantidadeTransacoes: 1250, TicketMedio: 200, ParticipacaoPF: 62, ParticipacaoPJ: 38, PagadoresUnicosPF: 350, PagadoresUnicosPJ: 175, RecebedoresUnicosPF: 250, RecebedoresUnicosPJ: 125, RelacaoPagadoresRecebedoresPF: 1.4, RelacaoPagadoresRecebedoresPJ: 1.4 },
    { Estado: 'Roraima', DinheiroMovimentado: 200000, QuantidadeTransacoes: 1000, TicketMedio: 200, ParticipacaoPF: 65, ParticipacaoPJ: 35, PagadoresUnicosPF: 300, PagadoresUnicosPJ: 150, RecebedoresUnicosPF: 200, RecebedoresUnicosPJ: 100, RelacaoPagadoresRecebedoresPF: 1.5, RelacaoPagadoresRecebedoresPJ: 1.5 },
    { Estado: 'Amapá', DinheiroMovimentado: 180000, QuantidadeTransacoes: 900, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 250, PagadoresUnicosPJ: 125, RecebedoresUnicosPF: 180, RecebedoresUnicosPJ: 90, RelacaoPagadoresRecebedoresPF: 1.39, RelacaoPagadoresRecebedoresPJ: 1.39 },
    { Estado: 'Rondônia', DinheiroMovimentado: 170000, QuantidadeTransacoes: 850, TicketMedio: 200, ParticipacaoPF: 58, ParticipacaoPJ: 42, PagadoresUnicosPF: 240, PagadoresUnicosPJ: 120, RecebedoresUnicosPF: 170, RecebedoresUnicosPJ: 85, RelacaoPagadoresRecebedoresPF: 1.41, RelacaoPagadoresRecebedoresPJ: 1.41 },
    { Estado: 'Tocantins', DinheiroMovimentado: 160000, QuantidadeTransacoes: 800, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 230, PagadoresUnicosPJ: 115, RecebedoresUnicosPF: 160, RecebedoresUnicosPJ: 80, RelacaoPagadoresRecebedoresPF: 1.44, RelacaoPagadoresRecebedoresPJ: 1.44 },
    { Estado: 'Maranhão', DinheiroMovimentado: 150000, QuantidadeTransacoes: 750, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 220, PagadoresUnicosPJ: 110, RecebedoresUnicosPF: 150, RecebedoresUnicosPJ: 75, RelacaoPagadoresRecebedoresPF: 1.47, RelacaoPagadoresRecebedoresPJ: 1.47 },
    { Estado: 'Espírito Santo', DinheiroMovimentado: 140000, QuantidadeTransacoes: 700, TicketMedio: 200, ParticipacaoPF: 52, ParticipacaoPJ: 48, PagadoresUnicosPF: 210, PagadoresUnicosPJ: 105, RecebedoresUnicosPF: 140, RecebedoresUnicosPJ: 70, RelacaoPagadoresRecebedoresPF: 1.5, RelacaoPagadoresRecebedoresPJ: 1.5 },
    { Estado: 'Rio Grande do Sul', DinheiroMovimentado: 130000, QuantidadeTransacoes: 650, TicketMedio: 200, ParticipacaoPF: 50, ParticipacaoPJ: 50, PagadoresUnicosPF: 200, PagadoresUnicosPJ: 100, RecebedoresUnicosPF: 130, RecebedoresUnicosPJ: 65, RelacaoPagadoresRecebedoresPF: 1.54, RelacaoPagadoresRecebedoresPJ: 1.54 },
    { Estado: 'Rio Grande do Norte', DinheiroMovimentado: 120000, QuantidadeTransacoes: 600, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 190, PagadoresUnicosPJ: 95, RecebedoresUnicosPF: 120, RecebedoresUnicosPJ: 60, RelacaoPagadoresRecebedoresPF: 1.58, RelacaoPagadoresRecebedoresPJ: 1.58 },
    { Estado: 'Mato Grosso', DinheiroMovimentado: 110000, QuantidadeTransacoes: 550, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 180, PagadoresUnicosPJ: 90, RecebedoresUnicosPF: 110, RecebedoresUnicosPJ: 55, RelacaoPagadoresRecebedoresPF: 1.64, RelacaoPagadoresRecebedoresPJ: 1.64 },
    { Estado: 'Mato Grosso do Sul', DinheiroMovimentado: 100000, QuantidadeTransacoes: 500, TicketMedio: 200, ParticipacaoPF: 58, ParticipacaoPJ: 42, PagadoresUnicosPF: 170, PagadoresUnicosPJ: 85, RecebedoresUnicosPF: 100, RecebedoresUnicosPJ: 50, RelacaoPagadoresRecebedoresPF: 1.7, RelacaoPagadoresRecebedoresPJ: 1.7 },
    { Estado: 'Distrito Federal', DinheiroMovimentado: 90000, QuantidadeTransacoes: 450, TicketMedio: 200, ParticipacaoPF: 62, ParticipacaoPJ: 38, PagadoresUnicosPF: 160, PagadoresUnicosPJ: 80, RecebedoresUnicosPF: 90, RecebedoresUnicosPJ: 45, RelacaoPagadoresRecebedoresPF: 1.78, RelacaoPagadoresRecebedoresPJ: 1.78 },
    { Estado: 'Acre', DinheiroMovimentado: 80000, QuantidadeTransacoes: 400, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 150, PagadoresUnicosPJ: 75, RecebedoresUnicosPF: 80, RecebedoresUnicosPJ: 40, RelacaoPagadoresRecebedoresPF: 1.88, RelacaoPagadoresRecebedoresPJ: 1.88 },
    { Estado: 'Alagoas', DinheiroMovimentado: 70000, QuantidadeTransacoes: 350, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 140, PagadoresUnicosPJ: 70, RecebedoresUnicosPF: 70, RecebedoresUnicosPJ: 35, RelacaoPagadoresRecebedoresPF: 2.0, RelacaoPagadoresRecebedoresPJ: 2.0 },
    { Estado: 'Amazonas', DinheiroMovimentado: 60000, QuantidadeTransacoes: 300, TicketMedio: 200, ParticipacaoPF: 58, ParticipacaoPJ: 42, PagadoresUnicosPF: 130, PagadoresUnicosPJ: 65, RecebedoresUnicosPF: 60, RecebedoresUnicosPJ: 30, RelacaoPagadoresRecebedoresPF: 2.17, RelacaoPagadoresRecebedoresPJ: 2.17 },
    { Estado: 'Bahia', DinheiroMovimentado: 50000, QuantidadeTransacoes: 250, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 120, PagadoresUnicosPJ: 60, RecebedoresUnicosPF: 50, RecebedoresUnicosPJ: 25, RelacaoPagadoresRecebedoresPF: 2.4, RelacaoPagadoresRecebedoresPJ: 2.4 },
    { Estado: 'Pernambuco', DinheiroMovimentado: 40000, QuantidadeTransacoes: 200, TicketMedio: 200, ParticipacaoPF: 55, ParticipacaoPJ: 45, PagadoresUnicosPF: 110, PagadoresUnicosPJ: 55, RecebedoresUnicosPF: 40, RecebedoresUnicosPJ: 20, RelacaoPagadoresRecebedoresPF: 2.75, RelacaoPagadoresRecebedoresPJ: 2.75 },
    { Estado: 'Santa Catarina', DinheiroMovimentado: 30000, QuantidadeTransacoes: 150, TicketMedio: 200, ParticipacaoPF: 52, ParticipacaoPJ: 48, PagadoresUnicosPF: 100, PagadoresUnicosPJ: 50, RecebedoresUnicosPF: 30, RecebedoresUnicosPJ: 15, RelacaoPagadoresRecebedoresPF: 3.33, RelacaoPagadoresRecebedoresPJ: 3.33 },
    { Estado: 'Sergipe', DinheiroMovimentado: 20000, QuantidadeTransacoes: 100, TicketMedio: 200, ParticipacaoPF: 58, ParticipacaoPJ: 42, PagadoresUnicosPF: 90, PagadoresUnicosPJ: 45, RecebedoresUnicosPF: 20, RecebedoresUnicosPJ: 10, RelacaoPagadoresRecebedoresPF: 4.5, RelacaoPagadoresRecebedoresPJ: 4.5 },
    { Estado: 'Paraíba', DinheiroMovimentado: 10000, QuantidadeTransacoes: 50, TicketMedio: 200, ParticipacaoPF: 60, ParticipacaoPJ: 40, PagadoresUnicosPF: 80, PagadoresUnicosPJ: 40, RecebedoresUnicosPF: 10, RecebedoresUnicosPJ: 5, RelacaoPagadoresRecebedoresPF: 8.0, RelacaoPagadoresRecebedoresPJ: 8.0 }
  ];

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
        // Validate Pix data
        const validPixData = pixData.filter((d: AggregatedMetrics) => 
          d.Estado && !isNaN(d.DinheiroMovimentado) && d.DinheiroMovimentado !== null
        );
        if (validPixData.length === 0) {
          console.warn('No valid Pix data received; using fallback data');
          setData(fallbackData);
          setError('No valid Pix data; using fallback data');
        } else {
          setData(validPixData);
        }
        setGeoJson(geoJsonResponse);

        // Debug state mismatches
        const geoJsonStates = new Set(geoJsonResponse.features.map((f: any) => normalizeName(f.properties.NM_UF)));
        const pixStates = new Set(validPixData.map((d: AggregatedMetrics) => normalizeName(d.Estado)));
        const unmatchedGeoJson = [...geoJsonStates].filter((state) => !pixStates.has(state));
        const unmatchedPix = [...pixStates].filter((state) => !geoJsonStates.has(state));
        if (unmatchedGeoJson.length > 0) {
          console.warn('GeoJSON states not found in Pix data:', unmatchedGeoJson);
        }
        if (unmatchedPix.length > 0) {
          console.warn('Pix data states not found in GeoJSON:', unmatchedPix);
        }
        console.log('Pix Data States:', validPixData.map((d: AggregatedMetrics) => d.Estado));
        console.log('GeoJSON States:', geoJsonResponse.features.map((f: any) => f.properties.NM_UF));
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setData(fallbackData);
        setError('Failed to load Pix data; using fallback data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0 && geoJson && mapRef.current) {
      // Validate Pix data
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
      const volumeExtent = validVolumes.length > 0 ? d3.extent(validVolumes) : [0, 1000000];
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
            return '#d3d3d3'; // Light gray for unmatched states
          }
          if (isNaN(stateData.DinheiroMovimentado) || stateData.DinheiroMovimentado === null) {
            console.warn(`Invalid transaction volume for state: ${d.properties.NM_UF}`, stateData);
            return '#d3d3d3';
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
              : '#d3d3d3')
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

  // Sort for bar charts
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

  // Pie Chart: PF vs PJ Participation
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
          fill-opacity: 1 !important;
          transition: fill 0.2s, opacity 0.2s;
        }
      `}</style>
    </div>
  );
};

export default PixExplorer;