'use client';

import { CheckCircle, Calendar, Clock, User, Scissors, Phone, Mail, Download, Share2 } from 'lucide-react';
import { useLanguage } from '../../../context/useLanguage';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BookingConfirmedPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Get booking data from session storage
    const lastBooking = sessionStorage.getItem('lastBooking');
    if (lastBooking) {
      const bookingData = JSON.parse(lastBooking);
      setBooking({
        ...bookingData,
        id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        bookingTime: new Date().toISOString(),
        location: 'Al-Multaqa Salon, Riyadh, Saudi Arabia'
      });
    } else {
      // If no booking data, redirect to booking page
      router.push('/book');
    }
  }, [router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const copyToClipboard = () => {
    const text = `
Booking ID: ${booking.id}
Service: ${booking.service}
Date: ${formatDate(booking.date)}
Time: ${booking.time}
Staff: ${booking.staffName}
Location: ${booking.location}
Amount: ${booking.amount} AED
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadDetails = () => {
    const content = `
ALMULTAQLA SALON - BOOKING CONFIRMATION
========================================

BOOKING ID: ${booking.id}
CONFIRMATION DATE: ${new Date().toLocaleDateString()}

APPOINTMENT DETAILS:
-------------------
Service: ${booking.service}
Date: ${formatDate(booking.date)}
Time: ${booking.time}
Duration: ${booking.duration} minutes
Staff: ${booking.staffName}
Amount: ${booking.amount} AED

CUSTOMER DETAILS:
----------------
Name: ${booking.customerName}
Phone: ${booking.phone}
Email: ${booking.customerEmail || 'Not provided'}

LOCATION:
--------
${booking.location}

IMPORTANT NOTES:
---------------
1. Please arrive 10 minutes before your appointment
2. Late arrivals may result in shortened service time
3. Cancellations within 24 hours may incur a 50% fee
4. Bring this confirmation with you

Thank you for choosing ALMULTAQLA!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Booking-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'en' 
              ? 'Your appointment has been successfully scheduled' 
              : 'تم جدولة موعدك بنجاح'}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Booking ID: {booking.id}
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <h2 className="text-xl font-bold">
              {language === 'en' ? 'Appointment Details' : 'تفاصيل الموعد'}
            </h2>
            <p className="opacity-90 mt-1">
              {language === 'en' 
                ? 'Save these details for your appointment' 
                : 'احفظ هذه التفاصيل لموعدك'}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Service Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Service' : 'الخدمة'}</div>
                    <div className="font-medium text-lg">{booking.service}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Date' : 'التاريخ'}</div>
                    <div className="font-medium text-lg">{formatDate(booking.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Time' : 'الوقت'}</div>
                    <div className="font-medium text-lg">{booking.time}</div>
                    <div className="text-sm text-gray-500">{booking.duration} {language === 'en' ? 'minutes' : 'دقيقة'}</div>
                  </div>
                </div>
              </div>

              {/* Staff & Customer Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Staff' : 'الموظف'}</div>
                    <div className="font-medium text-lg">{booking.staffName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{language === 'en' ? 'Customer' : 'العميل'}</div>
                    <div className="font-medium text-lg">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </div>
                </div>
                
                {booking.customerEmail && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-lg truncate">{booking.customerEmail}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Amount */}
            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">{language === 'en' ? 'Location' : 'الموقع'}</div>
                  <div className="font-medium">{booking.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{language === 'en' ? 'Amount' : 'المبلغ'}</div>
                  <div className="text-2xl font-bold text-green-600">{booking.amount} AED</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={downloadDetails}
            className="p-4 bg-white border rounded-xl hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
          >
            <Download className="w-6 h-6 text-blue-600" />
            <span>{language === 'en' ? 'Download Details' : 'تحميل التفاصيل'}</span>
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-4 bg-white border rounded-xl hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
          >
            <Share2 className="w-6 h-6 text-green-600" />
            <span>{copied ? (language === 'en' ? 'Copied!' : 'تم النسخ!') : (language === 'en' ? 'Copy Details' : 'نسخ التفاصيل')}</span>
          </button>
          
          <a
            href="/my-bookings"
            className="p-4 bg-white border rounded-xl hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
          >
            <Calendar className="w-6 h-6 text-purple-600" />
            <span>{language === 'en' ? 'View My Bookings' : 'عرض حجوزاتي'}</span>
          </a>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            </span>
            {language === 'en' ? 'Important Notes' : 'ملاحظات مهمة'}
          </h3>
          <ul className="space-y-3 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                {language === 'en' 
                  ? 'Please arrive 10 minutes before your appointment time' 
                  : 'يرجى الحضور قبل 10 دقائق من وقت موعدك'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                {language === 'en' 
                  ? 'Late arrivals may result in shortened service time or rescheduling' 
                  : 'قد يؤدي التأخير إلى تقصير وقت الخدمة أو إعادة الجدولة'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                {language === 'en' 
                  ? 'Cancellations within 24 hours may incur a 50% cancellation fee' 
                  : 'قد تتضمن عمليات الإلغاء خلال 24 ساعة رسوم إلغاء بنسبة 50٪'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                {language === 'en' 
                  ? 'Please bring this confirmation and a valid ID' 
                  : 'يرجى إحضار هذا التأكيد وبطاقة هوية سارية'}
              </span>
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="/book"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {language === 'en' ? 'Book Another Appointment' : 'احجز موعدًا آخر'}
            </a>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              {language === 'en' ? 'Return to Home' : 'العودة إلى الصفحة الرئيسية'}
            </button>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            {language === 'en' 
              ? 'A confirmation email has been sent to your email address' 
              : 'تم إرسال بريد تأكيد إلى عنوان بريدك الإلكتروني'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-gray-600">
            {language === 'en' ? 'Need help?' : 'تحتاج إلى مساعدة؟'}{' '}
            <a href="tel:+966112345678" className="text-blue-600 hover:underline">
              +966 11 234 5678
            </a>{' '}
            •{' '}
            <a href="mailto:info@almultaqa.com" className="text-blue-600 hover:underline">
              info@almultaqa.com
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'en' 
              ? 'Business hours: 9:00 AM - 9:00 PM, Saturday - Thursday' 
              : 'ساعات العمل: 9:00 صباحًا - 9:00 مساءً، السبت - الخميس'}
          </p>
        </div>
      </div>
    </div>
  );
}
