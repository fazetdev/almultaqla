'use client';

import { useLanguage } from '../../../context/useLanguage';
import { useTerminology } from '../../../context/useIndustry';

export const StaffPerformanceChart = () => {
  const { language } = useLanguage();
  const terminology = useTerminology();

  return (
    <div className="staff-performance-chart">
      <h4 className="font-medium mb-4">
        {language === 'en' ? `${terminology.staff} Performance` : `أداء ${terminology.staff}`}
      </h4>
      <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        {language === 'en' 
          ? 'Performance chart will load from backend' 
          : 'سيتم تحميل مخطط الأداء من الخلفية'}
      </div>
    </div>
  );
};
