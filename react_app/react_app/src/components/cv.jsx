import React from 'react';

const CV = ({ content }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{content?.title}</h1>
      <br></br>
      <hr></hr>
      {/* <p>{content?.content}</p> */}

      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{content?.education?.title}</h2>
        <div className="space-y-4">
          {content?.education?.items?.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800">{item.degree}</h3>
              <p className="text-gray-600">{item.institution} | {item.year}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Experience Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{content?.experience?.title}</h2>
        <div className="space-y-6">
          {content?.experience?.items?.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800">{item.role}</h3>
              <p className="text-gray-600">{item.company} | {item.duration}</p>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{content?.skills?.title}</h2>
        <div className="flex flex-wrap gap-2">
          {content?.skills?.items?.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <br></br>
      <br></br>

      {/* Certifications Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{content?.certifications?.title}</h2>
        <div className="space-y-4">
          {content?.certifications?.items?.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{item.issuer} | {item.year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{content?.awards?.title}</h2>
        <div className="space-y-4">
          {content?.awards?.items?.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{item.issuer} | {item.year}</p>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default CV;