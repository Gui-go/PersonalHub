import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Text, Circle } from 'ol/style';
import { Fill, Stroke } from 'ol/style';

// Your provided data
const citiesVisited = [
  {
    "id": 1,
    "name": "Florianópolis, Santa Catarina",
    "geom": "POINT(-48.564151 -27.593550)"
  },
  {
    "id": 2,
    "name": "São José, Santa Catarina",
    "geom": "POINT(-48.6367 -27.6136)"
  },
  {
    "id": 3,
    "name": "Palhoça, Santa Catarina",
    "geom": "POINT(-48.6691 -27.6458)"
  },
  {
    "id": 4,
    "name": "Biguaçu, Santa Catarina",
    "geom": "POINT(-48.6590 -27.4956)"
  },
  {
    "id": 5,
    "name": "Santo Amaro da Imperatriz, Santa Catarina",
    "geom": "POINT(-48.7817 -27.6858)"
  },
  {
    "id": 6,
    "name": "Chapecó, Santa Catarina",
    "geom": "POINT(-52.6152 -27.0964)"
  },
  {
    "id": 7,
    "name": "Joinville, Santa Catarina",
    "geom": "POINT(-48.8451 -26.3045)"
  },
  {
    "id": 8,
    "name": "Blumenau, Santa Catarina",
    "geom": "POINT(-49.0661 -26.9155)"
  },
  {
    "id": 9,
    "name": "Jaraguá do Sul, Santa Catarina",
    "geom": "POINT(-49.0713 -26.4851)"
  },
  {
    "id": 10,
    "name": "Balneário Camboriú, Santa Catarina",
    "geom": "POINT(-48.6175 -26.9926)"
  },
  {
    "id": 11,
    "name": "Curitiba, Paraná",
    "geom": "POINT(-49.2775 -25.4284)"
  },
  {
    "id": 12,
    "name": "São Paulo, São Paulo",
    "geom": "POINT(-46.6333 -23.5505)"
  },
  {
    "id": 13,
    "name": "Campinas, São Paulo",
    "geom": "POINT(-47.0626 -22.9056)"
  },
  {
    "id": 14,
    "name": "Rio de Janeiro, Rio de Janeiro",
    "geom": "POINT(-43.1729 -22.9068)"
  },
  {
    "id": 15,
    "name": "Rio Claro, São Paulo",
    "geom": "POINT(-47.5560 -22.3988)"
  },
  {
    "id": 16,
    "name": "Washington DC, USA",
    "geom": "POINT(-77.0369 38.9072)"
  },
  {
    "id": 17,
    "name": "Lisbon, Portugal",
    "geom": "POINT(-9.1393 38.7223)"
  },
  {
    "id": 18,
    "name": "Porto, Portugal",
    "geom": "POINT(-8.6102 41.1496)"
  },
  {
    "id": 19,
    "name": "Faro, Portugal",
    "geom": "POINT(-7.9304 37.0194)"
  },
  {
    "id": 20,
    "name": "Coimbra, Portugal",
    "geom": "POINT(-8.4265 40.2033)"
  },
  {
    "id": 21,
    "name": "Braga, Portugal",
    "geom": "POINT(-8.4253 41.5331)"
  },
  {
    "id": 22,
    "name": "Aveiro, Portugal",
    "geom": "POINT(-8.6455 40.6443)"
  },
  {
    "id": 23,
    "name": "Setúbal, Portugal",
    "geom": "POINT(-8.8882 38.5244)"
  },
  {
    "id": 24,
    "name": "Vila Real de Santo António, Portugal",
    "geom": "POINT(-7.4208 37.1990)"
  },
  {
    "id": 25,
    "name": "Elvas, Portugal",
    "geom": "POINT(-7.1633 38.8815)"
  },
  {
    "id": 26,
    "name": "Évora, Portugal",
    "geom": "POINT(-7.9065 38.5714)"
  },
  {
    "id": 27,
    "name": "Guarda, Portugal",
    "geom": "POINT(-7.2637 40.5364)"
  },
  {
    "id": 28,
    "name": "Fundão, Portugal",
    "geom": "POINT(-7.5003 40.1410)"
  },
  {
    "id": 29,
    "name": "Madrid, Spain",
    "geom": "POINT(-3.7038 40.4168)"
  },
  {
    "id": 30,
    "name": "Barcelona, Spain",
    "geom": "POINT(2.1734 41.3851)"
  },
  {
    "id": 31,
    "name": "Badajoz, Spain",
    "geom": "POINT(-6.9707 38.8794)"
  },
  {
    "id": 32,
    "name": "Salamanca, Spain",
    "geom": "POINT(-5.6631 40.9701)"
  },
  {
    "id": 33,
    "name": "Seville, Spain",
    "geom": "POINT(-5.9845 37.3891)"
  },
  {
    "id": 34,
    "name": "Málaga, Spain",
    "geom": "POINT(-4.4203 36.7213)"
  },
  {
    "id": 35,
    "name": "Granada, Spain",
    "geom": "POINT(-3.5986 37.1773)"
  },
  {
    "id": 36,
    "name": "Córdoba, Spain",
    "geom": "POINT(-4.7794 37.8882)"
  },
  {
    "id": 37,
    "name": "Cádiz, Spain",
    "geom": "POINT(-6.2946 36.5297)"
  },
  {
    "id": 38,
    "name": "Valencia, Spain",
    "geom": "POINT(-0.3774 39.4699)"
  },
  {
    "id": 39,
    "name": "Castellón de la Plana, Spain",
    "geom": "POINT(-0.0576 39.9864)"
  },
  {
    "id": 40,
    "name": "Gibraltar, UK",
    "geom": "POINT(-5.3436 36.1408)"
  },
  {
    "id": 41,
    "name": "Dublin, Ireland",
    "geom": "POINT(-6.2603 53.3498)"
  },
  {
    "id": 42,
    "name": "Cork, Ireland",
    "geom": "POINT(-8.4761 51.8969)"
  },
  {
    "id": 43,
    "name": "Belfast, Ireland",
    "geom": "POINT(-5.9301 54.5973)"
  },
  {
    "id": 44,
    "name": "Limerick, Ireland",
    "geom": "POINT(-8.6291 52.6680)"
  },
  {
    "id": 45,
    "name": "Galway, Ireland",
    "geom": "POINT(-9.0488 53.2707)"
  },
  {
    "id": 46,
    "name": "London, England",
    "geom": "POINT(-0.1276 51.5074)"
  },
  {
    "id": 47,
    "name": "Manchester, England",
    "geom": "POINT(-2.2426 53.4808)"
  },
  {
    "id": 48,
    "name": "Edinburgh, Scotland",
    "geom": "POINT(-3.1883 55.9533)"
  },
  {
    "id": 49,
    "name": "Münster, Germany",
    "geom": "POINT(7.6261 51.9607)"
  },
  {
    "id": 50,
    "name": "Dortmund, Germany",
    "geom": "POINT(7.4686 51.5136)"
  },
  {
    "id": 51,
    "name": "Bonn, Germany",
    "geom": "POINT(7.0982 50.7374)"
  },
  {
    "id": 52,
    "name": "Wuppertal, Germany",
    "geom": "POINT(7.1864 51.2563)"
  },
  {
    "id": 53,
    "name": "Essen, Germany",
    "geom": "POINT(7.0123 51.4556)"
  },
  {
    "id": 54,
    "name": "Duisburg, Germany",
    "geom": "POINT(6.7735 51.4344)"
  },
  {
    "id": 55,
    "name": "Köln, Germany",
    "geom": "POINT(6.9603 50.9375)"
  },
  {
    "id": 56,
    "name": "Aachen, Germany",
    "geom": "POINT(6.0834 50.7753)"
  },
  {
    "id": 57,
    "name": "Hamburg, Germany",
    "geom": "POINT(9.9937 53.5511)"
  },
  {
    "id": 58,
    "name": "Munich, Germany",
    "geom": "POINT(11.5810 48.1351)"
  },
  {
    "id": 59,
    "name": "Berlin, Germany",
    "geom": "POINT(13.4050 52.5200)"
  },
  {
    "id": 60,
    "name": "Leipzig, Germany",
    "geom": "POINT(12.3731 51.3397)"
  },
  {
    "id": 61,
    "name": "Jena, Germany",
    "geom": "POINT(11.5886 50.9277)"
  },
  {
    "id": 62,
    "name": "Frankfurt am Main, Germany",
    "geom": "POINT(8.6821 50.1109)"
  },
  {
    "id": 63,
    "name": "Frankfurt an der Oder, Germany",
    "geom": "POINT(14.5501 52.3411)"
  },
  {
    "id": 64,
    "name": "Stuttgart, Germany",
    "geom": "POINT(9.1829 48.7758)"
  },
  {
    "id": 65,
    "name": "Erfurt, Germany",
    "geom": "POINT(10.9847 50.9848)"
  },
  {
    "id": 66,
    "name": "Hanover, Germany",
    "geom": "POINT(9.7332 52.3759)"
  },
  {
    "id": 67,
    "name": "Osnabrück, Germany",
    "geom": "POINT(8.0476 52.2799)"
  },
  {
    "id": 68,
    "name": "Bremen, Germany",
    "geom": "POINT(8.8017 53.0793)"
  },
  {
    "id": 69,
    "name": "Salzburg, Austria",
    "geom": "POINT(13.0434 47.8095)"
  },
  {
    "id": 70,
    "name": "Flachau, Austria",
    "geom": "POINT(13.3833 47.3333)"
  },
  {
    "id": 71,
    "name": "Nuremberg, Germany",
    "geom": "POINT(11.0775 49.4521)"
  },
  {
    "id": 72,
    "name": "Bielefeld, Germany",
    "geom": "POINT(8.5325 52.0302)"
  },
  {
    "id": 73,
    "name": "Emden, Germany",
    "geom": "POINT(8.2120 53.3667)"
  },
  {
    "id": 74,
    "name": "Hamm, Germany",
    "geom": "POINT(7.1990 51.6739)"
  },
  {
    "id": 75,
    "name": "Würzburg, Germany",
    "geom": "POINT(9.9333 49.7903)"
  },
  {
    "id": 76,
    "name": "Luxembourg City, Luxembourg",
    "geom": "POINT(6.1296 49.6118)"
  },
  {
    "id": 77,
    "name": "Esch-sur-Alzette, Luxembourg",
    "geom": "POINT(6.0369 49.5000)"
  },
  {
    "id": 78,
    "name": "Rome, Italy",
    "geom": "POINT(12.4964 41.9028)"
  },
  {
    "id": 79,
    "name": "Florence, Italy",
    "geom": "POINT(11.2558 43.7696)"
  },
  {
    "id": 80,
    "name": "Pisa, Italy",
    "geom": "POINT(10.3966 43.7228)"
  },
  {
    "id": 81,
    "name": "Amsterdam, Netherlands",
    "geom": "POINT(4.8952 52.3702)"
  },
  {
    "id": 82,
    "name": "Enschede, Netherlands",
    "geom": "POINT(6.8937 52.2215)"
  },
  {
    "id": 83,
    "name": "Eindhoven, Netherlands",
    "geom": "POINT(5.4697 51.4416)"
  },
  {
    "id": 84,
    "name": "Moscow, Russia",
    "geom": "POINT(37.6173 55.7558)"
  },
  {
    "id": 85,
    "name": "Panama City, Panama",
    "geom": "POINT(-79.5199 8.9824)"
  },
  {
    "id": 86,
    "name": "Colón, Panama",
    "geom": "POINT(-79.9068 9.3560)"
  },
  {
    "id": 87,
    "name": "Asunción, Paraguay",
    "geom": "POINT(-57.5759 -25.2637)"
  },
  {
    "id": 88,
    "name": "Ciudad del Este, Paraguay",
    "geom": "POINT(-54.6111 -25.5097)"
  },
  {
    "id": 89,
    "name": "Foz do Iguaçu, Brazil",
    "geom": "POINT(-54.5881 -25.5163)"
  },
  {
    "id": 90,
    "name": "Puerto Iguazú, Argentina",
    "geom": "POINT(-54.5736 -25.5991)"
  }
];

