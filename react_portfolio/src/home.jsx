import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ content }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
      <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-[40vh] xs:h-[45vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center" style={{ backgroundImage: `url(${content.image})` }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center text-white p-3 xs:p-4 sm:p-6 md:p-8 animate-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            {content.title}
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-xl xs:max-w-2xl mx-auto">
            {content.description}
          </p>
          <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4 sm:gap-5">
            {content.cta?.map((button, index) => (
              <button
                key={index}
                onClick={() => navigate(button.path)}
                className="w-full xs:w-auto min-w-[100px] sm:min-w-[120px] px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-150 hover:scale-105 active:scale-95 text-sm sm:text-base font-medium text-center shadow-sm"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;