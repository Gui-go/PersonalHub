import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import { century, equationOfTime, declination } from 'solar-calculator';

// Utility to debounce a function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const SolarTerminator = () => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  // Memoize renderMap to prevent redefinition
  const renderMap = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      // Fetch world data
      const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json");
      const world = await response.json();
      
      // Create projection
      const projection = d3.geoNaturalEarth1();
      
      // Create sphere and graticule
      const sphere = { type: "Sphere" };
      const graticule = d3.geoGraticule10();
      
      // Calculate height and adjust projection
      const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
      const dy = Math.ceil(y1 - y0);
      const l = Math.min(Math.ceil(x1 - x0), dy);
      projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      
      // Update height only if different to avoid unnecessary re-renders
      if (dy !== height) {
        setHeight(dy);
      }
      
      // Convert topojson to geojson
      const land = topojson.feature(world, world.objects.land);
      
      // Calculate sun position and night region
      const antipode = ([longitude, latitude]) => [longitude + 180, -latitude];
      const day = new Date(+currentTime).setUTCHours(0, 0, 0, 0);
      const t = century(currentTime);
      const longitude = (day - currentTime) / 864e5 * 360 - 180;
      const sun = [longitude - equationOfTime(t) / 4, declination(t)];
      const night = d3.geoCircle()
        .radius(90)
        .center(antipode(sun))();
      
      // Draw on canvas
      const context = canvasRef.current.getContext('2d');
      const path = d3.geoPath(projection, context);
      
      // Clear canvas
      context.clearRect(0, 0, width, height);
      
      // Draw graticule
      context.beginPath();
      path(graticule);
      context.strokeStyle = "#ccc";
      context.stroke();
      
      // Draw land
      context.beginPath();
      path(land);
      context.fillStyle = "#000";
      context.fill();
      
      // Draw night region
      context.beginPath();
      path(night);
      context.fillStyle = "rgba(0,0,255,0.3)";
      context.fill();
      
      // Draw sphere outline
      context.beginPath();
      path(sphere);
      context.strokeStyle = "#000";
      context.stroke();
      
      // Store projection and night path for tooltip calculations
      canvasRef.current.projection = projection;
      canvasRef.current.nightPath = night;
    } catch (error) {
      console.error("Error rendering solar terminator:", error);
    }
  }, [width, height, currentTime]);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((event) => {
    if (!canvasRef.current || !canvasRef.current.projection) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [lon, lat] = canvasRef.current.projection.invert([x, y]) || [0, 0];
    
    // Check if point is in night region
    const point = { type: 'Point', coordinates: [lon, lat] };
    const isNight = d3.geoContains(canvasRef.current.nightPath, [lon, lat]);
    
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°<br>${isNight ? 'Night' : 'Day'}`
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  }, []);

  // Handle resize with debouncing
  const handleResize = useCallback(
    debounce(() => {
      const newWidth = Math.min(800, window.innerWidth - 40);
      setWidth(newWidth);
    }, 100),
    []
  );

  // Animation loop for map (every minute) and clock (every second)
  useEffect(() => {
    let mapInterval, clockInterval;
    if (isAnimating) {
      // Update map every minute
      mapInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
      // Update clock every second
      clockInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => {
      clearInterval(mapInterval);
      clearInterval(clockInterval);
    };
  }, [isAnimating]);

  // Render map and handle resize
  useEffect(() => {
    renderMap();

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderMap, handleResize]);

  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-3 xs:p-4 sm:p-6 md:p-8">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
            Solar Terminator Map
          </h2>
          <p className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed mb-4">
            The blue region indicates areas currently experiencing night. Time: {currentTime.toUTCString()}
          </p>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-700">
              <strong>Legend:</strong><br />
              <span className="inline-block w-4 h-4 bg-black mr-2"></span>Land<br />
              <span className="inline-block w-4 h-4 bg-blue-500 opacity-30 mr-2"></span>Night
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
                isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isAnimating ? 'Stop Live Animation' : 'Start Live Animation'}
            </button>
          </div>
          <div className="relative flex justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border border-gray-200 rounded"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            {tooltip.visible && (
              <div
                className="absolute bg-gray-800 text-white text-sm p-2 rounded shadow-lg pointer-events-none"
                style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                dangerouslySetInnerHTML={{ __html: tooltip.content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarTerminator;