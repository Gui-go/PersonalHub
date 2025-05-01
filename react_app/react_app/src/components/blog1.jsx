import React, { useEffect } from 'react';
import { select } from 'd3-selection';
import * as geo from 'd3-geo';
import { json } from 'd3-fetch';

const Blog1 = ({ content }) => {
  useEffect(() => {
    let geojson = {};
    const projections = [
      { type: 'AzimuthalEqualArea', scale: 100 },
      { type: 'AzimuthalEquidistant', scale: 80 },
      { type: 'Gnomonic', scale: 100 },
      { type: 'Orthographic', scale: 160 },
      { type: 'Stereographic', scale: 100 },
      { type: 'Albers', scale: 120 },
      { type: 'ConicConformal', scale: 100 },
      { type: 'ConicEqualArea', scale: 100 },
      { type: 'ConicEquidistant', scale: 100 },
      { type: 'Equirectangular', scale: 80 },
      { type: 'Mercator', scale: 70 },
      { type: 'TransverseMercator', scale: 70 },
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

    const width = 200;
    const height = 200;
    const globalScale = 0.5;

    const updateCanvas = function (d) {
      const context = this.getContext('2d');

      const projection = geo[`geo${d.type}`]()
        .scale(globalScale * d.scale)
        .center([0, 0])
        .rotate([0.1, 0, 0])
        .translate([0.5 * width, 0.5 * height]);

      const geoGenerator = geo
        .geoPath()
        .projection(projection)
        .context(context);

      context.clearRect(0, 0, width, height);
      context.lineWidth = 0.5;

      // Graticule
      context.strokeStyle = '#ccc';
      context.fillStyle = 'none';
      context.setLineDash([1, 1]);
      context.beginPath();
      geoGenerator(geoGraticule());
      context.stroke();

      // World
      context.fillStyle = '#eee';
      context.setLineDash([]);
      context.beginPath();
      geoGenerator({ type: 'FeatureCollection', features: geojson.features });
      context.fill();
      context.stroke();

      // Circles
      context.strokeStyle = '#888';
      context.fillStyle = 'none';
      circles.forEach((center) => {
        geoCircle.center(center);
        context.beginPath();
        geoGenerator(geoCircle());
        context.stroke();
      });

      // Projection label
      context.fillStyle = '#333';
      context.font = '14px sans-serif';
      context.fillText(`geo${d.type}`, 6, 17);
    };

    const update = () => {
      const u = select('#content')
        .selectAll('canvas')
        .data(projections);

      u.enter()
        .append('canvas')
        .attr('width', `${width}px`)
        .attr('height', `${height}px`)
        .style('border', '1px solid #eee')
        .style('margin', '5px')
        .merge(u)
        .each(updateCanvas);

      u.exit().remove();
    };

    // Load GeoJSON and render
    json(
      'https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json'
    ).then((jsonData) => {
      geojson = jsonData;
      update();
    });

    // Cleanup on unmount
    return () => {
      select('#content').selectAll('canvas').remove();
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4">
        🌐 D3 Projection Gallery
      </h1>
      <p className="mb-4">
        This example shows multiple D3 projections rendered with Canvas elements
        using different geographic views.
      </p>
      <div id="content" className="flex flex-wrap justify-center"></div>
    </div>
  );
};

export default Blog1;