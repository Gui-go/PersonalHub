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

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [roadData, setRoadData] = useState<RoadSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetch('https://www.guigo.dev.br/api/fetchRoads')
      .then(response => response.json())
      .then(data => setRoadData(data.results))
      .catch(error => console.error('Error fetching road data:', error));
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
      });

      return feature;
    });

    // Create vector source and layer
    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: '#3B82F6',
          width: 4,
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
      },
    });
    overlayRef.current = overlay;
    map.addOverlay(overlay);

    // Click handler for popups and sidebar
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature) {
        const coordinates = event.coordinate;
        const properties = feature.getProperties();
        const segment = roadData.find(s => s.objectid === properties.objectid);
        if (segment) {
          setSelectedSegment(segment);
          setIsSidebarOpen(true);
          popupRef.current!.innerHTML = `
            <div class="bg-white p-3 rounded-lg shadow-lg border border-blue-200">
              <h3 class="font-semibold text-blue-600">${properties.desc_seg}</h3>
              <p class="text-sm text-gray-600">Click for more details</p>
            </div>
          `;
          overlay.setPosition(coordinates);
        }
      } else {
        overlay.setPosition(undefined);
        setIsSidebarOpen(false);
        setSelectedSegment(null);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [roadData]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Road Network Explorer</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <div ref={mapRef} className="flex-grow" />
        <div
          className={`bg-white shadow-lg p-6 w-80 transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } fixed right-0 top-16 bottom-0 overflow-y-auto`}
        >
          {selectedSegment ? (
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-4">{selectedSegment.desc_seg}</h2>
              <p className="text-gray-700 mb-2"><strong>Object ID:</strong> {selectedSegment.objectid}</p>
              <p className="text-gray-700 mb-2"><strong>Código:</strong> {selectedSegment.codigo}</p>
              <p className="text-gray-700 mb-2"><strong>Tipo PNV:</strong> {selectedSegment.tipo_pnv || 'N/A'}</p>
              <p className="text-gray-700"><strong>Geometry:</strong> {selectedSegment.geom.slice(0, 50)}...</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Click a road segment to view details</p>
          )}
        </div>
      </div>
      <div ref={popupRef} className="popup" />
    </div>
  );
};

export default Home;