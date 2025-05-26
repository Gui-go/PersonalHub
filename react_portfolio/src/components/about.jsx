import React from 'react';

const About = ({ content }) => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Profile Picture Section - Centered Square Image */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-8 flex justify-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={content.image}
              alt="Profile picture"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'top center' }} // Ensures face is properly centered
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 md:p-10">
          {/* Name/Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            {content.title}
          </h1>

          {/* Tagline */}
          <p className="text-center text-blue-600 font-medium text-lg sm:text-xl mb-8">
            {content.tagline}
          </p>

          {/* Introduction */}
          <div className="mb-10 bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {content.stats?.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Skills/Expertise Section */}
          {content.skills && (
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Technical Toolkit
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {content.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    {skill.icon && <span className="text-blue-500 mr-2 text-lg">{skill.icon}</span>}
                    <span className="text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Sections */}
          {content.sections?.map((section, index) => (
            <div key={index} className="mb-10 last:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-6 h-1 bg-blue-500 rounded-full mr-3"></span>
                {section.title}
              </h3>
              
              {section.type === 'timeline' ? (
                <div className="space-y-6 pl-8 border-l-2 border-blue-100">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute left-0 -ml-3.5 top-1 w-6 h-6 bg-blue-100 border-4 border-white rounded-full"></div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : section.items ? (
                <ul className="space-y-4 pl-5">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="relative pl-6 text-gray-700 text-base sm:text-lg">
                      <span className="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">{section.content}</p>
                </div>
              )}
            </div>
          ))}

          {/* Contact Links */}
          {content.links && content.links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Let's Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {content.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center shadow hover:shadow-md"
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;