import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Circle } from 'ol/style';
import { Fill, Stroke } from 'ol/style';

const GeoCitiesIvevisited = () => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      setMapError('Map container not found');
      return;
    }

    try {
      console.log('Initializing map with OpenLayers version:', Map.VERSION);

      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const marker = new Feature({
        geometry: new Point(fromLonLat([-48.564151, -27.593550])),
        name: 'Florianópolis',
      });

      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: '#FF0000' }),
            stroke: new Stroke({ color: '#FFFFFF', width: 1 }),
          }),
        })
      );

      vectorSource.addFeature(marker);

      const tileLayer = new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          crossOrigin: 'anonymous',
        }),
      });

      tileLayer.getSource().on('tileloaderror', (event) => {
        console.error('Tile load error:', event);
        setMapError('Failed to load map tiles');
      });

      const map = new Map({
        target: mapRef.current,
        layers: [tileLayer, vectorLayer],
        view: new View({
          center: fromLonLat([-48.564151, -27.593550]),
          zoom: 10,
        }),
      });

      return () => {
        console.log('Cleaning up map');
        if (map) {
          map.setTarget(undefined);
        }
      };
    } catch (error) {
      console.error('Map initialization failed:', error);
      setMapError('Failed to initialize map');
    }
  }, []);

  if (mapError) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Simple Map</h2>
            <div className="w-full h-96 rounded-lg border border-gray-200 flex items-center justify-center">
              <p className="text-red-500">Error: {mapError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Simple Map</h2>
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default GeoCitiesIvevisited;