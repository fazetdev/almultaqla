'use client';

import { useLanguage } from '../../../context/useLanguage';

export const BusinessHoursForm = () => {
  const { language } = useLanguage();

  return (
    <div className="business-hours-form">
      <h4 className="font-medium mb-4">
        {language === 'en' ? 'Business Hours' : 'ساعات العمل'}
      </h4>
      <div className="text-gray-500 text-sm">
        {language === 'en' 
          ? 'Business hours configuration will be available soon.' 
          : 'سيتم توفير إعدادات ساعات العمل قريبًا.'}
      </div>
    </div>
  );
};
