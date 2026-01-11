'use client';

import { useLanguage } from '../../context/useLanguage';
import { BusinessModeToggle } from './components/BusinessModeToggle';
import { ScheduleSettings } from './components/ScheduleSettings';
import { IndustrySwitcher } from './components/IndustrySwitcher';
import { LanguageToggle } from './components/LanguageToggle';
import { ThemeToggle } from './components/ThemeToggle';

export default function SettingsPage() {
  const { language } = useLanguage();

  const handleBusinessModeToggle = (enabled: boolean) => {
    console.log('Business mode toggled:', enabled);
    // Will be implemented with backend
  };

  const handleScheduleSave = async (settings: any) => {
    console.log('Schedule settings saved:', settings);
    // Will be implemented with backend
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {language === 'en' ? 'Settings' : 'الإعدادات'}
      </h1>

      {/* Industry Configuration */}
      <div className="bg-white border rounded-xl p-6">
        <IndustrySwitcher />
      </div>

      {/* Business Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <BusinessModeToggle
            isEnabled={false}
            onToggle={handleBusinessModeToggle}
            label={language === 'en' ? 'Business Mode' : 'وضع العمل'}
            description={language === 'en' 
              ? 'Configure business operation settings' 
              : 'تهيئة إعدادات تشغيل العمل'}
          />
        </div>

        <div className="bg-white border rounded-xl p-6">
          <ScheduleSettings onSave={handleScheduleSave} />
        </div>
      </div>

      {/* UI Settings */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-medium text-lg mb-4">
          {language === 'en' ? 'Interface Settings' : 'إعدادات الواجهة'}
        </h3>
        <div className="space-y-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-medium text-lg mb-4">
          {language === 'en' ? 'System Information' : 'معلومات النظام'}
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Dashboard:</strong> SmartOps Gulf Dashboard</p>
          <p><strong>Version:</strong> 2.0.0 (Multi-Industry)</p>
          <p><strong>Backend Status:</strong> Not connected (Demo Mode)</p>
          <p><strong>Data Source:</strong> Abstract data layer ready</p>
        </div>
      </div>
    </div>
  );
}
