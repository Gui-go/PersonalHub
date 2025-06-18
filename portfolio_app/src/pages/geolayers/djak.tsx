import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

interface RoadSegment {
  geom: string;
  objectid: number;
  codigo: string;
  tipo_pnv: string | null;
  desc_seg: string;
}

// Expanded pseudo data for fallback
const pseudoData: RoadSegment[] = [
  {
    geom: "LINESTRING(-35.1468769978752 -8.8985496994091, -5.1482950084079 -8.89831969689652)",
    objectid: 7353,
    codigo: "AC7353",
    tipo_pnv: null,
    desc_seg: "ACESSO SÃO JOSÉ DA COROA GRANDE",
  },
  {
    geom: "LINESTRING(-48.9587511806225 -22.4626172284024, -48.9883743946626 -22.4700551748065, -48.990123456789 -22.4712345678901)",
    objectid: 16860,
    codigo: "AC16860",
    tipo_pnv: "BR",
    desc_seg: "ACESSO AGUDOS",
  },
  {
    geom: "LINESTRING(-49.9203833608034 -29.2949805363227, -49.9242513062527 -29.2761904890998, -49.9230070222563 -29.2702132323548, -49.9108391383156 -29.2581795002837)",
    objectid: 16142,
    codigo: "494ERS0050",
    tipo_pnv: null,
    desc_seg: "ENTR. BR/453 (P/TORRES) - MAMPITUBA",
  },
  {
    geom: "LINESTRING(-47.1366858681583 -23.5432923161874, -47.1821459338877 -23.5462647077501, -47.190123456789 -23.5487654321098)",
    objectid: 16868,
    codigo: "AC16868",
    tipo_pnv: "SP",
    desc_seg: "ACESSO MAIRINQUE",
  },
  {
    geom: "LINESTRING(-39.1390266611515 -3.46783183237318, -39.1433689387255 -3.45779101594263, -39.1477099626447 -3.44032965139229)",
    objectid: 6799,
    codigo: "AC6799",
    tipo_pnv: null,
    desc_seg: "ACESSO PARAIPABA",
  },
];

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [roadData, setRoadData] = useState<RoadSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from API with fallback to pseudo data
    fetch('https://www.guigo.dev.br/api/fetchRoads')
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => {
        setRoadData(data.results);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching road data:', error);
        setError('Failed to fetch data. Using sample data instead.');
        setRoadData(pseudoData);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current || roadData.length === 0) return;

    // Parse LINESTRING to coordinates
    const features = roadData.map(segment => {
      const coords = segment.geom
        .replace('LINESTRING(', '')
        .replace(')', '')
        .split(', ')
        .map(coord => {
          const [lon, lat] = coord.split(' ').map(Number);
          return fromLonLat([lon, lat]);
        });

      const feature = new Feature({
        geometry: new LineString(coords),
        objectid: segment.objectid,
        codigo: segment.codigo,
        desc_seg: segment.desc_seg,
        tipo_pnv: segment.tipo_pnv,
      });

      return feature;
    });

    // Create vector source and layer
    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => new Style({
        stroke: new Stroke({
          color: feature.get('objectid') === overlayRef.current?.get('selectedId') ? '#F59E0B' : '#3B82F6',
          width: feature.get('objectid') === overlayRef.current?.get('selectedId') ? 6 : 4,
        }),
      }),
    });

    // Initialize map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-40, -15]),
        zoom: 5,
      }),
    });

    // Initialize popup
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: { duration: 250 },
        margin: 20,
      },
    });
    overlayRef.current = overlay;
    map.addOverlay(overlay);

    // Click handler for popups
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature) {
        const coordinates = event.coordinate;
        const properties = feature.getProperties();
        overlay.set('selectedId', properties.objectid);
        vectorLayer.changed(); // Refresh layer to update styles
        popupRef.current!.innerHTML = `
          <div class="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 max-w-xs">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-lg text-blue-700">${properties.desc_seg}</h3>
              <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.ol-overlay-container').style.display='none'">✕</button>
            </div>
            <p class="text-sm text-gray-600"><strong>ID:</strong> ${properties.objectid}</p>
            <p class="text-sm text-gray-600"><strong>Código:</strong> ${properties.codigo}</p>
            <p class="text-sm text-gray-600"><strong>Tipo PNV:</strong> ${properties.tipo_pnv || 'N/A'}</p>
            <p class="text-xs text-gray-500 mt-2 truncate"><strong>Geom:</strong> ${properties.geometry.toString().slice(0, 30)}...</p>
          </div>
        `;
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
        overlay.set('selectedId', null);
        vectorLayer.changed();
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [roadData]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Road Network Analyzer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            {isLoading ? 'Loading data...' : error ? error : `${roadData.length} segments loaded`}
          </span>
        </div>
      </header>
      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}
        <div ref={mapRef} className="absolute inset-0" />
        <div ref={popupRef} className="popup" />
      </div>
    </div>
  );
};

export default Home;