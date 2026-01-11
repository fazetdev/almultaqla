'use client';

import { Calendar, Clock, User, Mail, Phone, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTerminology } from '../../context/useIndustry';

export default function BookPage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Sample data - will come from backend
  const services = [
    { id: '1', name: 'Standard Service', duration: 60, price: 100 },
    { id: '2', name: 'Premium Service', duration: 90, price: 150 },
  ];

  const staffMembers = [
    { id: '1', name: 'Team Member 1', specialization: 'General' },
    { id: '2', name: 'Team Member 2', specialization: 'Specialist' },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff(staffId);
    setStep(3);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(5);
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/bookings/confirmed');
    } catch (error) {
      console.error('Booking failed:', error);
      alert(language === 'en' ? 'Booking failed. Please try again.' : 'فشل الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = services.find(s => s.id === selectedService);
  const selectedStaffObj = staffMembers.find(s => s.id === selectedStaff);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {language === 'en' ? `Book ${terminology.appointment}` : `احجز ${terminology.appointment}`}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? `Schedule your ${terminology.appointment.toLowerCase()} in 5 simple steps` 
              : `جدول ${terminology.appointment} الخاص بك في 5 خطوات بسيطة`}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium
                  ${step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}
                `}>
                  {stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span className="text-center w-20">{language === 'en' ? 'Service' : 'الخدمة'}</span>
            <span className="text-center w-20">{language === 'en' ? 'Staff' : 'الموظف'}</span>
            <span className="text-center w-20">{language === 'en' ? 'Date' : 'التاريخ'}</span>
            <span className="text-center w-20">{language === 'en' ? 'Time' : 'الوقت'}</span>
            <span className="text-center w-20">{language === 'en' ? 'Details' : 'بياناتك'}</span>
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? '1. Select a Service' : '1. اختر خدمة'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`p-6 border-2 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all ${
                      selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-lg mb-2">{service.name}</div>
                    <div className="text-gray-600">
                      <div>{service.duration} {language === 'en' ? 'minutes' : 'دقيقة'}</div>
                      <div className="font-bold text-blue-600 mt-2">{service.price} AED</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? '2. Select Staff Member' : '2. اختر موظف'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffMembers.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => handleStaffSelect(staff.id)}
                    className={`p-6 border-2 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all ${
                      selectedStaff === staff.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-lg">{staff.name}</div>
                        <div className="text-gray-600">{staff.specialization}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-8 text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to services' : 'العودة إلى الخدمات'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? '3. Select Date' : '3. اختر التاريخ'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`p-4 border-2 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 ${
                      selectedDate === date ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{formatDate(date)}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-8 text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to staff selection' : 'العودة إلى اختيار الموظف'}
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? '4. Select Time' : '4. اختر الوقت'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-4 border-2 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 ${
                      selectedTime === time ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{time}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="mt-8 text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to date selection' : 'العودة إلى اختيار التاريخ'}
              </button>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? '5. Your Information' : '5. معلوماتك'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Booking Summary' : 'ملخص الحجز'}</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Service:' : 'الخدمة:'}</span>
                      <span className="font-medium">{selectedServiceObj?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Staff:' : 'الموظف:'}</span>
                      <span className="font-medium">{selectedStaffObj?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Date:' : 'التاريخ:'}</span>
                      <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Time:' : 'الوقت:'}</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>{language === 'en' ? 'Total:' : 'الإجمالي:'}</span>
                        <span className="text-blue-600">{selectedServiceObj?.price} AED</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !customerInfo.name || !customerInfo.phone}
                  className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {language === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-6 h-6" />
                      {language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Navigation Help */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            {language === 'en' 
              ? 'Need help? Contact us at +966 12 345 6789'
              : 'تحتاج مساعدة؟ اتصل بنا على ٩٦٦ ١٢ ٣٤٥ ٦٧٨٩+'}
          </p>
        </div>
      </div>
    </div>
  );
}
