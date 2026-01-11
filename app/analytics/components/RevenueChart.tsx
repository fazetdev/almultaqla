'use client';

import { useLanguage } from '../../../context/useLanguage';

export const RevenueChart = () => {
  const { language } = useLanguage();

  return (
    <div className="revenue-chart">
      <h4 className="font-medium mb-4">
        {language === 'en' ? 'Revenue Overview' : 'نظرة عامة على الإيرادات'}
      </h4>
      <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        {language === 'en' 
          ? 'Revenue chart will load from backend' 
          : 'سيتم تحميل مخطط الإيرادات من الخلفية'}
      </div>
    </div>
  );
};
