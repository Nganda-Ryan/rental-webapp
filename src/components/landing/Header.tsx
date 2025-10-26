'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Header = () => {
  const t = useTranslations('Landing.header');

  return <header className="fixed top-6 left-0 right-0 z-50 mx-4">
    <div className="container bg-blue-marin bg-opacity-80 border-opacity-80 backdrop-blur-md rounded-full px-6 py-4 flex items-center justify-between border-2 border-[#0d486f] max-w-7xl mx-auto  shadow-xl drop-shadow-md">
      <div className="flex items-center">
        <a href="#" className="flex items-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-2 text-xl font-bold text-white">{t('brand')}</span>
        </a>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-red-500 hover:text-red-400">
          {t('home')}
        </a>
        <a href="#" className="text-white/80 hover:text-white">
          {t('features')}
        </a>
        <a href="#" className="text-white/80 hover:text-white">
          {t('faq')}
        </a>
        <a href="#" className="text-white/80 hover:text-white">
          {t('pricing')}
        </a>
        <a href="#" className="text-white/80 hover:text-white">
          {t('createAccount')}
        </a>
      </nav>
      <div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full">
          {t('login')}
        </button>
      </div>
    </div>
  </header>;
};
export default Header;