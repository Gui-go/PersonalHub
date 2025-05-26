import React from 'react';

const Blog = ({ content }) => {
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
    </div>
  );
};

export default Blog;