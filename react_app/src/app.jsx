import React, { useState, useEffect } from 'react';
import './assets/styles.css';
import Navbar from './components/navbar';
import Home from './components/home';
import CV from './components/cv';
import Publications from './components/publications';
import Projects from './components/projects';
import Discovery from './components/discovery';
import Discovery1 from './components/discovery1';
import Discovery2 from './components/discovery2';
import Discovery3 from './components/discovery3';
import Discovery4 from './components/discovery4';
import GeoLayers from './components/geolayers';
import GeoLayer1 from './components/geolayer1';
import GeoLayer2 from './components/geolayer2';
import GeoLayer3 from './components/geolayer3';
import Blog from './components/blog';
import Blog1 from './components/blog1';
import Blog2 from './components/blog2';
import Blog3 from './components/blog3';
import About from './components/about';

const App = () => {
  const [content, setContent] = useState({});
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetch('/content.json')
      .then(response => response.json())
      .then(data => setContent(data));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home content={content[language]?.home} />;
      case 'cv': return <CV content={content[language]?.cv} />;
      case 'publications': return <Publications content={content[language]?.publications} />;
      case 'projects': return <Projects content={content[language]?.projects} />;
      case 'discovery': return <Discovery content={content[language]?.discovery} setActiveTab={setActiveTab} />;
      case 'discovery1': return <Discovery1 content={content[language]?.discovery1} />;
      case 'discovery2': return <Discovery2 content={content[language]?.discovery2} />;
      case 'discovery3': return <Discovery3 content={content[language]?.discovery3} />;
      case 'discovery4': return <Discovery4 content={content[language]?.discovery4} />;
      case 'geolayers': return <GeoLayers content={content[language]?.geolayers} setActiveTab={setActiveTab} />;
      case 'geolayer1': return <GeoLayer1 content={content[language]?.geolayer1} />;
      case 'geolayer2': return <GeoLayer2 content={content[language]?.geolayer2} />;
      case 'geolayer3': return <GeoLayer3 content={content[language]?.geolayer3} />;
      case 'blog': return <Blog content={content[language]?.blog} setActiveTab={setActiveTab} />;
      case 'blog1': return <Blog1 content={content[language]?.blog1} />;
      case 'blog2': return <Blog2 content={content[language]?.blog2} />;
      case 'blog3': return <Blog3 content={content[language]?.blog3} />;
      case 'about': return <About content={content[language]?.about} />;
      default: return <Home content={content[language]?.home} />;
    }
  };

  return (
    <div>
      <Navbar
        navItems={content[language]?.navbar}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;

