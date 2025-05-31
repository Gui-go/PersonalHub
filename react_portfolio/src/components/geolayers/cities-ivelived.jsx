import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import * as d3Geo from 'd3-geo';
import { scaleSqrt } from 'd3-scale';
import { json } from 'd3-fetch';
import * as topojson from 'topojson-client';

const GeoCitiesIvelived = ({ content }) => {
  const pageData = content.layers.find(l => l.id === 'cities-ivelived') || {};
  const cities = [
    {
      "name": "Florianópolis",
      "coordinates": [-48.533458, -27.594016],
      "description": "A coastal paradise where I started my tech journey.",
      "timePeriods": [
        { "start": "1993", "end": "2014" },
        { "start": "2015", "end": "2021" }
      ],
      "image": "/images/floripa5.jpg",
      "story": "Florianópolis was where it all began. The beaches inspired creativity, and the local tech scene gave me my first coding experiences. I lived here in two periods: from 1993 to 2014, and then again from 2016 to 2021.",
      "highlight": false,
      "population": 1324000
    },
    {
      "name": "Dublin",
      "coordinates": [-6.281240, 53.346563],
      "description": "A city of history and tech innovation.",
      "timePeriod": { "start": "2014", "end": "2015" },
      "image": "/images/dublin3.jpg",
      "story": "Dublin's vibrant energy and tech hubs pushed me to grow as a developer and embrace new challenges.",
      "population": 1299000
    },
    {
      "name": "Lisbon",
      "coordinates": [-9.139207, 38.713354],
      "description": "A sunny city of creativity and culture.",
      "timePeriod": { "start": "2022", "end": "2024" },
      "image": "/images/lisboa3.jpg",
      "story": "Lisbon's charm and startup scene inspired me to blend design with technology, creating meaningful projects.",
      "population": 3028000
    },
    {
      "name": "Münster",
      "coordinates": [7.628406, 51.963096],
      "description": "A peaceful city of learning and innovation.",
      "timePeriod": { "start": "2024", "end": "Present" },
      "image": "/images/munster4.jpg",
      "story": "Münster's calm streets and academic environment helped me focus on innovation and personal growth.",
      "highlight": true,
      "population": 307071
    }
  ];

  const svgRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const height = 500;
    
    // Set up SVG with separate layers
    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Clear any previous content
    svg.selectAll("*").remove();

    // Add shadow filter for legend
    const defs = svg.append("defs");
    defs.append("filter")
      .attr("id", "legend-shadow")
      .append("feDropShadow")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("stdDeviation", 2)
      .attr("flood-opacity", 0.3);

    // Create map layer (will stay behind legend)
    const mapLayer = svg.append("g").attr("class", "map-layer");

    // Create legend layer (will stay on top)
    const legendLayer = svg.append("g")
      .attr("class", "legend-layer")
      .raise(); // Ensure it stays on top

    const projection = d3Geo.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3Geo.geoPath().projection(projection);

    // Create population scale
    const cityScale = scaleSqrt()
      .domain([0, Math.max(...cities.map(c => c.population))])
      .range([2, 4]);

    // Enhanced Tooltip
    const tooltip = select("body").append("div")
      .attr("class", "tooltip bg-gray-800 text-white p-4 rounded-lg shadow-xl text-sm pointer-events-none absolute opacity-0 transition-opacity duration-200")
      .style("max-width", "320px")
      .style("z-index", "1000");

    // Timeline information
    const timeline = select(svgRef.current.parentNode).append("div")
      .attr("class", "timeline hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg shadow-md")
      .style("width", "220px")
      .style("z-index", "10");

    timeline.append("h3")
      .attr("class", "font-bold text-lg text-gray-800 mb-3")
      .text("My Journey Timeline");

    const timelineList = timeline.append("ul")
      .attr("class", "space-y-3 text-sm");

    // Build the legend in the top layer
    const legend = legendLayer.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 250}, 20)`);

    // Legend background with shadow
    legend.append("rect")
      .attr("width", 230)
      .attr("height", 110)
      .attr("rx", 8)
      .attr("fill", "white")
      .attr("opacity", 0.95)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)
      .attr("filter", "url(#legend-shadow)");

    // Legend title
    legend.append("text")
      .attr("x", 10)
      .attr("y", 15)
      .attr("class", "text-sm font-semibold fill-current text-gray-700")
      .text("City Markers Legend");

    // Color explanation
    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 30)
      .attr("r", 6)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#1d4ed8")
      .attr("stroke-width", 1.5);

    legend.append("text")
      .attr("x", 25)
      .attr("y", 33)
      .attr("class", "text-xs fill-current text-gray-600")
      .text("Past lived");

    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 50)
      .attr("r", 6)
      .attr("fill", "#f59e0b")
      .attr("stroke", "#d97706")
      .attr("stroke-width", 1.5);

    legend.append("text")
      .attr("x", 25)
      .attr("y", 53)
      .attr("class", "text-xs fill-current text-gray-600")
      .text("Current living");

    // Population size explanation
    legend.append("text")
      .attr("x", 10)
      .attr("y", 75)
      .attr("class", "text-xs fill-current text-gray-600")
      .text("Marker size represents city population:");

    // Example population sizes
    const examplePopulations = [
      { pop: 300000, label: "300k" },
      { pop: 1000000, label: "1M" },
      { pop: 2500000, label: "2.5M" }
    ];

    examplePopulations.forEach((example, i) => {
      legend.append("circle")
        .attr("cx", 30 + i * 60)
        .attr("cy", 90)
        .attr("r", cityScale(example.pop))
        .attr("fill", "#9ca3af")
        .attr("stroke", "#6b7280")
        .attr("stroke-width", 1);

      legend.append("text")
        .attr("x", 30 + i * 60)
        .attr("y", 90 + cityScale(example.pop) + 12)
        .attr("class", "text-xs fill-current text-gray-600")
        .attr("text-anchor", "middle")
        .text(example.label);
    });

    // Fetch world TopoJSON data
    json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then(topo => {
        const countries = topojson.feature(topo, topo.objects.countries).features;

        // Render the base map in the map layer
        mapLayer.selectAll(".country")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("fill", "#f8fafc")
          .attr("stroke", "#e2e8f0")
          .attr("stroke-width", "0.5px");

        // Add city labels that appear on hover
        const cityLabels = mapLayer.append("g")
          .attr("class", "city-labels");

        // Get earliest start date for sorting
        const getEarliestStart = (city) => {
          if (city.timePeriods) {
            return Math.min(...city.timePeriods.map(p => parseInt(p.start)));
          }
          return parseInt(city.timePeriod.start);
        };

        // Populate timeline
        const sortedCities = [...cities].sort((a, b) => getEarliestStart(a) - getEarliestStart(b));
        
        timelineList.selectAll("li")
          .data(sortedCities)
          .enter()
          .append("li")
          .attr("class", "timeline-item flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded")
          .html(d => `
            <div class="mr-3 mt-1 w-3 h-3 rounded-full ${d.highlight ? 'bg-orange-500' : 'bg-blue-500'} flex-shrink-0"></div>
            <div>
              <div class="font-medium ${d.highlight ? 'text-orange-700' : 'text-gray-700'}">${d.name}</div>
              ${d.timePeriods 
                ? d.timePeriods.map(period => 
                    `<div class="text-xs text-gray-500">${period.start} - ${period.end}</div>`
                  ).join('')
                : `<div class="text-xs text-gray-500">${d.timePeriod.start} - ${d.timePeriod.end}</div>`
              }
              <div class="text-xs text-gray-400">Pop: ${d.population.toLocaleString()}</div>
            </div>
          `)
          .on("mouseover", (event, d) => {
            mapLayer.selectAll(".city")
              .filter(city => city.name === d.name)
              .raise()
              .attr("fill", "#ef4444")
              .attr("opacity", 1)
              .attr("stroke", "#dc2626")
              .attr("stroke-width", 2);
          })
          .on("mouseout", (event, d) => {
            mapLayer.selectAll(".city")
              .filter(city => city.name === d.name)
              .attr("fill", d => d.highlight ? "#f59e0b" : "#3b82f6")
              .attr("opacity", 0.8)
              .attr("stroke", d => d.highlight ? "#d97706" : "#1d4ed8")
              .attr("stroke-width", 1.5);
          });

        // Render city points sized by population in map layer
        mapLayer.selectAll(".city")
          .data(cities)
          .enter()
          .append("circle")
          .attr("class", "city")
          .attr("cx", d => projection(d.coordinates)[0])
          .attr("cy", d => projection(d.coordinates)[1])
          .attr("r", d => cityScale(d.population))
          .attr("fill", d => d.highlight ? "#f59e0b" : "#3b82f6")
          .attr("opacity", 0.8)
          .attr("stroke", d => d.highlight ? "#d97706" : "#1d4ed8")
          .attr("stroke-width", 1.5)
          .on("mouseover", function(event, d) {
            select(this).raise()
              .attr("fill", "#ef4444")
              .attr("opacity", 1)
              .attr("stroke", "#dc2626")
              .attr("stroke-width", 2);

            cityLabels.append("text")
              .attr("x", projection(d.coordinates)[0] + cityScale(d.population) + 5)
              .attr("y", projection(d.coordinates)[1])
              .attr("class", "city-label text-sm font-semibold fill-current text-gray-800")
              .text(`${d.name} (${d.population.toLocaleString()})`);

            tooltip
              .html(`
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    ${d.image ? `<img src="${d.image}" alt="${d.name}" class="w-26 h-26 object-cover rounded-md">` : ''}
                    <div>
                      <h4 class="font-bold text-xl ${d.highlight ? 'text-orange-400' : 'text-blue-400'}">${d.name}</h4>
                      <p class="text-gray-200 text-sm mt-2">${d.description}</p>
                    </div>
                  </div>
                  <div class="bg-gray-700 p-3 rounded">
                    <h5 class="font-medium ${d.highlight ? 'text-orange-300' : 'text-blue-300'} mb-1">My Story</h5>
                    <p class="text-gray-200 text-sm">${d.story}</p>
                  </div>
                </div>
              `)
              .style("opacity", 1)
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 20) + "px");
          })
          .on("mousemove", function(event) {
            tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 20) + "px");
          })
          .on("mouseout", function(event, d) {
            select(this)
              .attr("fill", d.highlight ? "#f59e0b" : "#3b82f6")
              .attr("opacity", 0.8)
              .attr("stroke", d.highlight ? "#d97706" : "#1d4ed8")
              .attr("stroke-width", 1.5);
            
            cityLabels.selectAll(".city-label").remove();
            tooltip.style("opacity", 0);
          });

        // Add a title to the map
        mapLayer.append("text")
          .attr("x", width / 2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr("class", "text-lg font-semibold fill-current text-gray-700")
          .text("My Life's Journey Through Cities");

        // Add connecting lines between cities
        const lineGenerator = d3Geo.geoLine()
          .projection(projection)
          .curve(d3Geo.curveCatmullRom.alpha(0.5));

        const routeCoords = sortedCities.map(city => city.coordinates);
        mapLayer.append("path")
          .datum({type: "LineString", coordinates: routeCoords})
          .attr("class", "journey-route")
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", "#93c5fd")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,3")
          .attr("opacity", 0.7);
      })
      .catch(error => console.error("Error loading the data: ", error));

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
      select(".timeline").remove();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{content?.title}</h1>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">{content?.subtitle1}</h3>
            <p className="text-gray-600 mb-6">{content?.paragraph1}</p>
            
            <div className="w-full flex justify-center mb-8 relative">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm w-full overflow-auto">
                <svg ref={svgRef} className="w-full h-auto"></svg>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-700 mb-3">{content?.subtitle2}</h3>
            <p className="text-gray-600 mb-6">{content?.desc2}</p>
            
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">{content?.subtitle3}</h3>
            <p className="text-gray-600 mb-6">{content?.paragraph3}</p>
            
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">{content?.subtitle4}</h3>
            <p className="text-gray-600 mb-6">{content?.paragraph4}</p>
            
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">{content?.subtitle5}</h3>
            <p className="text-gray-600">{content?.paragraph5}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoCitiesIvelived;