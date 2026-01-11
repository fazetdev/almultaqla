'use client';

import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, LogOut, Bell, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTerminology } from '../../../context/useIndustry';

export default function StaffDashboardPage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const router = useRouter();
  const [staffUser, setStaffUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication - in real app, this would be done via auth context/token
    // For now, we'll simulate authentication check
    const checkAuth = async () => {
      setIsLoading(true);
      
      // TODO: Replace with real authentication check
      // const isAuthenticated = await checkStaffAuth();
      // if (!isAuthenticated) {
      //   router.push('/staff');
      //   return;
      // }
      
      // For demo, simulate staff user
      setStaffUser({
        id: 'staff_1',
        name: 'Staff Member',
        role: terminology.staff
      });
      
      // Load staff appointments
      await loadStaffAppointments();
      setIsLoading(false);
    };

    checkAuth();
  }, [router, terminology.staff]);

  const loadStaffAppointments = async () => {
    try {
      // TODO: Replace with real API call
      // const data = await dataService.getBookings({ 
      //   filters: { staffId: staffUser.id } 
      // });
      // setAppointments(data);
      
      // For now, empty state
      setAppointments([]);
    } catch (error) {
      console.error('Failed to load staff appointments:', error);
    }
  };

  const handleLogout = () => {
    // TODO: Implement proper logout (clear tokens, etc.)
    // sessionStorage.removeItem('staffUser');
    router.push('/staff');
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      // TODO: Implement API call
      // await dataService.updateBooking(appointmentId, { status });
      // Refresh appointments
      await loadStaffAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'en' ? 'Loading dashboard...' : 'جاري تحميل اللوحة...'}
          </p>
        </div>
      </div>
    );
  }

  // Get today's appointments for this staff
  const todaysAppointments = appointments.filter(app =>
    app.date === selectedDate &&
    (app.status === 'confirmed' || app.status === 'pending')
  );

  // Calculate stats
  const completedCount = appointments.filter(app => app.status === 'completed').length;
  const pendingCount = appointments.filter(app => app.status === 'pending').length;
  const totalRevenue = appointments
    .filter(app => app.status === 'completed' || app.status === 'confirmed')
    .reduce((sum: number, app: any) => sum + (app.amount || 0), 0);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'en' ? `${terminology.staff} Dashboard` : `لوحة تحكم ${terminology.staff}`}
              </h1>
              <p className="opacity-90 mt-1">
                {language === 'en'
                  ? `Welcome back, ${staffUser?.name || terminology.staff}!`
                  : `مرحباً بعودتك، ${staffUser?.name || terminology.staff}!`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todaysAppointments.length}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? `Today's ${terminology.appointment}s` : `${terminology.appointment}ات اليوم`}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Completed' : 'مكتملة'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Pending' : 'قيد الانتظار'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} AED</div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? `Today's Schedule` : 'جدول اليوم'}
                  </h2>
                  <div className="text-sm text-gray-600">
                    {formatDateDisplay(selectedDate)}
                  </div>
                </div>
              </div>

              {todaysAppointments.length > 0 ? (
                <div className="divide-y">
                  {todaysAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-lg">{appointment.customerName}</div>
                            <div className="text-gray-600 mt-1">{appointment.type || terminology.service}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(appointment.time)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {appointment.duration || 60} {language === 'en' ? 'min' : 'دقيقة'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)} flex items-center gap-2`}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status === 'confirmed' ? (language === 'en' ? 'Confirmed' : 'مؤكد') :
                             appointment.status === 'pending' ? (language === 'en' ? 'Pending' : 'قيد الانتظار') :
                             appointment.status}
                          </div>
                          
                          <div className="text-xl font-bold text-blue-600">
                            {appointment.amount || 0} AED
                          </div>
                          
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              {language === 'en' ? 'Confirm' : 'تأكيد'}
                            </button>
                          )}
                        </div>
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
                      ? `You don't have any ${terminology.appointment.toLowerCase()}s scheduled for today.`
                      : `ليس لديك أي ${terminology.appointment}ات مجدولة لليوم.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">{staffUser?.name || terminology.staff}</div>
                  <div className="text-gray-600">{staffUser?.role || terminology.staff}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'en' ? 'Member Since' : 'عضو منذ'}</span>
                  <span className="font-medium">2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'en' ? 'Rating' : 'التقييم'}</span>
                  <span className="font-medium">4.8 ★</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'en' ? 'Performance' : 'الأداء'}</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-between">
                  <span>{language === 'en' ? 'View Full Schedule' : 'عرض الجدول الكامل'}</span>
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-between">
                  <span>{language === 'en' ? 'Mark Availability' : 'تحديد التوفر'}</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 flex items-center justify-between">
                  <span>{language === 'en' ? 'Request Time Off' : 'طلب إجازة'}</span>
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                {language === 'en' ? 'This Month' : 'هذا الشهر'}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{language === 'en' ? 'Appointments' : 'المواعيد'}</span>
                    <span className="font-medium">{appointments.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{language === 'en' ? 'Satisfaction' : 'الرضا'}</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
