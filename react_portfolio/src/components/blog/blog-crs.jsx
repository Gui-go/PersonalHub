import React, { useEffect } from 'react';
import { select } from 'd3-selection';
import * as geo from 'd3-geo';
import { json } from 'd3-fetch';

const BlogCRS = ({ content }) => {
  useEffect(() => {
    let geojson = {};
    const projections = [
      { 
        type: 'AzimuthalEqualArea', 
        scale: 150,
        description: 'Preserves area in all regions of the map',
        pros: 'Equal-area, useful for statistical maps',
        cons: 'Distorts shapes, especially away from center',
        uses: 'Polar maps, thematic mapping'
      },
      { 
        type: 'AzimuthalEquidistant', 
        scale: 120,
        description: 'Preserves distances from center point',
        pros: 'Accurate distances from center, simple great circles',
        cons: 'Distorts area and shape away from center',
        uses: 'Radio broadcasting, air route maps'
      },
      { 
        type: 'Gnomonic', 
        scale: 150,
        description: 'Projects great circles as straight lines',
        pros: 'Shows shortest path as straight line',
        cons: 'Severe distortion away from center',
        uses: 'Seismic work, navigation charts'
      },
      { 
        type: 'Orthographic', 
        scale: 200,
        description: 'Simulates 3D globe view from infinite distance',
        pros: 'Visually appealing, resembles globe',
        cons: 'Only one hemisphere visible, severe distortion',
        uses: 'Illustrations, artistic representations'
      },
      { 
        type: 'Stereographic', 
        scale: 150,
        description: 'Conformal projection preserving angles',
        pros: 'Preserves angles and local shapes',
        cons: 'Area distortion increases from center',
        uses: 'Polar maps, geology, crystallography'
      },
      { 
        type: 'Albers', 
        scale: 180,
        description: 'Conic equal-area projection',
        pros: 'Balanced distortion, preserves area',
        cons: 'Not conformal, not equidistant',
        uses: 'USGS maps, thematic mapping'
      },
      { 
        type: 'ConicConformal', 
        scale: 150,
        description: 'Conformal conic projection (Lambert)',
        pros: 'Preserves angles and shapes',
        cons: 'Distorts area significantly',
        uses: 'Aeronautical charts, regional maps'
      },
      { 
        type: 'ConicEqualArea', 
        scale: 150,
        description: 'Equal-area conic projection (Albers)',
        pros: 'Preserves area of regions',
        cons: 'Distorts shapes away from standard parallels',
        uses: 'Mid-latitude countries, thematic maps'
      },
      { 
        type: 'ConicEquidistant', 
        scale: 150,
        description: 'Equidistant conic projection',
        pros: 'Preserves distances along meridians',
        cons: 'Neither equal-area nor conformal',
        uses: 'Simple regional maps, atlas maps'
      },
      { 
        type: 'Equirectangular', 
        scale: 120,
        description: 'Simple cylindrical projection',
        pros: 'Simple to construct, uniform spacing',
        cons: 'Severe area and shape distortion',
        uses: 'GIS applications, base for other projections'
      },
      { 
        type: 'Mercator', 
        scale: 100,
        description: 'Conformal cylindrical projection',
        pros: 'Preserves angles and shapes locally',
        cons: 'Extreme area distortion near poles',
        uses: 'Navigation, web mapping (Google Maps)'
      },
      { 
        type: 'TransverseMercator', 
        scale: 100,
        description: 'Mercator rotated 90°',
        pros: 'Accurate along chosen meridian',
        cons: 'Distortion increases away from central meridian',
        uses: 'UTM system, topographic mapping'
      },
    ];

    const circles = [
      [0, 0],
      [-90, 0],
      [-45, 0],
      [45, 0],
      [90, 0],
      [0, -70],
      [0, -35],
      [0, 35],
      [0, 70],
    ];
    const geoCircle = geo.geoCircle().radius(10).precision(1);
    const geoGraticule = geo.geoGraticule();

    const width = 400;
    const height = 300;
    const globalScale = 0.8;

    const updateCanvas = function (d) {
      const context = this.getContext('2d');
      const projection = geo[`geo${d.type}`]()
        .scale(globalScale * d.scale)
        .center([0, 0])
        .rotate([0.1, 0, 0])
        .translate([0.5 * width, 0.5 * height]);

      const geoGenerator = geo.geoPath().projection(projection).context(context);

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      // Graticule
      context.strokeStyle = '#ccc';
      context.fillStyle = 'none';
      context.setLineDash([1, 1]);
      context.beginPath();
      geoGenerator(geoGraticule());
      context.stroke();

      // World
      context.fillStyle = '#f0f4f8';
      context.setLineDash([]);
      context.beginPath();
      geoGenerator({ type: 'FeatureCollection', features: geojson.features });
      context.fill();
      context.strokeStyle = '#999';
      context.stroke();

      // Circles
      context.strokeStyle = '#666';
      context.fillStyle = 'none';
      circles.forEach((center) => {
        geoCircle.center(center);
        context.beginPath();
        geoGenerator(geoCircle());
        context.stroke();
      });

      // Projection label
      context.fillStyle = '#333';
      context.font = '16px sans-serif';
      context.fillText(`geo${d.type}`, 10, 25);
    };

    const update = () => {
      const u = select('#projection-content')
        .selectAll('.projection-row')
        .data(projections);

      const enter = u.enter()
        .append('div')
        .attr('class', 'projection-row mb-8 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow');

      enter.append('div')
        .attr('class', 'flex flex-col md:flex-row gap-6')
        .html(d => `
          <div class="flex-1">
            <canvas width="${width}" height="${height}" 
              class="border border-gray-200 rounded-md"></canvas>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">${d.type}</h3>
            <p class="text-gray-600 mb-4">${d.description}</p>
            
            <div class="grid grid-cols-1 gap-3">
              <div class="bg-green-50 p-3 rounded-md">
                <h4 class="font-semibold text-green-800 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advantages
                </h4>
                <p class="text-green-700">${d.pros}</p>
              </div>
              
              <div class="bg-red-50 p-3 rounded-md">
                <h4 class="font-semibold text-red-800 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Limitations
                </h4>
                <p class="text-red-700">${d.cons}</p>
              </div>
              
              <div class="bg-blue-50 p-3 rounded-md">
                <h4 class="font-semibold text-blue-800 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Common Uses
                </h4>
                <p class="text-blue-700">${d.uses}</p>
              </div>
            </div>
          </div>
        `);

      enter.merge(u)
        .select('canvas')
        .each(updateCanvas);

      u.exit().remove();
    };

    json(
      'https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json'
    ).then((jsonData) => {
      geojson = jsonData;
      update();
    });

    return () => {
      select('#projection-content').selectAll('.projection-row').remove();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src="/images/projectionglobe.jpg"
            alt="D3 Projection Gallery banner"
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              🌐 Map Projection Explorer
            </h1>
            <p className="text-white/90 mt-2 max-w-2xl">
              A visual guide to geographic projections and their characteristics
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Map Projections</h2>
            <p className="text-gray-600">
              Map projections transform the Earth's spherical surface to a 2D plane, each with unique
              properties affecting area, shape, distance, and direction accuracy. Below are common
              projections with their detailed characteristics:
            </p>
          </div>

          <div id="projection-content" className="space-y-8"></div>

          <div className="mt-12 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Projection Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Equal-Area
                </h4>
                <p className="text-sm text-gray-600">
                  Preserve area measurements (e.g., Albers, AzimuthalEqualArea). Essential for statistical comparisons.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Conformal
                </h4>
                <p className="text-sm text-gray-600">
                  Preserve angles/shapes locally (e.g., Mercator, Stereographic). Crucial for navigation.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Equidistant
                </h4>
                <p className="text-sm text-gray-600">
                  Preserve distances from center (e.g., AzimuthalEquidistant). Useful for radio/air navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCRS;