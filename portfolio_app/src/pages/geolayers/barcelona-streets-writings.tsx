'use client';

import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapObj, setMapObj] = useState<Map | null>(null);

  useEffect(() => {
    const vectorSource = new VectorSource({
      url: '/data/barcelona_streets.geojson',
      format: new GeoJSON({
        dataProjection: 'EPSG:4326', // your data’s coordinate system
        featureProjection: 'EPSG:3857', // map projection
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) =>
        new Style({
          stroke: new Stroke({
            color: '#ff0000', // bright red so it's visible
            width: 3,
            lineCap: 'round',
            lineJoin: 'round',
          }),
        }),
    });

    const map = new Map({
      target: mapRef.current!,
      controls: defaultControls({ zoom: false, attribution: false, rotate: false }),
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.9,
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0], // will be replaced by fit()
        zoom: 2,
      }),
    });

    const overlay = new Overlay({
      element: popupRef.current!,
      autoPan: {
        animation: { duration: 300 },
        margin: 20,
      },
      positioning: 'bottom-center',
      offset: [0, -10],
    });
    overlayRef.current = overlay;
    map.addOverlay(overlay);

    // Fit map to data when loaded
    vectorSource.on('change', () => {
      if (vectorSource.getState() === 'ready' && vectorSource.getFeatures().length > 0) {
        map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });
        setIsLoading(false);
      }
    });

    // Popup on click
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature) {
        const coordinates = event.coordinate;
        const properties = feature.getProperties();
        popupRef.current!.innerHTML = `
          <div class="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-sm transform transition-all duration-200 hover:shadow-2xl">
            <h3 class="font-semibold text-xl text-blue-800">${properties.desc_seg || 'Unnamed segment'}</h3>
            <p class="text-sm text-gray-700"><strong>ID:</strong> ${properties.objectid || 'N/A'}</p>
            <p class="text-sm text-gray-700"><strong>Código:</strong> ${properties.codigo || 'N/A'}</p>
            <p class="text-sm text-gray-700"><strong>Tipo PNV:</strong> ${properties.tipo_pnv || 'N/A'}</p>
          </div>
        `;
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
      }
    });

    setMapObj(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Streets of Barcelona</h1>
        <span className="text-sm font-medium bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full">
          {isLoading ? 'Loading data...' : error ? error : 'Data loaded'}
        </span>
      </header>

      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        <div ref={mapRef} className="absolute inset-0" />
        <div ref={popupRef} className="popup pointer-events-auto" />

        <style jsx global>{`
          .ol-attribution,
          .ol-zoom,
          .ol-rotate {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Home;
