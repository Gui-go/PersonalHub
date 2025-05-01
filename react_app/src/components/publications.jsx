import React from 'react';

const Publications = ({ content }) => {
  return (
    <div className="publications-container py-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{content?.title}</h1>
        <div className="space-y-6">
          {content?.items?.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
              <p className="text-gray-600 mt-2 whitespace-pre-line">{item.subtitle}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                View Publication
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;