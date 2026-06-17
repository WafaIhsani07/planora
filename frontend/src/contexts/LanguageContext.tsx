'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
import id from '../locales/id.json';

type Language = 'en' | 'id';
type Dictionary = Record<string, any>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Dictionary> = { en, id };

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'id')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = dictionaries[language];
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
