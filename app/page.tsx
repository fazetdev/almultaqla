'use client';

import { TrendingUp, Users, Calendar, Star, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { appointments, customers, analyticsData } from '../lib/mockData';
import Link from 'next/link';

export default function Home() {
  const { language } = useLanguage();

  // Calculate stats from mock data
  const totalRevenue = analyticsData.weeklyRevenue.reduce((a, b) => a + b, 0);
  const newCustomers = customers.filter(c => {
    const lastVisit = new Date(c.lastVisit);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastVisit > weekAgo;
  }).length;

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today);
  
  const stats = [
    { 
      title: language === 'en' ? 'Weekly Revenue' : 'الإيراد الأسبوعي', 
      value: `${totalRevenue.toLocaleString()} AED`, 
      icon: TrendingUp, 
      color: 'blue' as const,
      change: '+12%'
    },
    { 
      title: language === 'en' ? 'New Customers' : 'عملاء جدد', 
      value: newCustomers.toString(), 
      icon: Users, 
      color: 'green' as const,
      change: '+8%'
    },
    { 
      title: language === 'en' ? "Today's Appointments" : 'مواعيد اليوم', 
      value: todaysAppointments.length.toString(), 
      icon: Calendar, 
      color: 'purple' as const,
      change: '-2%'
    },
    { 
      title: language === 'en' ? 'Customer Rating' : 'تقييم العملاء', 
      value: '4.8', 
      icon: Star, 
      color: 'orange' as const,
      change: '+0.3'
    },
  ];

  // Get top staff member
  const topStaff = analyticsData.staffPerformance.reduce((prev, current) => 
    prev.revenue > current.revenue ? prev : current
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Booking CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Welcome to ALMULTAQLA' : 'مرحباً بك في المتلقى'}
          </h1>
          <p className="mt-2 opacity-90 mb-4">
            {language === 'en' 
              ? `You have ${todaysAppointments.length} appointments today. ${topStaff.name} is your top performer.` 
              : `لديك ${todaysAppointments.length} مواعيد اليوم. ${topStaff.name} هو أفضل موظف لديك.`}
          </p>
          <Link 
            href="/book"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            {language === 'en' ? 'View Booking Portal' : 'عرض بوابة الحجز'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-700 to-transparent"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white border rounded-xl p-5 ${stat.color === 'blue' ? 'border-blue-200' : 
            stat.color === 'green' ? 'border-green-200' : 
            stat.color === 'purple' ? 'border-purple-200' : 'border-orange-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.change && (
                  <div className="flex items-center mt-2 text-sm">
                    <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {language === 'en' ? 'from last week' : 'من الأسبوع الماضي'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {language === 'en' ? "Today's Appointments" : 'مواعيد اليوم'}
            </h3>
            <span className="text-sm text-gray-500">
              {todaysAppointments.length} {language === 'en' ? 'total' : 'إجمالي'}
            </span>
          </div>
          <div className="space-y-3">
            {todaysAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">{appointment.customerName}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time} • {appointment.service}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                  <span className="text-sm font-medium">
                    {appointment.amount} AED
                  </span>
                </div>
              </div>
            ))}
            {todaysAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {language === 'en' ? 'No appointments scheduled for today' : 'لا توجد مواعيد مجدولة لهذا اليوم'}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats & Booking CTA */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">
            {language === 'en' ? 'Quick Access' : 'وصول سريع'}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Total Customers' : 'إجمالي العملاء'}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analyticsData.staffPerformance.length}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Staff Members' : 'أعضاء الطاقم'}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'This Month' : 'هذا الشهر'}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{topStaff.name}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Top Staff' : 'أفضل موظف'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Portal Link */}
          <Link 
            href="/book"
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            {language === 'en' ? 'Go to Customer Booking Portal' : 'انتقل إلى بوابة حجز العملاء'}
          </Link>
        </div>
      </div>
    </div>
  );
}
