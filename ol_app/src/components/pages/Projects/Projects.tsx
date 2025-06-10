import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Optional: Move this into a separate JSON or context later
const content = {
  title: 'Projects',
  description: 'A showcase of projects I’ve developed or contributed to.',
  image: '/images/projects-banner.jpg', // Ensure this is inside /public/images/
  projs: [
    {
      id: 'proj1',
      title: 'Project One',
      path: '/projects/project-one',
      image: '/images/project1.jpg',
      excerpt: 'An amazing project about something impactful and innovative.',
    },
    {
      id: 'proj2',
      title: 'Project Two',
      path: '/projects/project-two',
      image: '/images/project2.jpg',
      excerpt: 'Another project that helped solve a big real-world problem.',
    },
    // Add more projects as needed...
  ],
};

export default function ProjectsPage() {
  const router = useRouter();
  const projects = content.projs || [];

  return (
    <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <Image
            src={content.image}
            alt={`${content.title} banner`}
            width={1920}
            height={400}
            className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <h2 className="absolute bottom-4 left-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {content.title}
          </h2>
        </div>
        <div className="p-6 xs:p-8 sm:p-10 md:p-12">
          <p className="text-gray-600 text-base xs:text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 xs:mb-8 sm:mb-10">
            {content.description}
          </p>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
                  onClick={() => router.push(proj.path)}
                >
                  <Image
                    src={proj.image}
                    alt={`${proj.title} thumbnail`}
                    width={500}
                    height={300}
                    className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                    {proj.title}
                  </h4>
                  <p className="text-gray-600 text-sm xs:text-base sm:text-lg mb-4">
                    {proj.excerpt.length > 200 ? `${proj.excerpt.slice(0, 200)}...` : proj.excerpt}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-base xs:text-lg sm:text-xl">No projects available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
