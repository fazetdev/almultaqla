'use client';

import { useIndustry } from '../context/useIndustry';
import { Industry } from '../lib/config/terminology';
import { Briefcase, Heart, Building, Truck, School } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

const industries: Array<{ 
  id: Industry; 
  name: string; 
  icon: any;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
}> = [
  { 
    id: 'salon', 
    name: 'Salon/Spa', 
    icon: Briefcase,
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  { 
    id: 'clinic', 
    name: 'Clinic/Medical', 
    icon: Heart,
    color: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  { 
    id: 'retail', 
    name: 'Retail/Store', 
    icon: Building,
    color: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  { 
    id: 'delivery', 
    name: 'Delivery', 
    icon: Truck,
    color: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700'
  },
  { 
    id: 'school', 
    name: 'School/Academy', 
    icon: School,
    color: 'indigo',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-indigo-600',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700'
  }
];

export const DashboardIndustrySwitcher = () => {
  const { currentIndustry, setCurrentIndustry } = useIndustry();
  const { language } = useLanguage();

  const handleIndustrySelect = (industry: Industry) => {
    setCurrentIndustry(industry);
    // No router.refresh() - let React state handle the update
  };

  const currentIndustryConfig = industries.find(ind => ind.id === currentIndustry);
  const CurrentIcon = currentIndustryConfig?.icon || Briefcase;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">
            {language === 'en' ? 'Select Industry Dashboard' : 'اختر لوحة تحكم الصناعة'}
          </h3>
          <p className="text-sm text-gray-600">
            {language === 'en' 
              ? 'Switch between different business types. Dashboard updates instantly.' 
              : 'التبديل بين أنواع الأعمال المختلفة. تحديث اللوحة فورًا.'}
          </p>
        </div>
        {currentIndustryConfig && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${currentIndustryConfig.color}-100 ${currentIndustryConfig.textColor}`}>
            {language === 'en' ? 'Current' : 'حالي'}: {currentIndustryConfig.name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {industries.map((industry) => {
          const isActive = currentIndustry === industry.id;
          const Icon = industry.icon;
          
          return (
            <button
              key={industry.id}
              onClick={() => handleIndustrySelect(industry.id)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${isActive 
                  ? `${industry.borderColor} bg-${industry.color}-50 transform scale-105 shadow-md` 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${isActive 
                    ? `bg-gradient-to-r ${industry.gradientFrom} ${industry.gradientTo} text-white` 
                    : `bg-${industry.color}-100 text-${industry.color}-600`
                  }
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`font-medium text-sm ${isActive ? industry.textColor : 'text-gray-700'}`}>
                  {industry.name}
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Industry Info */}
      {currentIndustryConfig && (
        <div className={`p-4 rounded-xl border ${currentIndustryConfig.borderColor} bg-${currentIndustryConfig.color}-50`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${currentIndustryConfig.color}-100`}>
              <CurrentIcon className={`w-5 h-5 ${currentIndustryConfig.textColor}`} />
            </div>
            <div>
              <div className="font-medium">
                {language === 'en' ? 'Currently Viewing' : 'تشاهد حاليًا'}: {currentIndustryConfig.name} Dashboard
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'All terminology, data, and colors are adapted for this industry.' 
                  : 'تم تكييف جميع المصطلحات والبيانات والألوان لهذه الصناعة.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
