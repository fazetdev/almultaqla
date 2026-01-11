'use client';

import { useLanguage } from '../../../context/useLanguage';
import { useState } from 'react';

export const ThemeToggle = () => {
  const { language } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would update the theme context
    console.log('Theme toggled:', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h4 className="font-medium">
          {language === 'en' ? 'Theme' : 'السمة'}
        </h4>
        <p className="text-sm text-gray-600">
          {language === 'en' ? 'Switch between light and dark mode' : 'التبديل بين الوضع الفاتح والداكن'}
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
