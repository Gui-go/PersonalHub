import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import WebGLVectorLayer from 'ol/layer/WebGLVector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Papa from 'papaparse';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultInteractions } from 'ol/interaction';
import 'ol/ol.css';


// https://www.kaggle.com/datasets/juanmah/world-cities?resource=download
type CityData = {
  city: string;
  lat: number;
  lng: number;
  country: string;
  population: number;
};

const circlesStyle = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['get', 'population'],
    40000,
    4,
    2000000,
    14,
  ],
  'circle-fill-color': ['match', ['get', 'hover'], 1, '#ff3f3f', '#006688'],
  'circle-rotate-with-view': false,
  'circle-displacement': [0, 0],
  'circle-opacity': [
    'interpolate',
    ['linear'],
    ['get', 'population'],
    40000,
    0.6,
    2000000,
    0.92,
  ],
};

const tileSources = {
  osm: {
    name: 'OpenStreetMap',
    source: new OSM(),
  },
  stamen: {
    name: 'Stamen Terrain',
    source: new XYZ({
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      attributions: [
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      ],
    }),
  },
  esri: {
    name: 'Esri World Imagery',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: [
        'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      ],
    }),
  },
};

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<[number, number] | null>(null);
  const selectedFeature = useRef<Feature | null>(null);
  const [minPopulation, setMinPopulation] = useState<number>(40000);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedTileSource, setSelectedTileSource] = useState<keyof typeof tileSources>('osm');
  const maxPopulation = 2000000;

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent default touch scrolling when interacting with the map
    const preventTouchScroll = (e: TouchEvent) => {
      if (mapRef.current && mapRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    // Add touch event listeners
    mapRef.current.addEventListener('touchstart', preventTouchScroll, { passive: false });
    mapRef.current.addEventListener('touchmove', preventTouchScroll, { passive: false });

    // Load and parse CSV
    fetch('/data/worldcities.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<CityData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        // Create features from CSV rows
        const features = parsed.data.map((city) => {
          const feature = new Feature({
            geometry: new Point(fromLonLat([city.lng, city.lat])),
            city: city.city,
            country: city.country,
            population: city.population,
            hover: 0,
          });
          return feature;
        });

        setAllFeatures(features);

        const vectorSource = new VectorSource({
          features: features.filter((f) => f.get('population') >= minPopulation),
          wrapX: true,
        });
        vectorSourceRef.current = vectorSource;

        const pointsLayer = new WebGLVectorLayer({
          source: vectorSource,
          style: circlesStyle,
        });

        // Initialize tile layer
        const tileLayer = new TileLayer({
          source: tileSources[selectedTileSource].source,
        });
        tileLayerRef.current = tileLayer;

        // Initialize map with explicit touch interactions
        mapInstance.current = new Map({
          target: mapRef.current!,
          layers: [tileLayer, pointsLayer],
          view: new View({
            center: fromLonLat([0, 0]),
            zoom: 2,
          }),
          interactions: defaultInteractions({
            pinchRotate: true, // Enable pinch-to-rotate
            pinchZoom: true, // Enable pinch-to-zoom
            dragPan: true, // Enable drag panning
            mouseWheelZoom: true, // Enable mouse wheel zoom (for desktop)
          }),
          controls: [],
        });

        // Pointer move handler for hover & tooltip
        mapInstance.current.on('pointermove', (ev) => {
          const map = mapInstance.current!;
          if (selectedFeature.current) {
            selectedFeature.current.set('hover', 0);
            selectedFeature.current = null;
            setTooltipContent(null);
            setTooltipPosition(null);
          }

          map.forEachFeatureAtPixel(
            ev.pixel,
            (feature) => {
              // Ensure feature is an actual Feature instance
              if (!(feature instanceof Feature)) {
                return false; // Skip RenderFeature
              }

              feature.set('hover', 1);
              selectedFeature.current = feature;

              const city = feature.get('city');
              const country = feature.get('country');
              const population = feature.get('population');
              setTooltipContent(
                `${city}, ${country} — Population: ${population.toLocaleString()}`
              );

              setTooltipPosition([ev.pixel[0] + 15, ev.pixel[1] + 15]);
              return true; // Stop after first feature found
            },
            {
              layerFilter: (layer) => layer === pointsLayer, // Only check the points layer
            }
          );
        });
      });

    // Cleanup on unmount
    return () => {
      mapInstance.current?.setTarget(undefined);
      if (mapRef.current) {
        mapRef.current.removeEventListener('touchstart', preventTouchScroll);
        mapRef.current.removeEventListener('touchmove', preventTouchScroll);
      }
    };
  }, []);

  // Update features when minPopulation changes
  useEffect(() => {
    if (vectorSourceRef.current && allFeatures.length > 0) {
      vectorSourceRef.current.clear();
      const filteredFeatures = allFeatures.filter(
        (f) => f.get('population') >= minPopulation
      );
      vectorSourceRef.current.addFeatures(filteredFeatures);
    }
  }, [minPopulation, allFeatures]);

  // Update tile layer when selectedTileSource changes
  useEffect(() => {
    if (tileLayerRef.current && mapInstance.current) {
      tileLayerRef.current.setSource(tileSources[selectedTileSource].source);
    }
  }, [selectedTileSource]);

  return (
    <div className="relative w-full h-screen">
      <header className="bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold">World Cities Population Map</h1>
        <p>Hover or tap a city on the map to highlight it</p>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <label htmlFor="popRange" className="mr-2">
              Min population filter: <strong>{minPopulation.toLocaleString()}</strong>
            </label>
            <input
              id="popRange"
              type="range"
              min={40000}
              max={maxPopulation}
              step={10000}
              value={minPopulation}
              onChange={(e) => setMinPopulation(Number(e.target.value))}
              className="w-64"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <label htmlFor="tileSource" className="mr-2">
              Map style:
            </label>
            <select
              id="tileSource"
              value={selectedTileSource}
              onChange={(e) => setSelectedTileSource(e.target.value as keyof typeof tileSources)}
              className="text-black p-1 rounded"
            >
              {Object.entries(tileSources).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <div
        ref={mapRef}
        className="w-full h-full touch-action-none"
        style={{ touchAction: 'none' }}
      />
      {tooltipContent && tooltipPosition && (
        <div
          className="absolute bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{
            top: tooltipPosition[1],
            left: tooltipPosition[0],
            whiteSpace: 'nowrap',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default MapPage;