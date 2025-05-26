import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Page from './components/page';
import NotFound from './components/notfound';
import Footer from './components/footer';
import Home from './components/home';
import CV from './components/cv';
import Publications from './components/publications';
import Projects from './components/projects';
import Agents from './components/agents';
import Blog from './components/blog';
import Geolayers from './components/geolayers';
import Agent1 from './components/agents/agent1';
import Agent2 from './components/agents/agent2';
import Blog1 from './components/blog/blog1';
import Blog2 from './components/blog/blog2';
import Geolayer1 from './components/geolayers/geolayer1';
import Geolayer2 from './components/geolayers/geolayer2';
import Project1 from './components/projects/project1';
import Project2 from './components/projects/project2';
import Publication1 from './components/publications/publication1';
import Publication2 from './components/publications/publication2';

const App = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/content.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load content');
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-center">
        <div>
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4">Error</h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const content = data[language];
  const menuItems = content.menu;
  const title = content.title;

  // Find content for specific routes
  const homeContent = menuItems.find((item) => item.path === '/');
  const cvContent = menuItems.find((item) => item.path === '/cv');
  const publicationsContent = menuItems.find((item) => item.path === '/publications');
  const projectsContent = menuItems.find((item) => item.path === '/projects');
  const agentsContent = menuItems.find((item) => item.path === '/agents');
  const blogContent = menuItems.find((item) => item.path === '/blog');
  const geolayersContent = menuItems.find((item) => item.path === '/geolayers');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-end p-2 xs:p-3 sm:p-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs xs:text-sm sm:text-base md:text-lg"
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <Navbar menuItems={menuItems} title={title} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home content={homeContent} />} />
          <Route path="/cv" element={<CV content={cvContent} />} />
          <Route path="/publications" element={<Publications content={publicationsContent} />} />
          <Route path="/projects" element={<Projects content={projectsContent} />} />
          <Route path="/agents" element={<Agents content={agentsContent} />} />
          <Route path="/blog" element={<Blog content={blogContent} />} />
          <Route path="/geolayers" element={<Geolayers content={geolayersContent} />} />
          {menuItems
            .filter((item) => !['/', '/cv', '/publications', '/projects', '/agents', '/blog', '/geolayers'].includes(item.path))
            .map((item) => (
              <Route
                key={item.id}
                path={item.path}
                element={<Page content={item} />}
              />
            ))}
          <Route path="/agents/agent1" element={<Agent1 />} />
          <Route path="/agents/agent2" element={<Agent2 />} />
          <Route path="/blog/blog1" element={<Blog1 />} />
          <Route path="/blog/blog2" element={<Blog2 />} />
          <Route path="/geolayers/geolayer1" element={<Geolayer1 />} />
          <Route path="/geolayers/geolayer2" element={<Geolayer2 />} />
          <Route path="/projects/project1" element={<Project1 />} />
          <Route path="/projects/project2" element={<Project2 />} />
          <Route path="/publications/publication1" element={<Publication1 />} />
          <Route path="/publications/publication2" element={<Publication2 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;