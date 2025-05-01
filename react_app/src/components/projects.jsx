
import React from 'react';

import placeholder from '../assets/images/error_img.png';
import wilhelmRobotProfessor from '../assets/images/wilhelmRobotProfessor.jpg';
import BRvectors from '../assets/images/BRvectors.jpg';
import digitalNomad from '../assets/images/digitalNomad.jpg';
import mansion from '../assets/images/mansion.jpg';
import raspberryPI from '../assets/images/raspberryPI.jpg';
import dawnofacity from '../assets/images/dawnofacity.jpg';

const imageMap = {
  'error_img': placeholder,
  'wilhelmRobotProfessor': wilhelmRobotProfessor,
  'BRvectors': BRvectors,
  'digitalNomad': digitalNomad,
  'mansion': mansion,
  'raspberryPI': raspberryPI,
  'dawnofacity': dawnofacity,
};

const Projects = ({ content }) => {
  return (
    <div className="projects-container py-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{content?.title}</h1>
        <div className="space-y-6">
          {content?.items?.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row">
              <img
                src={imageMap[item.image] || placeholder}
                alt={item.name}
                className="w-full md:w-1/3 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                onError={(e) => {
                  console.error(`Failed to load image: ${item.image}`);
                  e.target.src = placeholder;
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <p className="text-gray-500 mt-2 text-sm">
                  <span className="font-medium">Technologies:</span> {item.tech}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;









// import React from 'react';

// import BRvectors from '../assets/images/BRvectors.jpg';
// import dawnofacity from '../assets/images/dawnofacity.jpg';
// import digitalNomad from '../assets/images/digitalNomad.jpg';
// import geotracker from '../assets/images/geotracker.png';
// import gwrSearchEngine from '../assets/images/gwrSearchEngine.jpg';
// import mansion from '../assets/images/mansion.jpg';
// import migSearchEngine from '../assets/images/migSearchEngine.png';
// import raspberryPI from '../assets/images/raspberryPI.jpg';
// import virtualGuigo from '../assets/images/virtualGuigo.png';
// import wilhelmRobotProfessor from '../assets/images/wilhelmRobotProfessor.jpg';




// // Placeholder for missing images
// // import placeholder from 'https://via.placeholder.com/150';

// // Map content.json image paths to imported images
// const imageMap = {
//   '../assets/images/profile.jpeg': profile,
//   '../assets/images/wilhelmRobotProfessor.jpg': wilhelmRobotProfessor,
//   '../assets/images/BRvectors.jpg': BRvectors,
//   '../assets/images/dawnofacity.jpg': dawnofacity,
//   '../assets/images/digitalNomad.jpg': digitalNomad,
//   '../assets/images/geotracker.png': geotracker,
//   '../assets/images/gwrSearchEngine.jpg': gwrSearchEngine,
//   '../assets/images/mansion.jpg': mansion,
//   '../assets/images/migSearchEngine.png': migSearchEngine,
//   '../assets/images/raspberryPI.jpg': raspberryPI,
//   '../assets/images/virtualGuigo.png': virtualGuigo,
//   '../assets/images/wilhelmRobotProfessor.jpg': wilhelmRobotProfessor,
// };

