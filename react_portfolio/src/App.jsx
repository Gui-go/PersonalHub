import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer';
import NotFound from './components/notfound';
import Home from './components/home';

import Publications from './components/publications';
import PubMigrationDynamicsBrazil from './components/publications/migration-dynamics-in-brazil';
import PubKnowledgeSpilloversMicroregionsBrazil from './components/publications/knowledge-spillovers-microregions-brazil';
import PubExportComplexityBrazil from './components/publications/export-complexity-brazil';
import PubNotesCensusMicrodata from './components/publications/notes-census-microdata';
import PubGeoNormalization from './components/publications/geographic-normalization';
import PubMoneyNeutralityCovid19 from './components/publications/money-neutrality-covid19';
import PubOsesc from './components/publications/osesc';

import Projects from './components/projects';
import ProjHowMuchMansionWorth from './components/projects/how-much-mansion-worth';
import ProjAzureVM4nomads from './components/projects/azure-vm-4-nomads';
import ProjBRvectors from './components/projects/brvectors';
import ProjMotionSnitcher from './components/projects/motion-snitcher';
import ProjEquanimySys from './components/projects/equanimy-systems';
import ProjGCPbilling from './components/projects/gcp-billing-analytics';

import GeoLayers from './components/geolayers';
import GeoCitiesIvelived from './components/geolayers/cities-ivelived';
import GeoCitiesIvevisited from './components/geolayers/cities-ivevisited';
import GeoMyFavouriteRestaurants from './components/geolayers/my-favourite-restaurants';
import WorldTiles from './components/geolayers/world-tiles';

import Agents from './components/agents';
import AgVirtualGuigo from './components/agents/virtual-guigo';
import AgMSdiscovery from './components/agents/migration-dynamics-discovery';
import AgGWRdiscovery from './components/agents/gwr-discovery';
import AgTomRiddleDiary from './components/agents/tom-riddles-diary';

import Blogs from './components/blogs';
import BlogMapProjections from './components/blogs/map-projection-review';
import SolarTerminator from './components/blogs/solar-terminator';

import About from './components/about';



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
          <option value="pt">Português</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ru">Русский</option>
        </select>
      </div>

      <Navbar menuItems={menuItems} title={title} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home content={menuItems.find(item => item.path === '/')} />} />
          <Route path="/publications" element={<Publications content={menuItems.find(item => item.path === '/publications')} />} />
          <Route path="/projects" element={<Projects content={menuItems.find(item => item.path === '/projects')} />} />
          <Route path="/agents" element={<Agents content={menuItems.find(item => item.path === '/agents')} />} />
          <Route path="/blogs" element={<Blogs content={menuItems.find(item => item.path === '/blogs')} />} />
          <Route path="/geolayers" element={<GeoLayers content={menuItems.find(item => item.path === '/geolayers')} />} />
          <Route path="/about" element={<About content={menuItems.find(item => item.path === '/about')} />} />

          <Route path="/publications/migration-dynamics-in-brazil" element={<PubMigrationDynamicsBrazil />} />
          <Route path="/publications/knowledge-spillovers-microregions-brazil" element={<PubKnowledgeSpilloversMicroregionsBrazil />} />
          <Route path="/publications/export-complexity-brazil" element={<PubExportComplexityBrazil />} />
          <Route path="/publications/osesc" element={<PubOsesc />} />

          <Route path="/projects/azure-vm-4-nomads" element={<ProjAzureVM4nomads />} />
          <Route path="/projects/how-much-mansion-worth" element={<ProjHowMuchMansionWorth />} />
          <Route path="/projects/brvectors" element={<ProjBRvectors />} />
          <Route path="/projects/motion-snitcher" element={<ProjMotionSnitcher />} />
          <Route path="/projects/equanimy-systems" element={<ProjEquanimySys />} />
          <Route path="/projects/gcp-billing-analytics" element={<ProjGCPbilling />} />

          <Route path="/geolayers/cities-ivelived" element={<GeoCitiesIvelived content={menuItems.find(item => item.path === '/geolayers')} />} />
          <Route path="/geolayers/cities-ivevisited" element={<GeoCitiesIvevisited />} />
          <Route path="/geolayers/my-favourite-restaurants" element={<GeoMyFavouriteRestaurants />} />
          <Route path="/geolayers/world-tiles" element={<WorldTiles />} />

          <Route path="/agents/virtual-guigo" element={<AgVirtualGuigo content={menuItems.find(item => item.path === '/agents')} />} />
          <Route path="/agents/migration-dynamics-discovery" element={<AgMSdiscovery content={menuItems.find(item => item.path === '/agents')} />} />
          <Route path="/agents/gwr-discovery" element={<AgGWRdiscovery content={menuItems.find(item => item.path === '/agents')} />} />
          <Route path="/agents/tom-riddles-diary" element={<AgTomRiddleDiary />} />

          <Route path="/publications/notes-census-microdata" element={<PubNotesCensusMicrodata />} />
          <Route path="/publications/geographic-normalization" element={<PubGeoNormalization />} />
          <Route path="/publications/money-neutrality-covid19" element={<PubMoneyNeutralityCovid19 />} />
          <Route path="/blogs/map-projection-review" element={<BlogMapProjections />} />
          <Route path="/blogs/solar-terminator" element={<SolarTerminator />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

