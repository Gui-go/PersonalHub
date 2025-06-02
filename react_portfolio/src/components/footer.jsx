import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 xs:py-5 sm:py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs xs:text-sm sm:text-base md:text-lg">
          © {new Date().getFullYear()} Guigo.dev.br | Open Code, Open Mind  🚀
        </p>
      </div>
    </footer>
  );
};

export default Footer;
