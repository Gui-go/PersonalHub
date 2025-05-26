import React from 'react';
import { useNavigate } from 'react-router-dom';

const Page = ({ content }) => {
  const navigate = useNavigate();
  const isHome = content.path === '/';

  return (
    <div className={`container mx-auto px-4 ${isHome ? 'py-4 xs:py-6 sm:py-8 md:py-12' : 'py-4 xs:py-6 sm:py-8 md:py-12'}`}>
      {isHome ? (
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
      ) : (
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
            {content.sections?.map((section, index) => (
              <div key={index} className="mb-4 xs:mb-5 sm:mb-6">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-2 xs:mb-3 sm:mb-4">
                  {section.title}
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-base xs:text-lg sm:text-xl md:text-2xl">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;