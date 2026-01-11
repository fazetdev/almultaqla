'use client';

import { useLanguage } from '../../context/useLanguage';
import { RevenueChart } from './components/RevenueChart';
import { StaffPerformanceChart } from './components/StaffPerformanceChart';
import { PeakHoursChart } from './components/PeakHoursChart';

export default function AnalyticsPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {language === 'en' ? 'Analytics Dashboard' : 'لوحة التحليلات'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <RevenueChart />
        </div>
        
        <div className="bg-white border rounded-xl p-6">
          <div className="services-chart">
            <h4 className="font-medium mb-4">Services/Products Chart</h4>
            <div className="text-gray-500">
              Chart component will load from backend
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-6">
          <StaffPerformanceChart />
        </div>
        
        <div className="bg-white border rounded-xl p-6">
          <PeakHoursChart />
        </div>
      </div>
      
      <div className="bg-white border rounded-xl p-6">
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Analytics data will be loaded from the backend API.' 
            : 'سيتم تحميل بيانات التحليلات من واجهة برمجة التطبيقات الخلفية.'}
        </p>
      </div>
    </div>
  );
}
