'use client';

import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  X,
  CalendarDays,
  User,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { useTerminology } from '../context/useIndustry';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { language } = useLanguage();
  const terminology = useTerminology();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: terminology.dashboardTitle, href: '/' },
    { icon: Calendar, label: terminology.scheduleTitle, href: '/schedule' },
    { icon: Users, label: terminology.customer + 's', href: '/customers' },
    { icon: CreditCard, label: terminology.payment + 's', href: '/payments' },
    { icon: BarChart3, label: terminology.analyticsTitle, href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const customerMenuItems = [
    { icon: CalendarDays, label: terminology.bookButton, href: terminology.bookingsPath },
    { icon: User, label: 'My ' + terminology.appointment + 's', href: '/my-bookings' },
  ];

  const staffMenuItems = [
    { icon: Briefcase, label: terminology.staff + ' Portal', href: terminology.staffPath },
  ];

  return (
    <aside className="h-full flex flex-col">
      {/* Logo & Close Button */}
      <div className="p-4 md:p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">SmartOps Gulf</h1>
          <p className="text-sm text-gray-500 mt-1">{terminology.business} Dashboard</p>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Navigation */}
      <div className="p-2 md:p-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {language === 'en' ? 'Admin Panel' : 'لوحة التحكم'}
        </div>
        <nav className="mb-6">
          <ul className="space-y-1">
            {adminMenuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Customer Portal Section */}
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {language === 'en' ? 'Customer Portal' : 'بوابة العميل'}
        </div>
        <nav className="mb-6">
          <ul className="space-y-1">
            {customerMenuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Staff Portal Section */}
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {language === 'en' ? 'Staff Portal' : 'بوابة الموظفين'}
        </div>
        <nav>
          <ul className="space-y-1">
            {staffMenuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Current Language */}
      <div className="p-4 border-t mt-auto">
        <p className="text-sm text-gray-500">
          Language: <span className="font-medium">{language === 'en' ? 'English' : 'العربية'}</span>
        </p>
      </div>
    </aside>
  );
}
