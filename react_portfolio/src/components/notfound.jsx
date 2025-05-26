import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-6 xs:py-8 sm:py-10 md:py-12 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center">
      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
        404 - Page Not Found
      </h2>
      <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 mb-3 xs:mb-4 sm:mb-6 md:mb-8">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-block px-3 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;