// Helper function to extract coordinates from WKT POINT string
const parseWktPoint = (wkt) => {
  const match = wkt.match(/POINT\(([^)]+)\)/);
  if (!match) return [0, 0];
  
  const coords = match[1].split(' ');
  return [parseFloat(coords[0]), parseFloat(coords[1])];
};

// Map style configurations
const mapStyles = [
  {
    id: 'osm',
    name: 'Street Map (OSM)',
    source: () => new OSM()
  },
  {
    id: 'satellite',
    name: 'Satellite (Esri)',
    source: () => new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri</a>, USGS, NOAA'
    })
  },
  {
    id: 'topo',
    name: 'Topographic (OpenTopoMap)',
    source: () => new XYZ({
      url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attributions: 'Map data: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
  }
];

const GeoCitiesIvevisited = () => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSourceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const featuresRef = useRef({});
  const [mapStyle, setMapStyle] = useState('osm');
  const [showLabels, setShowLabels] = useState(false);

  // Base style for markers (without text)
  const defaultStyleBase = {
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: '#FF0000'
      }),
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 1
      })
    })
  };

  const hoverStyleBase = {
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: '#00FF00'
      }),
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 1.5
      })
    })
  };

  // Function to create marker style based on showLabels
  const createMarkerStyle = (cityName, isHover = false) => {
    const baseStyle = isHover ? hoverStyleBase : defaultStyleBase;
    return new Style({
      ...baseStyle,
      text: showLabels
        ? new Text({
            text: cityName.split(',')[0],
            offsetY: -15,
            font: 'bold 12px Arial',
            fill: new Fill({ color: '#000000' }),
            stroke: new Stroke({
              color: '#FFFFFF',
              width: 3
            })
          })
        : new Text({ text: '' })
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize vector source and layer
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Initialize tile layer
    const tileLayer = new TileLayer({
      source: mapStyles.find(style => style.id === mapStyle).source()
    });
    tileLayerRef.current = tileLayer;

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [tileLayer, vectorLayer],
      view: new View({
        center: fromLonLat([-48.5, -27.5]),
        zoom: 10
      })
    });
    mapInstance.current = map;

    // Add markers for each visited city
    citiesVisited.forEach(city => {
      const coords = parseWktPoint(city.geom);
      const marker = new Feature({
        geometry: new Point(fromLonLat(coords)),
        name: city.name,
        id: city.id
      });

      marker.setStyle(createMarkerStyle(city.name));
      vectorSource.addFeature(marker);
      featuresRef.current[city.id] = marker;
    });

    // Fit view to show all markers with padding
    if (citiesVisited.length > 0) {
      map.getView().fit(vectorSource.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 12
      });
    }

    // Click interaction for showing popup
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature;
      });

      if (feature && popupRef.current) {
        const name = feature.get('name');
        
        popupRef.current.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-lg text-gray-800">${name}</h3>
              <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.style.display='none'">×</button>
            </div>
          </div>
        `;
        
        popupRef.current.style.display = 'block';
        popupRef.current.style.left = `${evt.pixel[0]}px`;
        popupRef.current.style.top = `${evt.pixel[1]}px`;
      } else if (popupRef.current) {
        popupRef.current.style.display = 'none';
      }
    });

    // Clean up on unmount
    return () => {
      if (map) map.setTarget(undefined);
    };
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (tileLayerRef.current && mapInstance.current) {
      const selectedStyle = mapStyles.find(style => style.id === mapStyle);
      if (selectedStyle) {
        const newSource = selectedStyle.source();
        tileLayerRef.current.setSource(newSource);
        // Force map to update
        mapInstance.current.render();
      }
    }
  }, [mapStyle]);

  // Update marker styles when showLabels changes
  useEffect(() => {
    Object.values(featuresRef.current).forEach(feature => {
      const name = feature.get('name');
      feature.setStyle(createMarkerStyle(name));
    });
  }, [showLabels]);

  // Function to handle city click from the list
  const handleCityClick = (city) => {
    const feature = featuresRef.current[city.id];
    if (feature && mapInstance.current) {
      const coords = parseWktPoint(city.geom);
      mapInstance.current.getView().animate({
        center: fromLonLat(coords),
        zoom: 12,
        duration: 500
      });
      popupRef.current.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-gray-800">${city.name}</h3>
            <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.style.display='none'">×</button>
          </div>
        </div>
      `;
      popupRef.current.style.display = 'block';
      const pixel = mapInstance.current.getPixelFromCoordinate(fromLonLat(coords));
      popupRef.current.style.left = `${pixel[0]}px`;
      popupRef.current.style.top = `${pixel[1]}px`;
    }
  };

  // Function to handle mouse enter on city list item
  const handleMouseEnter = (cityId) => {
    const feature = featuresRef.current[cityId];
    if (feature) {
      const name = feature.get('name');
      feature.setStyle(createMarkerStyle(name, true));
    }
  };

  // Function to handle mouse leave on city list item
  const handleMouseLeave = (cityId) => {
    const feature = featuresRef.current[cityId];
    if (feature) {
      const name = feature.get('name');
      feature.setStyle(createMarkerStyle(name));
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="p-3 xs:p-4 sm:p-6 md:p-8">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
            Cities I've Visited
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <label htmlFor="mapStyle" className="mr-2 text-gray-700">Map Style:</label>
              <select
                id="mapStyle"
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {mapStyles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labels"
                  checked={showLabels}
                  onChange={() => setShowLabels(true)}
                  className="mr-2"
                />
                Show Labels
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labels"
                  checked={!showLabels}
                  onChange={() => setShowLabels(false)}
                  className="mr-2"
                />
                Hide Labels
              </label>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-80 sm:h-96 md:h-[32rem] rounded-lg border border-gray-200"
            />
            
            <div 
              ref={popupRef}
              className="absolute hidden bg-white p-2 rounded shadow-lg z-10 max-w-xs pointer-events-auto border border-gray-300"
              style={{ transform: 'translate(-50%, -100%)' }}
            />
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {citiesVisited.map((city) => (
              <div 
                key={city.id} 
                className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
                onClick={() => handleCityClick(city)}
                onMouseEnter={() => handleMouseEnter(city.id)}
                onMouseLeave={() => handleMouseLeave(city.id)}
              >
                <h3 className="font-semibold text-gray-800">{city.name.split(',')[0]}</h3>
                <p className="text-sm text-gray-600">{city.name.split(',')[1].trim()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoCitiesIvevisited;