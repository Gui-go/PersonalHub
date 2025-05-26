import React from 'react';
import { useNavigate } from 'react-router-dom';
import Publication1 from './publications/publication1';
import Publication2 from './publications/publication2';

const Publications = ({ content }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <img
          src={content.image}
          alt={`${content.title} banner`}
          className="w-full h-32 xs:h-40 sm:h-48 md:h-56 object-cover"
        />
        <div className="p-4 xs:p-5 sm:p-7 md:p-9">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            {content.title}
          </h2>
          <p className="text-gray-600 text-base xs:text-lg sm:text-xl md:text-2xl leading-relaxed mb-4 xs:mb-5 sm:mb-6">
            {content.description}
          </p>
          {/* Link to specific publication pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/publications/publication1')}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
            >
              Publication 1
            </button>
            <button
              onClick={() => navigate('/publications/publication2')}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
            >
              Publication 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publications;