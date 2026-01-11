'use client';

import { useLanguage } from '../../../context/useLanguage';

export const PeakHoursChart = () => {
  const { language } = useLanguage();

  return (
    <div className="peak-hours-chart">
      <h4 className="font-medium mb-4">
        {language === 'en' ? 'Peak Hours' : 'ساعات الذروة'}
      </h4>
      <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        {language === 'en' 
          ? 'Peak hours chart will load from backend' 
          : 'سيتم تحميل مخطط ساعات الذروة من الخلفية'}
      </div>
    </div>
  );
};
