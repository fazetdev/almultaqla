'use client';

import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, LogOut, Bell, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppointments } from '../../../context/useAppointments';
import { staff } from '../../../lib/mockData';

export default function StaffDashboardPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { appointments, updateAppointment } = useAppointments();
  const [staffUser, setStaffUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Check if staff is logged in
    const user = sessionStorage.getItem('staffUser');
    if (!user) {
      router.push('/staff');
      return;
    }
    setStaffUser(JSON.parse(user));
  }, [router]);

  if (!staffUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get staff details
  const staffDetails = staff.find(s => s.id === staffUser.id);
  
  // Get today's appointments for this staff
  const todaysAppointments = appointments.filter(app => 
    app.staffId === staffUser.id && 
    app.date === selectedDate &&
    (app.status === 'confirmed' || app.status === 'pending')
  );

  // Get completed appointments for this month
  const thisMonth = new Date().getMonth() + 1;
  const thisYear = new Date().getFullYear();
  const monthlyAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return app.staffId === staffUser.id && 
           app.status === 'completed' &&
           appDate.getMonth() + 1 === thisMonth &&
           appDate.getFullYear() === thisYear;
  });

  // Calculate stats
  const completedToday = todaysAppointments.filter(a => a.status === 'completed').length;
  const pendingToday = todaysAppointments.filter(a => a.status === 'pending').length;
  const totalRevenue = monthlyAppointments.reduce((sum, a) => sum + a.amount, 0);
  const avgServiceTime = monthlyAppointments.length > 0 
    ? Math.round(monthlyAppointments.reduce((sum, a) => sum + a.duration, 0) / monthlyAppointments.length)
    : 0;

  const handleLogout = () => {
    sessionStorage.removeItem('staffUser');
    router.push('/staff');
  };

  const markAsCompleted = (appointmentId: number) => {
    if (window.confirm(language === 'en' 
      ? 'Mark this appointment as completed?' 
      : 'تحديد هذا الموعد كمكتمل؟')) {
      updateAppointment(appointmentId, { status: 'completed' });
    }
  };

  const markAsNoShow = (appointmentId: number) => {
    if (window.confirm(language === 'en' 
      ? 'Mark this appointment as no-show?' 
      : 'تحديد هذا الموعد كعدم حضور؟')) {
      updateAppointment(appointmentId, { status: 'cancelled' });
    }
  };

  const getTimeRemaining = (appointmentTime: string) => {
    const now = new Date();
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return language === 'en' ? 'Started' : 'بدأ';
    if (diffMins < 60) return `${diffMins} ${language === 'en' ? 'mins' : 'دقيقة'}`;
    const hoursRemaining = Math.floor(diffMins / 60);
    return `${hoursRemaining} ${language === 'en' ? 'hours' : 'ساعة'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 text-xl">
                  {staffDetails?.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {language === 'en' ? 'Staff Dashboard' : 'لوحة تحكم الموظف'}
                </h1>
                <p className="text-gray-600">
                  {staffDetails?.name} • {staffDetails?.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-gray-500">
                {formatDate(selectedDate)}
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{language === 'en' ? "Today's Appointments" : 'مواعيد اليوم'}</div>
                <div className="text-2xl font-bold mt-1">{todaysAppointments.length}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {completedToday} {language === 'en' ? 'completed' : 'مكتمل'}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</div>
                <div className="text-2xl font-bold mt-1 text-yellow-600">{pendingToday}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {language === 'en' ? 'Need attention' : 'بحاجة إلى اهتمام'}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{language === 'en' ? 'Monthly Revenue' : 'الإيراد الشهري'}</div>
                <div className="text-2xl font-bold mt-1 text-green-600">
                  {totalRevenue.toLocaleString()} AED
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {monthlyAppointments.length} {language === 'en' ? 'services' : 'خدمة'}
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{language === 'en' ? 'Avg. Service Time' : 'متوسط وقت الخدمة'}</div>
                <div className="text-2xl font-bold mt-1">{avgServiceTime} min</div>
                <div className="text-xs text-gray-500 mt-2">
                  {language === 'en' ? 'This month' : 'هذا الشهر'}
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{language === 'en' ? 'Select Date:' : 'اختر التاريخ:'}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">{language === 'en' ? 'Next appointment:' : 'الموعد التالي:'}</span>
                {todaysAppointments.length > 0 ? (
                  <span className="font-medium ml-2">
                    {todaysAppointments[0]?.time} • {todaysAppointments[0]?.customerName}
                  </span>
                ) : (
                  <span className="text-gray-400 ml-2">
                    {language === 'en' ? 'No appointments' : 'لا توجد مواعيد'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white border rounded-xl overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? "Today's Schedule" : 'جدول اليوم'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {todaysAppointments.length} {language === 'en' ? 'appointments scheduled' : 'موعد مجدول'}
            </p>
          </div>

          {todaysAppointments.length > 0 ? (
            <div className="divide-y">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          appointment.status === 'completed' ? 'bg-green-100' :
                          appointment.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {appointment.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : appointment.status === 'pending' ? (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{appointment.service}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status === 'completed' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : appointment.status === 'pending' ? (
                                <AlertCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {appointment.status === 'completed' ? (language === 'en' ? 'Completed' : 'مكتمل') :
                               appointment.status === 'pending' ? (language === 'en' ? 'Pending' : 'قيد الانتظار') :
                               (language === 'en' ? 'Confirmed' : 'مؤكد')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{appointment.customerName}</div>
                                <div className="text-sm text-gray-500">{appointment.phone}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{appointment.time}</div>
                                <div className="text-sm text-gray-500">
                                  {appointment.duration} {language === 'en' ? 'minutes' : 'دقيقة'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">
                                  {getTimeRemaining(appointment.time)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.amount} AED
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {appointment.status === 'confirmed' || appointment.status === 'pending' ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => markAsCompleted(appointment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {language === 'en' ? 'Mark Complete' : 'تحديد مكتمل'}
                        </button>
                        <button
                          onClick={() => markAsNoShow(appointment.id)}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          {language === 'en' ? 'No Show' : 'عدم حضور'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {language === 'en' ? 'Completed' : 'مكتمل'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {language === 'en' ? 'No appointments scheduled' : 'لا توجد مواعيد مجدولة'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'You have no appointments scheduled for this date.' 
                  : 'ليس لديك أي مواعيد مجدولة لهذا التاريخ.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">
              {language === 'en' ? 'Performance Summary' : 'ملخص الأداء'}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{language === 'en' ? 'Customer Rating' : 'تقييم العملاء'}</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{language === 'en' ? 'On-time Performance' : 'الأداء في الوقت المحدد'}</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{language === 'en' ? 'Repeat Customers' : 'العملاء المتكررون'}</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">
              {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex flex-col items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                <span className="text-sm">{language === 'en' ? 'Notifications' : 'الإشعارات'}</span>
              </button>
              <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex flex-col items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">{language === 'en' ? 'View Calendar' : 'عرض التقويم'}</span>
              </button>
              <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex flex-col items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm">{language === 'en' ? 'My Profile' : 'ملفي الشخصي'}</span>
              </button>
              <button className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 flex flex-col items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">{language === 'en' ? 'Reports' : 'التقارير'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">
            {language === 'en' ? 'Upcoming Appointments (Next 3 Days)' : 'المواعيد القادمة (3 أيام قادمة)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((dayOffset) => {
              const date = new Date();
              date.setDate(date.getDate() + dayOffset);
              const dateString = date.toISOString().split('T')[0];
              const dayAppointments = appointments.filter(app => 
                app.staffId === staffUser.id && 
                app.date === dateString
              );
              
              return (
                <div key={dayOffset} className="bg-white border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">
                      {date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { weekday: 'short' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dayAppointments.slice(0, 2).map((app) => (
                      <div key={app.id} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-sm">{app.customerName}</div>
                          <div className="text-xs text-gray-500">{app.time}</div>
                        </div>
                        <div className="text-xs text-gray-500">{app.service}</div>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-center text-sm text-gray-500">
                        +{dayAppointments.length - 2} {language === 'en' ? 'more' : 'أكثر'}
                      </div>
                    )}
                    {dayAppointments.length === 0 && (
                      <div className="text-center text-sm text-gray-400 py-2">
                        {language === 'en' ? 'No appointments' : 'لا توجد مواعيد'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
