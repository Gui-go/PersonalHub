'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, get as getProjection } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, FullScreen, ScaleLine } from 'ol/control';
import { boundingExtent } from 'ol/extent';

type City = {
  id: number;
  name: string;
  lon: number;
  lat: number;
};

const cities: City[] = [
  { id: 1, name: "Florianópolis, Santa Catarina", lon: -48.564151, lat: -27.59355 },
  { id: 2, name: "São José, Santa Catarina", lon: -48.6367, lat: -27.6136 },
  { id: 3, name: "Palhoça, Santa Catarina", lon: -48.6691, lat: -27.6458 },
  { id: 4, name: "Biguaçu, Santa Catarina", lon: -48.659, lat: -27.4956 },
  { id: 5, name: "Santo Amaro da Imperatriz, Santa Catarina", lon: -48.7817, lat: -27.6858 },
  { id: 6, name: "Chapecó, Santa Catarina", lon: -52.6152, lat: -27.0964 },
  { id: 7, name: "Joinville, Santa Catarina", lon: -48.8451, lat: -26.3045 },
  { id: 8, name: "Blumenau, Santa Catarina", lon: -49.0661, lat: -26.9155 },
  { id: 9, name: "Jaraguá do Sul, Santa Catarina", lon: -49.0713, lat: -26.4851 },
  { id: 10, name: "Balneário Camboriú, Santa Catarina", lon: -48.6175, lat: -26.9926 },
  { id: 11, name: "Curitiba, Paraná", lon: -49.2775, lat: -25.4284 },
  { id: 12, name: "São Paulo, São Paulo", lon: -46.6333, lat: -23.5505 },
  { id: 13, name: "Campinas, São Paulo", lon: -47.0626, lat: -22.9056 },
  { id: 14, name: "Rio de Janeiro, Rio de Janeiro", lon: -43.1729, lat: -22.9068 },
  { id: 15, name: "Rio Claro, São Paulo", lon: -47.556, lat: -22.3988 },
  { id: 16, name: "Washington DC, USA", lon: -77.0369, lat: 38.9072 },
  { id: 17, name: "Lisbon, Portugal", lon: -9.1393, lat: 38.7223 },
  { id: 18, name: "Porto, Portugal", lon: -8.6102, lat: 41.1496 },
  { id: 19, name: "Faro, Portugal", lon: -7.9304, lat: 37.0194 },
  { id: 20, name: "Coimbra, Portugal", lon: -8.4265, lat: 40.2033 },
  { id: 21, name: "Braga, Portugal", lon: -8.4253, lat: 41.5331 },
  { id: 22, name: "Aveiro, Portugal", lon: -8.6455, lat: 40.6443 },
  { id: 23, name: "Setúbal, Portugal", lon: -8.8882, lat: 38.5244 },
  { id: 24, name: "Vila Real de Santo António, Portugal", lon: -7.4208, lat: 37.199 },
  { id: 25, name: "Elvas, Portugal", lon: -7.1633, lat: 38.8815 },
  { id: 26, name: "Évora, Portugal", lon: -7.9065, lat: 38.5714 },
  { id: 27, name: "Guarda, Portugal", lon: -7.2637, lat: 40.5364 },
  { id: 28, name: "Fundão, Portugal", lon: -7.5003, lat: 40.141 },
  { id: 29, name: "Madrid, Spain", lon: -3.7038, lat: 40.4168 },
  { id: 30, name: "Barcelona, Spain", lon: 2.1734, lat: 41.3851 },
  { id: 31, name: "Badajoz, Spain", lon: -6.9707, lat: 38.8794 },
  { id: 32, name: "Salamanca, Spain", lon: -5.6631, lat: 40.9701 },
  { id: 33, name: "Seville, Spain", lon: -5.9845, lat: 37.3891 },
  { id: 34, name: "Málaga, Spain", lon: -4.4203, lat: 36.7213 },
  { id: 35, name: "Granada, Spain", lon: -3.5986, lat: 37.1773 },
  { id: 36, name: "Córdoba, Spain", lon: -4.7794, lat: 37.8882 },
  { id: 37, name: "Cádiz, Spain", lon: -6.2946, lat: 36.5297 },
  { id: 38, name: "Valencia, Spain", lon: -0.3774, lat: 39.4699 },
  { id: 39, name: "Castellón de la Plana, Spain", lon: -0.0576, lat: 39.9864 },
  { id: 40, name: "Gibraltar, UK", lon: -5.3436, lat: 36.1408 },
  { id: 41, name: "Dublin, Ireland", lon: -6.2603, lat: 53.3498 },
  { id: 42, name: "Cork, Ireland", lon: -8.4761, lat: 51.8969 },
  { id: 43, name: "Belfast, Ireland", lon: -5.9301, lat: 54.5973 },
  { id: 44, name: "Limerick, Ireland", lon: -8.6291, lat: 52.668 },
  { id: 45, name: "Galway, Ireland", lon: -9.0488, lat: 53.2707 },
  { id: 46, name: "London, England", lon: -0.1276, lat: 51.5074 },
  { id: 47, name: "Manchester, England", lon: -2.2426, lat: 53.4808 },
  { id: 48, name: "Edinburgh, Scotland", lon: -3.1883, lat: 55.9533 },
  { id: 49, name: "Münster, Germany", lon: 7.6261, lat: 51.9607 },
  { id: 50, name: "Dortmund, Germany", lon: 7.4686, lat: 51.5136 },
  { id: 51, name: "Bonn, Germany", lon: 7.0982, lat: 50.7374 },
  { id: 52, name: "Wuppertal, Germany", lon: 7.1864, lat: 51.2563 },
  { id: 53, name: "Essen, Germany", lon: 7.0123, lat: 51.4556 },
  { id: 54, name: "Duisburg, Germany", lon: 6.7735, lat: 51.4344 },
  { id: 55, name: "Köln, Germany", lon: 6.9603, lat: 50.9375 },
  { id: 56, name: "Aachen, Germany", lon: 6.0834, lat: 50.7753 },
  { id: 57, name: "Hamburg, Germany", lon: 9.9937, lat: 53.5511 },
  { id: 58, name: "Munich, Germany", lon: 11.581, lat: 48.1351 },
  { id: 59, name: "Berlin, Germany", lon: 13.405, lat: 52.52 },
  { id: 60, name: "Leipzig, Germany", lon: 12.3731, lat: 51.3397 },
  { id: 61, name: "Jena, Germany", lon: 11.5886, lat: 50.9277 },
  { id: 62, name: "Frankfurt am Main, Germany", lon: 8.6821, lat: 50.1109 },
  { id: 63, name: "Frankfurt an der Oder, Germany", lon: 14.5501, lat: 52.3411 },
  { id: 64, name: "Stuttgart, Germany", lon: 9.1829, lat: 48.7758 },
  { id: 65, name: "Erfurt, Germany", lon: 10.9847, lat: 50.9848 },
  { id: 66, name: "Hanover, Germany", lon: 9.7332, lat: 52.3759 },
  { id: 67, name: "Osnabrück, Germany", lon: 8.0476, lat: 52.2799 },
  { id: 68, name: "Bremen, Germany", lon: 8.8017, lat: 53.0793 },
  { id: 69, name: "Salzburg, Austria", lon: 13.0434, lat: 47.8095 },
  { id: 70, name: "Flachau, Austria", lon: 13.3833, lat: 47.3333 },
  { id: 71, name: "Nuremberg, Germany", lon: 11.0775, lat: 49.4521 },
  { id: 72, name: "Bielefeld, Germany", lon: 8.5325, lat: 52.0302 },
  { id: 73, name: "Emden, Germany", lon: 8.212, lat: 53.3667 },
  { id: 74, name: "Hamm, Germany", lon: 7.199, lat: 51.6739 },
  { id: 75, name: "Würzburg, Germany", lon: 9.9333, lat: 49.7903 },
  { id: 76, name: "Luxembourg City, Luxembourg", lon: 6.1296, lat: 49.6118 },
  { id: 77, name: "Esch-sur-Alzette, Luxembourg", lon: 6.0369, lat: 49.5 },
  { id: 78, name: "Rome, Italy", lon: 12.4964, lat: 41.9028 },
  { id: 79, name: "Florence, Italy", lon: 11.2558, lat: 43.7696 },
  { id: 80, name: "Pisa, Italy", lon: 10.3966, lat: 43.7228 },
  { id: 81, name: "Amsterdam, Netherlands", lon: 4.8952, lat: 52.3702 },
  { id: 82, name: "Enschede, Netherlands", lon: 6.8937, lat: 52.2215 },
  { id: 83, name: "Eindhoven, Netherlands", lon: 5.4697, lat: 51.4416 },
  { id: 84, name: "Moscow, Russia", lon: 37.6173, lat: 55.7558 },
  { id: 85, name: "Panama City, Panama", lon: -79.5199, lat: 8.9824 },
  { id: 86, name: "Colón, Panama", lon: -79.9068, lat: 9.356 },
  { id: 87, name: "Asunción, Paraguay", lon: -57.5759, lat: -25.2637 },
  { id: 88, name: "Ciudad del Este, Paraguay", lon: -54.6111, lat: -25.5097 },
  { id: 89, name: "Foz do Iguaçu, Brazil", lon: -54.5881, lat: -25.5163 },
  { id: 90, name: "Puerto Iguazú, Argentina", lon: -54.5736, lat: -25.5991 }
];

