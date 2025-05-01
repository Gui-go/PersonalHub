import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import * as d3Geo from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson-client';
import * as d3Scale from 'd3-scale';
import { max } from 'd3-array';
import { interpolateBlues } from 'd3-scale-chromatic';

const GeoLayer1 = ({ content }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const height = 500;

    // Sample data: country name to population (in millions)
    const populationData = {
      "United States": 331,
      "China": 1441,
      "India": 1380,
      "Brazil": 213,
      "Russia": 146,
      "Japan": 125,
      "Australia": 26,
      "Germany": 84,
      "South Africa": 60,
      "Canada": 38
    };

    // Set up SVG
    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear any previous content
    svg.selectAll("*").remove();

    const projection = d3Geo.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3Geo.geoPath().projection(projection);

    // Color scale for choropleth
    const colorScale = d3Scale.scaleSequential()
      .domain([0, max(Object.values(populationData))])
      .interpolator(interpolateBlues);

    // Tooltip
    const tooltip = select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "3px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

    // Fetch world TopoJSON data
    json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then(topo => {
        const countries = topojson.feature(topo, topo.objects.countries).features;

        svg.selectAll(".country")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("fill", d => {
            const population = populationData[d.properties.name] || 0;
            return colorScale(population);
          })
          .attr("stroke", "#333")
          .attr("stroke-width", "0.5px")
          .on("mouseover", function(event, d) {
            select(this).raise()
              .attr("stroke", "#000")
              .attr("stroke-width", "1px");
            const population = populationData[d.properties.name] || 0;
            tooltip
              .style("visibility", "visible")
              .html(`${d.properties.name}: ${population}M`);
          })
          .on("mousemove", function(event) {
            tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
          })
          .on("mouseout", function() {
            select(this)
              .attr("stroke", "#333")
              .attr("stroke-width", "0.5px");
            tooltip.style("visibility", "hidden");
          });
      })
      .catch(error => console.error("Error loading the data: ", error));

    // Cleanup on unmount
    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{content?.title}</h1>
      <p className="mb-4">{content?.content}</p>
      <div className="w-full flex justify-center">
        <svg ref={svgRef} className="bg-gray-100"></svg>
      </div>
    </div>
  );
};

export default GeoLayer1;