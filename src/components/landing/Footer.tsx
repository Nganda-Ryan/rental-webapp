import React from 'react';
const Footer = () => {
  return <footer className="bg-blue-marin text-white">
    <div className="container px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-6 md:mb-0">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-2 text-xl font-bold">Rental</span>
        </div>
        <nav className="flex flex-wrap justify-center space-x-6">
          <a href="#" className="text-gray-300 hover:text-white mb-2">
            Fonctionnalités
          </a>
          <a href="#" className="text-gray-300 hover:text-white mb-2">
            FAQ
          </a>
          <a href="#" className="text-gray-300 hover:text-white mb-2">
            Pricing
          </a>
        </nav>
      </div>
      <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">
          © 2023 Rental Tous droits réservés.
        </p>
        <p className="text-sm text-gray-400 mt-2 md:mt-0">
          Politique de confidentialité | Mentions légales
        </p>
      </div>
    </div>
  </footer>;
};
export default Footer;