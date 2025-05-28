import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 xs:py-5 sm:py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs xs:text-sm sm:text-base md:text-lg">
          © {new Date().getFullYear()} Guigo.dev.br | Open Code, Open Mind  🚀
        </p>
        {/* <div className="mt-2 xs:mt-3 sm:mt-4 flex justify-center space-x-3 sm:space-x-4">
          <a
            href="https://github.com/Gui-go"
            className="hover:text-blue-400 transition-colors duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/guilherme-viegas-1b5b0495/"
            className="hover:text-blue-400 transition-colors duration-200 text-xs xs:text-sm sm:text-base md:text-lg"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;