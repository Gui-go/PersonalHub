import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import NotFound from './components/notfound';
import Home from './components/home';
// import CV from './components/cv';
import Publications from './components/publications';
import Projects from './components/projects';
import Agents from './components/agents';
import Blog from './components/blog';
import GeoLayers from './components/geolayers';
import About from './components/about';
import Agent1 from './components/agents/agent1';
import Agent2 from './components/agents/agent2';
import VirtualGuigo from './components/agents/virtual-guigo';
import MSdiscovery from './components/agents/masters-thesis-discovery';
import GWRdiscovery from './components/agents/gwr-discovery';
import TomRiddleDiary from './components/agents/tom-riddles-diary';
import Blog1 from './components/blog/blog1';
import Blog2 from './components/blog/blog2';
import BlogCRS from './components/blog/blog-crs';
import Geolayer1 from './components/geolayers/geolayer1';
import Geolayer2 from './components/geolayers/geolayer2';
import CitiesIvelived from './components/geolayers/cities-ivelived';
import CitiesIvevisited from './components/geolayers/cities-ivevisited';
import MyFavouriteRestaurants from './components/geolayers/my-favourite-restaurants';
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
          <Route path="/" element={<Home content={menuItems.find(item => item.path === '/')} />} />
          {/* <Route path="/cv" element={<CV content={menuItems.find(item => item.path === '/cv')} />} /> */}
          <Route path="/publications" element={<Publications content={menuItems.find(item => item.path === '/publications')} />} />
          <Route path="/projects" element={<Projects content={menuItems.find(item => item.path === '/projects')} />} />
          <Route path="/agents" element={<Agents content={menuItems.find(item => item.path === '/agents')} />} />
          <Route path="/blog" element={<Blog content={menuItems.find(item => item.path === '/blog')} />} />
          <Route path="/geolayers" element={<GeoLayers content={menuItems.find(item => item.path === '/geolayers')} />} />
          <Route path="/about" element={<About content={menuItems.find(item => item.path === '/about')} />} />
          <Route path="/agents/agent1" element={<Agent1 />} />
          <Route path="/agents/agent2" element={<Agent2 />} />
          <Route path="/agents/virtual-guigo" element={<VirtualGuigo />} />
          <Route path="/agents/masters-thesis-discovery" element={<MSdiscovery />} />
          <Route path="/agents/gwr-discovery" element={<GWRdiscovery />} />
          <Route path="/agents/tom-riddles-diary" element={<TomRiddleDiary />} />
          <Route path="/blog/blog1" element={<Blog1 />} />
          <Route path="/blog/blog2" element={<Blog2 />} />
          <Route path="/blog/crs" element={<BlogCRS />} />
          <Route path="/geolayers/geolayer1" element={<Geolayer1 />} />
          <Route path="/geolayers/geolayer2" element={<Geolayer2 />} />
          <Route path="/geolayers/cities-ivelived" element={<CitiesIvelived />} />
          <Route path="/geolayers/cities-ivevisited" element={<CitiesIvevisited />} />
          <Route path="/geolayers/my-favourite-restaurants" element={<MyFavouriteRestaurants />} />
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

