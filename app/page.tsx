'use client';

import { TrendingUp, Users, Calendar, Star, Clock, DollarSign, ArrowRight, Zap, Target } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import Link from 'next/link';
import { useTerminology, useIndustry } from '../context/useIndustry';
import { DashboardIndustrySwitcher } from '../components/DashboardIndustrySwitcher';

// Industry color configurations
const industryColors = {
  salon: {
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    lightColor: 'bg-purple-100'
  },
  clinic: {
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    lightColor: 'bg-green-100'
  },
  retail: {
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    lightColor: 'bg-blue-100'
  },
  delivery: {
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    lightColor: 'bg-orange-100'
  },
  school: {
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    lightColor: 'bg-indigo-100'
  }
};

export default function Home() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const { currentIndustry } = useIndustry();
  
  const colors = industryColors[currentIndustry] || industryColors.retail;

  const stats = [
    { 
      title: language === 'en' ? 'Weekly Revenue' : 'الإيراد الأسبوعي', 
      value: '--', 
      icon: TrendingUp, 
      color: 'blue' as const,
      change: 'Loading...'
    },
    { 
      title: language === 'en' ? 'New Clients' : 'عملاء جدد', 
      value: '--', 
      icon: Users, 
      color: 'green' as const,
      change: 'Loading...'
    },
    { 
      title: language === 'en' ? "Today's Bookings" : 'حجوزات اليوم', 
      value: '--', 
      icon: Calendar, 
      color: 'purple' as const,
      change: 'Loading...'
    },
    { 
      title: language === 'en' ? 'Client Rating' : 'تقييم العملاء', 
      value: '--', 
      icon: Star, 
      color: 'orange' as const,
      change: 'Loading...'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Industry Colors */}
      <div className={`rounded-xl p-6 md:p-8 text-white bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  SmartOps Gulf Dashboard
                </h1>
                <p className="opacity-90 mt-1">
                  {language === 'en' 
                    ? `Multi-industry operations dashboard for ${terminology.business.toLowerCase()}s` 
                    : `لوحة تحكم عمليات متعددة الصناعات ${terminology.business}ات`}
                </p>
              </div>
            </div>
            
            <p className="mb-6 opacity-90 max-w-2xl">
              {language === 'en' 
                ? `Currently optimized for ${terminology.business.toLowerCase()} operations. Switch industries below to instantly transform the dashboard.`
                : `محسن حاليًا لعمليات ${terminology.business.toLowerCase()}ات. قم بتبديل الصناعات أدناه لتحويل اللوحة على الفور.`}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/bookings"
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {language === 'en' ? `Book ${terminology.appointment}` : `احجز ${terminology.appointment}`}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30"
              >
                {language === 'en' ? 'View Analytics' : 'عرض التحليلات'}
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Current Industry Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:w-80">
            <h3 className="font-medium mb-3">
              {language === 'en' ? 'Current Dashboard' : 'لوحة التحكم الحالية'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">{language === 'en' ? 'Industry' : 'الصناعة'}:</span>
                <span className="font-medium">{terminology.business}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">{terminology.customer}s:</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">{terminology.appointment}s:</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">{terminology.staff}:</span>
                <span className="font-medium">--</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-xs opacity-90">
                {language === 'en' 
                  ? 'Colors and terminology adapt to selected industry'
                  : 'تتكيف الألوان والمصطلحات مع الصناعة المحددة'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One-Touch Industry Switcher */}
      <div className="bg-white border rounded-xl p-6">
        <DashboardIndustrySwitcher />
      </div>

      {/* Stats Grid with Industry Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white border rounded-xl p-5 ${colors.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.change && (
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500">{stat.change}</span>
                  </div>
                )}
              </div>
              <div className={`p-3 ${colors.lightColor} rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${colors.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industry-Specific Content */}
      <div className={`bg-white border rounded-xl p-6 ${colors.borderColor}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? `${terminology.business} Dashboard` : `لوحة تحكم ${terminology.business}`}
            </h2>
            <p className="text-gray-600 mt-1">
              {language === 'en' 
                ? `Optimized for ${terminology.business.toLowerCase()} management with industry-specific features`
                : `مُحسّن لإدارة ${terminology.business.toLowerCase()}ات بميزات خاصة بالصناعة`}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors.lightColor} ${colors.textColor}`}>
            {language === 'en' ? 'Active Industry' : 'صناعة نشطة'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${colors.lightColor} rounded-lg`}>
                <Users className={`w-5 h-5 ${colors.textColor}`} />
              </div>
              <div className="font-medium">{terminology.customer} Management</div>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? `Manage ${terminology.customer.toLowerCase()} profiles, bookings, and history`
                : `إدارة ملفات ${terminology.customer.toLowerCase()}ات والحجوزات والتاريخ`}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${colors.lightColor} rounded-lg`}>
                <Calendar className={`w-5 h-5 ${colors.textColor}`} />
              </div>
              <div className="font-medium">{terminology.appointment} Scheduling</div>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? `Schedule and manage ${terminology.appointment.toLowerCase()}s with ${terminology.staff.toLowerCase()}`
                : `جدولة وإدارة ${terminology.appointment.toLowerCase()}ات مع ${terminology.staff.toLowerCase()}`}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${colors.lightColor} rounded-lg`}>
                <Target className={`w-5 h-5 ${colors.textColor}`} />
              </div>
              <div className="font-medium">{terminology.business} Analytics</div>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? `Track performance, revenue, and ${terminology.customer.toLowerCase()} satisfaction`
                : `تتبع الأداء والإيرادات ورضا ${terminology.customer.toLowerCase()}ات`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Bookings */}
        <div className={`bg-white border rounded-xl p-6 ${colors.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {language === 'en' ? `Today's ${terminology.appointment}s` : `${terminology.appointment}ات اليوم`}
            </h3>
            <span className="text-sm text-gray-500">
              -- {language === 'en' ? 'total' : 'إجمالي'}
            </span>
          </div>
          <div className="text-center py-8 text-gray-500">
            {language === 'en' 
              ? `${terminology.appointment} data will load from backend` 
              : `بيانات ${terminology.appointment}ات ستحمل من الخلفية`}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">
            {language === 'en' ? 'Quick Access' : 'وصول سريع'}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[terminology.customer + 's', terminology.staff, terminology.appointment + 's', 'Analytics'].map((item) => (
              <div key={item} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">--</div>
                    <div className="text-sm text-gray-600">{item}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link 
            href="/bookings"
            className={`block w-full ${colors.buttonColor} text-white text-center py-3 rounded-lg font-medium transition-all`}
          >
            {language === 'en' ? `Go to ${terminology.appointment} Portal` : `انتقل إلى بوابة ${terminology.appointment}ات`}
          </Link>
        </div>
      </div>

      {/* SmartOps Value Proposition */}
      <div className={`${colors.bgColor} border ${colors.borderColor} rounded-xl p-6`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 ${colors.lightColor} rounded-lg`}>
            <Zap className={`w-5 h-5 ${colors.textColor}`} />
          </div>
          <div>
            <h4 className={`font-medium ${colors.textColor}`}>
              {language === 'en' ? 'SmartOps Multi-Industry Advantage' : 'ميزة SmartOps متعددة الصناعات'}
            </h4>
            <p className="text-gray-700 text-sm mt-1">
              {language === 'en'
                ? `One dashboard for all business types. Switch industries instantly - the dashboard adapts colors, terminology, and features to match your ${terminology.business.toLowerCase()} operations.`
                : `لوحة تحكم واحدة لجميع أنواع الأعمال. قم بتبديل الصناعات على الفور - تتكيف اللوحة مع الألوان والمصطلحات والميزات لتتناسب مع عمليات ${terminology.business.toLowerCase()}ات الخاصة بك.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
