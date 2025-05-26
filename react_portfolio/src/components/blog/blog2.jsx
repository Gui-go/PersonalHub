import React from 'react';

const Blog2 = () => {
  return (
    <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 xs:p-8 sm:p-10 md:p-12">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Geospatial Data with Leaflet</h2>
        <p className="text-gray-600 text-base xs:text-lg sm:text-xl mb-4">Published on 2024-12-10</p>
        <p className="text-gray-600 text-base xs:text-lg sm:text-xl leading-relaxed">
          A tutorial on visualizing geospatial data using the Leaflet JavaScript library.
          {/* Add full content here */}
        </p>
      </div>
    </div>
  );
};

export default Blog2;