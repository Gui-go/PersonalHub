import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ menuItems, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu state
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !event.target.closest('nav') && !event.target.closest('.hamburger')) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">{title}</h1>
        <button
          className="md:hidden hamburger flex flex-col justify-center items-center w-8 h-8 space-y-1.5 p-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
        <ul
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:space-x-4 fixed md:static top-14 xs:top-16 left-0 w-3/4 xs:w-2/3 sm:w-1/2 md:w-auto h-[calc(100vh-56px)] xs:h-[calc(100vh-64px)] md:h-auto bg-blue-800 md:bg-transparent px-4 py-4 xs:py-6 md:py-0 transition-all duration-300 ease-in-out z-40 transform ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } md:transform-none md:opacity-100 overflow-y-auto md:overflow-visible`}
        >
          {menuItems.map((item) => (
            <li key={item.id} className="mb-3 xs:mb-4 md:mb-0">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm xs:text-base md:text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-900 text-white font-semibold'
                      : 'hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white'
                  }`
                }
                onClick={() => setIsOpen(false)}
                aria-current={(isActive) => (isActive ? 'page' : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const Page = ({ content }) => {
  const navigate = useNavigate();
  const isHome = content.path === '/';

  return (
    <div className={`container mx-auto px-4 ${isHome ? 'py-4 xs:py-6 sm:py-8 md:py-12' : 'py-4 xs:py-6 sm:py-8 md:py-12'}`}>
      {isHome ? (
        <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-[40vh] xs:h-[45vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center" style={{ backgroundImage: `url(${content.image})` }}>
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative text-center text-white p-3 xs:p-4 sm:p-6 md:p-8 animate-fade-in">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 xs:mb-3 sm:mb-4 md:mb-6">{content.title}</h2>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg mb-3 xs:mb-4 sm:mb-6 md:mb-8 max-w-xl xs:max-w-2xl mx-auto">{content.description}</p>
            <div className="flex flex-col xs:flex-row justify-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
              {content.cta?.map((button, index) => (
                <button
                  key={index}
                  onClick={() => navigate(button.path)}
                  className="px-3 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 text-xs xs:text-sm sm:text-base md:text-lg"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <img
            src={content.image}
            alt={`${content.title} banner`}
            className="w-full h-28 xs:h-36 sm:h-44 md:h-52 object-cover"
          />
          <div className="p-3 xs:p-4 sm:p-6 md:p-8">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
              {content.title}
            </h2>
            <p className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed mb-3 xs:mb-4 sm:mb-6">
              {content.description}
            </p>
            {content.sections?.map((section, index) => (
              <div key={index} className="mb-3 xs:mb-4 sm:mb-6">
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-1 xs:mb-2 sm:mb-3">
                  {section.title}
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg">
                  {section.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-6 xs:py-8 sm:py-10 md:py-12 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center">
      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-2 xs:mb-3 sm:mb-4 md:mb-6">
        404 - Page Not Found
      </h2>
      <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 mb-3 xs:mb-4 sm:mb-6 md:mb-8">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-block px-3 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
      >
        Back to Home
      </button>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 xs:py-5 sm:py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs xs:text-sm sm:text-base md:text-lg">
          © {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
        <div className="mt-2 xs:mt-3 sm:mt-4 flex justify-center space-x-3 sm:space-x-4">
          <a
            href="https://github.com"
            className="hover:text-blue-400 transition-colors duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            className="hover:text-blue-400 transition-colors duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

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
          {menuItems.map((item) => (
            <Route
              key={item.id}
              path={item.path}
              element={<Page content={item} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;