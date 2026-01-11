'use client';

import { useLanguage } from '../../../context/useLanguage';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h4 className="font-medium">
          {language === 'en' ? 'Language' : 'اللغة'}
        </h4>
        <p className="text-sm text-gray-600">
          {language === 'en' ? 'Toggle between English and Arabic' : 'التبديل بين الإنجليزية والعربية'}
        </p>
      </div>
      <button
        onClick={toggleLanguage}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
};
