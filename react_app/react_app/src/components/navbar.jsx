import React from 'react';
import LanguageSelector from './languageselector';

const Navbar = ({ navItems, setActiveTab, language, setLanguage }) => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        {navItems && Object.keys(navItems).map((key) => (
          <a
            key={key}
            href="#"
            onClick={() => setActiveTab(key)}
            className="hover:underline"
          >
            {navItems[key]}
          </a>
        ))}
      </div>
      <LanguageSelector language={language} setLanguage={setLanguage} />
    </nav>
  );
};

export default Navbar;