const tileSources = {
  OpenStreetMap: new XYZ({
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
  }),
  Satellite: new XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    crossOrigin: 'anonymous',
  }),
  Topographic: new XYZ({
    url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
  }),
};

const GeoCitiesIveVisited = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayer<XYZ> | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    markerLayerRef.current = vectorLayer;

    const baseTileLayer = new TileLayer({ source: tileSources.OpenStreetMap });
    setTileLayer(baseTileLayer);

    const popupOverlay = new Overlay({
      element: popupRef.current!,
      offset: [10, 0],
      positioning: 'bottom-left',
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [baseTileLayer, vectorLayer],
      view: new View({
        center: fromLonLat([0, 15]),
        zoom: 4,
        projection: getProjection('EPSG:3857'),
      }),
      overlays: [popupOverlay],
      controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    });

    mapInstance.on('pointermove', (e) => {
      if (mapInstance.hasFeatureAtPixel(e.pixel)) {
        const feature = mapInstance.getFeaturesAtPixel(e.pixel)?.[0];
        if (feature && popupRef.current) {
          popupRef.current.innerHTML = feature.get('name') || '';
          popupOverlay.setPosition(e.coordinate);
        }
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map || !markerLayerRef.current) return;

    const source = new VectorSource();

    const features = cities.map((city) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([city.lon, city.lat])),
        name: city.name,
      });

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: '#FF0000' }),
            stroke: new Stroke({ color: '#fff', width: 1 }),
          }),
          text: showLabels
            ? new Text({
                text: city.name,
                offsetY: -15,
                fill: new Fill({ color: '#222' }),
                stroke: new Stroke({ color: '#fff', width: 2 }),
                font: '12px sans-serif',
              })
            : undefined,
        })
      );
      return feature;
    });

    source.addFeatures(features);
    markerLayerRef.current.setSource(source);
  }, [map, showLabels]);

  const handleTileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (tileLayer) {
      tileLayer.setSource(tileSources[e.target.value as keyof typeof tileSources]);
    }
  };

  return (
    <div className="relative w-full h-[90vh]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded shadow-md space-y-2 w-64">
        <h2 className="font-semibold text-lg">🗺️ Map Options</h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Tile Layer</label>
          <select
            onChange={handleTileChange}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            {Object.keys(tileSources).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={() => setShowLabels((prev) => !prev)}
          />
          <label>Show Labels</label>
        </div>


      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-full border border-gray-300 rounded"
      />
      {/* Tooltip */}
      <div
        ref={popupRef}
        className="absolute z-10 bg-white px-2 py-1 border border-gray-300 rounded text-sm pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default GeoCitiesIveVisited;
