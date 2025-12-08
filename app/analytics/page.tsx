'use client';

import { TrendingUp, PieChart, BarChart3, Users, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { analyticsData, appointments, customers } from '../../lib/mockData';

export default function AnalyticsPage() {
  const { language } = useLanguage();

  // Calculate some stats
  const totalRevenue = analyticsData.weeklyRevenue.reduce((a, b) => a + b, 0);
  const avgRevenue = Math.round(totalRevenue / analyticsData.weeklyRevenue.length);
  const peakHour = analyticsData.peakHours.reduce((prev, current) => 
    prev.bookings > current.bookings ? prev : current
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Analytics Dashboard' : 'لوحة التحليلات'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? 'Business insights and performance metrics' 
              : 'رؤى الأعمال ومقاييس الأداء'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>{language === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}</option>
            <option>{language === 'en' ? 'Last 30 Days' : 'آخر 30 يوم'}</option>
            <option>{language === 'en' ? 'Last Quarter' : 'آخر ربع سنة'}</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Weekly Revenue' : 'الإيراد الأسبوعي'}</div>
              <div className="text-2xl font-bold mt-1">{avgRevenue.toLocaleString()} AED</div>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Total Appointments' : 'إجمالي المواعيد'}</div>
              <div className="text-2xl font-bold mt-1">{appointments.length}</div>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" />
                +8.3%
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Customer Growth' : 'نمو العملاء'}</div>
              <div className="text-2xl font-bold mt-1">+{customers.length}</div>
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" />
                +15.2%
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Peak Hour' : 'ساعة الذروة'}</div>
              <div className="text-2xl font-bold mt-1">{peakHour.hour}</div>
              <div className="text-sm text-gray-500 mt-2">
                {peakHour.bookings} {language === 'en' ? 'bookings' : 'حجز'}
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">
              {language === 'en' ? 'Weekly Revenue' : 'الإيراد الأسبوعي'}
            </h3>
            <div className="text-sm text-gray-500">
              {language === 'en' ? 'Last 7 days' : 'آخر 7 أيام'}
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.weeklyRevenue.map((revenue, index) => {
              const days = language === 'en' 
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'];
              const maxRevenue = Math.max(...analyticsData.weeklyRevenue);
              const percentage = (revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-500">{days[index]}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{revenue.toLocaleString()} AED</span>
                      <span className="text-gray-500">{Math.round(percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">
              {language === 'en' ? 'Top Services' : 'أفضل الخدمات'}
            </h3>
            <div className="text-sm text-gray-500">
              {language === 'en' ? 'By popularity' : 'حسب الشعبية'}
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.topServices.map((service, index) => {
              const total = analyticsData.topServices.reduce((sum, s) => sum + s.value, 0);
              const percentage = (service.value / total) * 100;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                       style={{ backgroundColor: colors[index] }}>
                    {service.name.charAt(0)}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{service.name}</span>
                      <span>{service.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[index].replace('bg-', '').replace('-500', '')
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Peak Hours & Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">
            {language === 'en' ? 'Peak Booking Hours' : 'ساعات الذروة للحجز'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{hour.hour}</div>
                <div className={`h-24 rounded-lg flex items-end justify-center ${
                  hour.bookings >= 12 ? 'bg-red-100' :
                  hour.bookings >= 9 ? 'bg-orange-100' :
                  hour.bookings >= 6 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <div 
                    className={`w-8 rounded-t-lg ${
                      hour.bookings >= 12 ? 'bg-red-500' :
                      hour.bookings >= 9 ? 'bg-orange-500' :
                      hour.bookings >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ height: `${(hour.bookings / 15) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium mt-2">{hour.bookings}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">
            {language === 'en' ? 'Staff Performance' : 'أداء الموظفين'}
          </h3>
          <div className="space-y-4">
            {analyticsData.staffPerformance.map((staff, index) => {
              const maxRevenue = Math.max(...analyticsData.staffPerformance.map(s => s.revenue));
              const percentage = (staff.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-600">{staff.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{staff.name}</span>
                      <span>{staff.revenue.toLocaleString()} AED</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{staff.appointments} {language === 'en' ? 'appointments' : 'موعد'}</span>
                      <span>{Math.round(staff.revenue / staff.appointments)} AED avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white border rounded-xl p-6 mt-6">
        <h3 className="font-semibold text-lg mb-4">
          {language === 'en' ? 'Business Insights' : 'رؤى الأعمال'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{language === 'en' ? 'Busiest Day' : 'أكثر الأيام ازدحامًا'}</span>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Fridays generate 35% more revenue than weekdays' 
                : 'الجمعة يولّد إيرادات أكثر بنسبة 35٪ من أيام الأسبوع'}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-green-600" />
              <span className="font-medium">{language === 'en' ? 'Top Service' : 'أفضل خدمة'}</span>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Haircut services account for 28% of total revenue' 
                : 'تشكل خدمات قص الشعر 28٪ من إجمالي الإيرادات'}
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{language === 'en' ? 'Customer Loyalty' : 'ولاء العملاء'}</span>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? '45% of customers return within 30 days of their last visit' 
                : '٪45 من العملاء يعودون خلال 30 يومًا من زيارتهم الأخيرة'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
