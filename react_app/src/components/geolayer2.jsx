import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import * as d3Geo from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson-client';

const GeoLayer2 = ({ content }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const height = 500;
    
    // Sample data: cities with coordinates and population (in millions)
    const cityData = [
      { name: "Florianópolis, Santa Catarina", coordinates: [-48.533458, -27.594016], population: 0.0, description: "Where I have lived most of my life, where I grow up and started working." },
      { name: "Dublin, Ireland", coordinates: [-6.281240, 53.346563], population: 0.0, description: "Where I have matured, spent one year in the island studying business administration and English langugage to prepare myself for the challenges to come." },
      { name: "Lisbon, Portugal", coordinates: [-9.139207, 38.713354], population: 0.0, description: "Where I continued working in IT and got back in touch with my roots, keep good memories from this place :)" },
      { name: "Munster, Nordrein Westfalia", coordinates: [7.628406, 51.963096], population: 0.0, description: "Where I did my Masters and aim to persue a Senior carrer." },
    ];

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

    // Fetch world TopoJSON data for the base map
    json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then(topo => {
        const countries = topojson.feature(topo, topo.objects.countries).features;

        // Render the base map (countries as background)
        svg.selectAll(".country")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("fill", "#e0e0e0")
          .attr("stroke", "#333")
          .attr("stroke-width", "0.5px");

        // Render points for cities with static size
        svg.selectAll(".city")
          .data(cityData)
          .enter()
          .append("circle")
          .attr("class", "city")
          .attr("cx", d => projection(d.coordinates)[0])
          .attr("cy", d => projection(d.coordinates)[1])
          .attr("r", 6) // Static radius for all points
          .attr("fill", "steelblue")
          .attr("opacity", 0.7)
          .on("mouseover", function(event, d) {
            select(this).raise()
              .attr("fill", "orange")
              .attr("opacity", 1);
            tooltip
              .style("visibility", "visible")
              .html(`${d.name} <br /> ${d.description}`);
          })
          .on("mousemove", function(event) {
            tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
          })
          .on("mouseout", function() {
            select(this)
              .attr("fill", "steelblue")
              .attr("opacity", 0.7);
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
      <br />
      <h3 className="text-2xl font-bold mb-4">{content?.subtitle1}</h3>
      <p className="mb-4">{content?.paragraph1}</p>
      <h3 className="text-2xl font-bold mb-4">{content?.subtitle2}</h3>
      <p className="mb-4">{content?.paragraph2}</p>
      <div className="w-full flex justify-center">
        <svg ref={svgRef} className="bg-gray-100"></svg>
      </div>
      <br />
      <h3 className="text-2xl font-bold mb-4">{content?.subtitle3}</h3>
      <p className="mb-4">{content?.paragraph3}</p>
      <h3 className="text-2xl font-bold mb-4">{content?.subtitle4}</h3>
      <p className="mb-4">{content?.paragraph4}</p>
      <h3 className="text-2xl font-bold mb-4">{content?.subtitle5}</h3>
      <p className="mb-4">{content?.paragraph5}</p>
    </div>
  );
};

export default GeoLayer2;