'use client';

import { Calendar, Clock, User, Scissors, Mail, Phone, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { services, staff } from '../../lib/mockData';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '../../context/useAppointments';
import { useBookingNotifications } from '../../lib/notificationHelpers';

export default function BookPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { addAppointment } = useAppointments();
  const { sendBookingNotification } = useBookingNotifications();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        display: date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone) {
      alert(language === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const serviceDetails = services.find(s => s.id === selectedService);
    const staffDetails = staff.find(s => s.id === selectedStaff);

    if (!serviceDetails || !staffDetails) {
      alert(language === 'en' ? 'Invalid service or staff selection' : 'اختيار خدمة أو موظف غير صالح');
      return;
    }

    // Create new appointment
    const newAppointment = {
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      service: serviceDetails.name,
      staffId: selectedStaff,
      date: selectedDate,
      time: selectedTime,
      duration: serviceDetails.duration,
      amount: serviceDetails.price,
      email: customerInfo.email,
      status: 'confirmed' as const,
    };

    // Save to store
    addAppointment(newAppointment);

    // Send notification
    sendBookingNotification({
      customerName: customerInfo.name,
      service: serviceDetails.name,
      date: selectedDate,
      time: selectedTime,
      staff: staffDetails.name,
      amount: serviceDetails.price,
    });

    // Store booking data for confirmation page
    sessionStorage.setItem('lastBooking', JSON.stringify({
      ...newAppointment,
      staffName: staffDetails.name,
      serviceName: serviceDetails.name,
      customerEmail: customerInfo.email,
    }));

    // Redirect to confirmation page
    router.push('/book/confirmed');
  };

  const selectedServiceDetails = selectedService ? services.find(s => s.id === selectedService) : null;
  const selectedStaffDetails = selectedStaff ? staff.find(s => s.id === selectedStaff) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <a 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Back to Home' : 'العودة إلى الرئيسية'}</span>
          </a>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-600">ALMULTAQLA</h1>
            <p className="text-sm text-gray-500">{language === 'en' ? 'Booking Portal' : 'بوابة الحجز'}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 relative">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <div className="text-xs mt-2 text-center">
                {language === 'en' 
                  ? ['Service', 'Staff', 'Date & Time', 'Details', 'Confirm'][stepNumber - 1]
                  : ['الخدمة', 'الموظف', 'التاريخ والوقت', 'التفاصيل', 'تأكيد'][stepNumber - 1]}
              </div>
            </div>
          ))}
          <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10">
            <div 
              className="h-1 bg-blue-600 transition-all duration-300"
              style={{ width: `${(step - 1) * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                {language === 'en' ? 'Choose a Service' : 'اختر خدمة'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      selectedService === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.category}</div>
                      </div>
                      <div className="font-bold text-blue-600">{service.price} AED</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {service.duration} {language === 'en' ? 'minutes' : 'دقيقة'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Staff Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                {language === 'en' ? 'Choose Your Staff' : 'اختر الموظف'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => setSelectedStaff(person.id)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      selectedStaff === person.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{person.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.role}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">{language === 'en' ? 'Languages:' : 'اللغات:'}</div>
                      <div className="flex flex-wrap gap-1">
                        {person.languages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {language === 'en' ? 'Select Date & Time' : 'اختر التاريخ والوقت'}
              </h2>
              
              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">{language === 'en' ? 'Available Dates' : 'التواريخ المتاحة'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`p-3 border rounded-lg text-center ${
                        selectedDate === date.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-medium">{date.display}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="font-medium mb-4">{language === 'en' ? 'Available Times' : 'الأوقات المتاحة'}</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border rounded-lg text-center ${
                          selectedTime === time 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Customer Details */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                {language === 'en' ? 'Your Details' : 'تفاصيلك'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'en' ? 'Enter your name' : 'أدخل اسمك'}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-3 h-3 inline mr-1" />
                      {language === 'en' ? 'Phone Number *' : 'رقم الهاتف *'}
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+966 50 123 4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Check className="w-5 h-5" />
                {language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'}
              </h2>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">{language === 'en' ? 'Booking Summary' : 'ملخص الحجز'}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <div className="text-gray-600">{language === 'en' ? 'Service' : 'الخدمة'}</div>
                    <div className="font-medium">{selectedServiceDetails?.name}</div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-3">
                    <div className="text-gray-600">{language === 'en' ? 'Staff' : 'الموظف'}</div>
                    <div className="font-medium">{selectedStaffDetails?.name}</div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-3">
                    <div className="text-gray-600">{language === 'en' ? 'Date & Time' : 'التاريخ والوقت'}</div>
                    <div className="font-medium">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA') : ''} at {selectedTime}
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-3">
                    <div className="text-gray-600">{language === 'en' ? 'Duration' : 'المدة'}</div>
                    <div className="font-medium">{selectedServiceDetails?.duration} {language === 'en' ? 'minutes' : 'دقيقة'}</div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-3">
                    <div className="text-gray-600">{language === 'en' ? 'Customer' : 'العميل'}</div>
                    <div className="font-medium">{customerInfo.name}</div>
                  </div>
                  
                  <div className="flex justify-between pt-3">
                    <div className="text-gray-600">{language === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}</div>
                    <div className="text-xl font-bold text-blue-600">
                      {selectedServiceDetails?.price} AED
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-sm text-yellow-800">
                    {language === 'en' 
                      ? 'Please arrive 10 minutes before your appointment. Late arrivals may result in shortened service time.'
                      : 'يرجى الحضور قبل 10 دقائق من موعدك. قد يؤدي التأخير إلى تقصير وقت الخدمة.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                {language === 'en' ? 'Back' : 'رجوع'}
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && !selectedStaff) ||
                  (step === 3 && (!selectedDate || !selectedTime)) ||
                  (step === 4 && (!customerInfo.name || !customerInfo.phone))
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'en' ? 'Next' : 'التالي'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'}
              </button>
            )}
          </div>
        </div>

        {/* Booking Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-1">{language === 'en' ? 'Easy Booking' : 'حجز سهل'}</h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Book in 5 simple steps' 
                : 'احجز في 5 خطوات بسيطة'}
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium mb-1">{language === 'en' ? 'Flexible Timing' : 'توقيت مرن'}</h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Choose from multiple time slots' 
                : 'اختر من بين فترات زمنية متعددة'}
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-1">{language === 'en' ? 'Instant Confirmation' : 'تأكيد فوري'}</h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Get confirmed immediately' 
                : 'احصل على التأكيد فورًا'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
