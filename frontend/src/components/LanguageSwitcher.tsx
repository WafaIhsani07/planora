'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#FF9A9E]/30 bg-white/50 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#FF9A9E] hover:bg-white hover:shadow-md active:scale-95"
      title={language === 'en' ? 'Switch to Indonesia' : 'Ubah ke Bahasa Inggris'}
    >
      <Globe className="h-4 w-4 text-[#FF527B] transition-transform duration-500 group-hover:rotate-180" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#2A2A2A]">
        {language === 'en' ? 'EN' : 'ID'}
      </span>
      
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#2A2A2A] px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {language === 'en' ? 'Switch to ID' : 'Ganti ke EN'}
      </div>
    </button>
  );
}
