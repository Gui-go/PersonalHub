import React, { useState } from 'react';
import profile from '../assets/images/profile.jpeg';
import placeholder from '../assets/images/error_img.png';

const imageMap = {
  'profile.jpeg': profile,
  'error_img': placeholder
};

const About = ({ content }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add backend integration for form submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="about-container py-12 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{content?.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row">
          <img
            src={imageMap[content?.image] || placeholder}
            alt="Guilherme Viegas"
            className="w-full md:w-1/3 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
            onError={(e) => {
              console.error(`Failed to load image: ${content?.image}`);
              e.target.src = placeholder;
            }}
          />
          <div className="flex-1">
            <p className="text-gray-600 mb-4">{content?.bio}</p>
            <div className="flex flex-wrap gap-4">
              {content?.social?.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {item.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{content?.contact?.title}</h2>
          <p className="text-gray-600 mb-6">{content?.contact?.intro}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                {content?.contact?.name_label}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                {content?.contact?.email_label}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                {content?.contact?.message_label}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {content?.contact?.send_button}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;