'use client';

import { Calendar, Clock, User, Scissors, X, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState } from 'react';

export default function MyBookingsPage() {
  const { language } = useLanguage();
  
  // Mock customer bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Haircut',
      staff: 'Ali',
      date: '2024-01-25',
      time: '14:00',
      duration: 45,
      price: 60,
      status: 'confirmed',
      customerName: 'Ahmed Al-Mansoor',
      customerPhone: '+966 50 123 4567'
    },
    {
      id: 2,
      service: 'Facial',
      staff: 'Sarah',
      date: '2024-01-26',
      time: '11:00',
      duration: 60,
      price: 120,
      status: 'pending',
      customerName: 'Ahmed Al-Mansoor',
      customerPhone: '+966 50 123 4567'
    },
    {
      id: 3,
      service: 'Beard Trim',
      staff: 'Ali',
      date: '2024-01-20',
      time: '10:00',
      duration: 30,
      price: 40,
      status: 'completed',
      customerName: 'Ahmed Al-Mansoor',
      customerPhone: '+966 50 123 4567'
    },
    {
      id: 4,
      service: 'Massage',
      staff: 'Maria',
      date: '2024-01-18',
      time: '16:00',
      duration: 90,
      price: 180,
      status: 'completed',
      customerName: 'Ahmed Al-Mansoor',
      customerPhone: '+966 50 123 4567'
    },
  ]);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' || b.status === 'pending'
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'completed'
  );

  const cancelBooking = (id: number) => {
    if (window.confirm(language === 'en' 
      ? 'Are you sure you want to cancel this booking?' 
      : 'هل أنت متأكد من إلغاء هذا الحجز؟')) {
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, status: 'cancelled' } : b
      ));
    }
  };

  const rescheduleBooking = (id: number) => {
    alert(language === 'en' 
      ? 'Redirecting to reschedule page...' 
      : 'إعادة التوجيه إلى صفحة إعادة الجدولة...');
    // In a real app, this would navigate to booking page with pre-filled data
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return language === 'en' ? 'Confirmed' : 'مؤكد';
      case 'pending': return language === 'en' ? 'Pending' : 'قيد الانتظار';
      case 'completed': return language === 'en' ? 'Completed' : 'مكتمل';
      case 'cancelled': return language === 'en' ? 'Cancelled' : 'ملغى';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {language === 'en' ? 'My Bookings' : 'حجوزاتي'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'en' 
                  ? 'Manage your appointments and view booking history' 
                  : 'إدارة مواعيدك وعرض سجل الحجوزات'}
              </p>
            </div>
            <a 
              href="/book"
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {language === 'en' ? 'Book New Appointment' : 'احجز موعدًا جديدًا'}
            </a>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'en' ? 'Upcoming' : 'قادمة'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'en' ? 'Completed' : 'مكتملة'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-2xl font-bold text-orange-600">
                {bookings.reduce((sum, b) => sum + b.price, 0)} AED
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'en' ? 'Total Spent' : 'إجمالي الإنفاق'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-2xl font-bold text-purple-600">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {language === 'en' ? 'All Bookings' : 'كل الحجوزات'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'upcoming' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {language === 'en' ? 'Upcoming Appointments' : 'المواعيد القادمة'}
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {upcomingBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'past' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {language === 'en' ? 'Booking History' : 'سجل الحجوزات'}
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {pastBookings.length}
            </span>
          </button>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {activeTab === 'upcoming' ? (
            upcomingBookings.length > 0 ? (
              <div className="divide-y">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Scissors className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{booking.service}</h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{booking.time} • {booking.duration} {language === 'en' ? 'min' : 'دقيقة'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{booking.staff}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions & Price */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-xl font-bold text-blue-600">
                          {booking.price} AED
                        </div>
                        <div className="flex gap-2">
                          {booking.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => rescheduleBooking(booking.id)}
                                className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
                              </button>
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                {language === 'en' ? 'Cancel' : 'إلغاء'}
                              </button>
                            </>
                          )}
                        </div>
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
                  {language === 'en' ? 'No upcoming appointments' : 'لا توجد مواعيد قادمة'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'en' 
                    ? 'You don\'t have any upcoming appointments. Book your first appointment!' 
                    : 'ليس لديك أي مواعيد قادمة. احجز موعدك الأول!'}
                </p>
                <a 
                  href="/book"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Calendar className="w-4 h-4" />
                  {language === 'en' ? 'Book Appointment' : 'احجز موعدًا'}
                </a>
              </div>
            )
          ) : (
            /* Past Bookings */
            pastBookings.length > 0 ? (
              <div className="divide-y">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{booking.service}</h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{booking.time} • {booking.duration} {language === 'en' ? 'min' : 'دقيقة'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{booking.staff}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-xl font-bold text-blue-600">
                          {booking.price} AED
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {language === 'en' ? 'Completed' : 'مكتمل'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {language === 'en' ? 'No booking history' : 'لا يوجد سجل حجوزات'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'You haven\'t completed any appointments yet.' 
                    : 'لم تكمل أي مواعيد بعد.'}
                </p>
              </div>
            )
          )}
        </div>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium">{language === 'en' ? 'Running Late?' : 'تتأخر؟'}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Please call us if you\'re running late. Late arrivals may result in shortened service time.' 
                : 'يرجى الاتصال بنا إذا كنت تتأخر. قد يؤدي التأخير إلى تقصير وقت الخدمة.'}
            </p>
          </div>
          
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium">{language === 'en' ? 'Need to Reschedule?' : 'تحتاج إلى إعادة جدولة؟'}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'You can reschedule up to 24 hours before your appointment without any charges.' 
                : 'يمكنك إعادة الجدولة حتى 24 ساعة قبل موعدك دون أي رسوم.'}
            </p>
          </div>
          
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium">{language === 'en' ? 'Cancellation Policy' : 'سياسة الإلغاء'}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Cancellations within 24 hours may incur a 50% fee. Please cancel early if needed.' 
                : 'قد تتضمن عمليات الإلغاء خلال 24 ساعة رسومًا بنسبة 50٪. يرجى الإلغاء مبكرًا إذا لزم الأمر.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
