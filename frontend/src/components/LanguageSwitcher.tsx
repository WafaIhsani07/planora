'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
        className="bg-transparent border border-gray-300 dark:border-gray-700 text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="en">English</option>
        <option value="id">Indonesia</option>
      </select>
    </div>
  );
}
