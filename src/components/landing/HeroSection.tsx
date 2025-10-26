'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
  const t = useTranslations('Landing.hero');

  return (
    <div className="">
      <section className="bg-blue-marin text-white relative min-h-screen">
        <div className="max-w-screen-2xl mx-auto">

          {/* Background grid pattern */}
          <div className="absolute inset-0">
            <div className="h-full w-full vector-bg"></div>
          </div>

          <div className="px-4 pt-32 pb-20 mx-auto">
            <div className="mx-auto text-center space-y-6 mt-33">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-sm">
                <span className="text-red-500 font-semibold">30</span>
                <span className="ml-1">{t('landlordsRegistered', { count: 30 })}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t('description')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium">
                  {t('tryNow')}
                </button>
                <button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/80 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  {t('viewDemo')}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>


      {/* Image à cheval sur les deux sections */}
      {/* <div className="absolute left-0 right-0 mx-auto px-4 w-full" style={{ top: "calc(100% - 220px)" }}>
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src="/images/landing/house.png" 
            alt="Property management overview" 
            className="w-full aspect-video object-cover" 
            width={840} 
            height={437} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-6 transition-all hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-12 w-12">
                <circle cx="12" cy="12" r="10" />
                <polygon fill="white" points="10 8 16 12 10 16 10 8" />
              </svg>
            </button>
          </div>
        </div>
      </div> */}
      </section>
    </div>
  );
};

export default HeroSection;