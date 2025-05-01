import React from 'react';

// Placeholder for missing images
import placeholder from '../assets/images/error_img.png';
import virtualGuigo from '../assets/images/virtualGuigo.png';
import gwrSearchEngine from '../assets/images/gwrSearchEngine.jpg';
import migSearchEngine from '../assets/images/migSearchEngine.png';
import diarytom from '../assets/images/diarytom.jpg';


const imageMap = {
  'error_img': placeholder,
  'virtualGuigo': virtualGuigo,
  'gwrSearchEngine': gwrSearchEngine,
  'migSearchEngine': migSearchEngine,
  'diarytom': diarytom
};

const Discovery = ({ content, setActiveTab }) => {
  return (
    <div className="discovery-container py-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{content?.title}</h1>
        <div className="space-y-6">
          {Object.values(content?.subtabs || {}).map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row">
              <img
                src={imageMap[item.image] || placeholder}
                alt={item.title}
                className="w-full md:w-1/3 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                onError={(e) => {
                  console.error(`Failed to load image: ${item.image}`);
                  e.target.src = placeholder;
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <p className="text-gray-500 mt-2 text-sm">
                  <span className="font-medium"> </span>
                  {item.link ? (
                    <a
                      href="#"
                      onClick={() => setActiveTab(item.link)}
                      className="hover:underline text-blue-500"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span>{item.link}</span>
                  )}
                </p>
                <p className="text-gray-500 mt-2 text-sm">
                  <span className="font-medium">Example Query:</span> {item.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;


