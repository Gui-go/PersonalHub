import React from 'react';

const Agent1 = () => {
  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="p-3 xs:p-4 sm:p-6 md:p-8">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
            Agent 1
          </h2>
          <p className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed">
            This is a placeholder for Agent 1. Add specific content about this agent here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Agent1;

