import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { tile } from 'd3-tile';

const WorldTiles = ({ content }) => {
  const svgRef = useRef(null);
  const tilesGroupRef = useRef(null);
  const transformRef = useRef(d3.zoomIdentity.translate(480, 300).scale(4096));
  const [tileSource, setTileSource] = useState('topo');
  const [isZooming, setIsZooming] = useState(false);

  const width = 960;
  const height = 600;

  // Tile sources with improved error handling
  const tileSources = {
    topo: {
      name: "Topographic",
      url: (x, y, z) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`,
      attribution: "OpenTopoMap",
      maxZoom: 17
    },
    osm: {
      name: "Street Map",
      url: (x, y, z) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
      attribution: "OpenStreetMap",
      maxZoom: 19
    },
    satellite: {
      name: "Satellite",
      url: (x, y, z) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
      attribution: "Esri World Imagery",
      maxZoom: 19
    },
    dark: {
      name: "Dark Mode",
      url: (x, y, z) => `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/${z}/${x}/${y}.png`,
      attribution: "Stadia Maps",
      maxZoom: 20
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Clear previous content but keep the base SVG
    svg.selectAll("*").remove();

    const tileGenerator = tile()
      .size([width, height])
      .tileSize(512)
      .clampX(false);

    // Store the tiles group reference
    tilesGroupRef.current = svg.append("g")
      .attr("pointer-events", "none");

    const zoom = d3.zoom()
      .scaleExtent([1 << 8, 1 << (tileSources[tileSource].maxZoom || 18)])
      .extent([[0, 0], [width, height]])
      .on("start", () => setIsZooming(true))
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        updateTiles(event.transform);
      })
      .on("end", () => setIsZooming(false));

    // Apply initial transform
    svg.call(zoom)
      .call(zoom.transform, transformRef.current);

    function updateTiles(transform) {
      const tiles = tileGenerator(transform);
      const currentSource = tileSources[tileSource];

      tilesGroupRef.current.selectAll("image")
        .data(tiles, d => `${d[0]}-${d[1]}-${d[2]}`)
        .join(
          enter => enter.append("image")
            .attr("xlink:href", d => {
              const z = Math.min(d[2], currentSource.maxZoom || 18);
              const n = 1 << z;
              return currentSource.url(d[0] % n, d[1] % n, z);
            })
            .attr("x", d => (d[0] + tiles.translate[0]) * tiles.scale)
            .attr("y", d => (d[1] + tiles.translate[1]) * tiles.scale)
            .attr("width", tiles.scale)
            .attr("height", tiles.scale)
            .attr("opacity", isZooming ? 0.7 : 1)
            .on("error", function() {
              // Fallback to lower zoom level if tile loading fails
              d3.select(this).attr("xlink:href", null);
            }),
          update => update
            .attr("x", d => (d[0] + tiles.translate[0]) * tiles.scale)
            .attr("y", d => (d[1] + tiles.translate[1]) * tiles.scale)
            .attr("width", tiles.scale)
            .attr("height", tiles.scale)
            .attr("opacity", isZooming ? 0.7 : 1)
        );
    }

    return () => {
      // Cleanup
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }
    };
  }, [tileSource]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Interactive World Map</h1>
            
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.keys(tileSources).map(key => (
                <button
                  key={key}
                  onClick={() => setTileSource(key)}
                  className={`px-4 py-2 rounded-md transition-colors ${tileSource === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {tileSources[key].name}
                </button>
              ))}
            </div>

            <div className="w-full flex justify-center mb-8 relative">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm w-full overflow-auto">
                <svg 
                  ref={svgRef} 
                  className="w-full h-auto"
                  width={width}
                  height={height}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTiles;