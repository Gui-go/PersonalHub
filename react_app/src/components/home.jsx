import React from 'react';
import profileImage from '../assets/images/profile.jpeg';

const Home = ({ content }) => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero text-center py-16 bg-gray-100 text-gray-800">
        <div className="absolute inset-0 bg-black opacity-10"></div> {/* Subtle overlay */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">{content?.title}</h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-200">{content?.subtitle}</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bio py-12 bg-white">
        <div className="content max-w-900 mx-auto flex flex-col md:flex-row items-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-48 h-48 rounded-full mb-6 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">{content?.bio.title}</h2>
            <p className="text-lg leading-relaxed">{content?.bio.content}</p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights py-12 bg-gray-100">
        <div className="content max-w-900 mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{content?.highlights.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content?.highlights.items.map((item, index) => (
              <div key={index} className="highlight-card p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;