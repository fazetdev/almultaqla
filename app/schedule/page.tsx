'use client';

import { Calendar as CalendarIcon, Clock, User, Plus, Filter, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState, useEffect } from 'react';
import { useTerminology } from '../../context/useIndustry';

export default function SchedulePage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [view, setView] = useState<'day' | 'week'>('week');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    // Load data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API calls
        // const [apps, staff] = await Promise.all([
        //   dataService.getBookings(),
        //   dataService.getStaff()
        // ]);
        // setAppointments(apps);
        // setStaffMembers(staff);
        
        // For now, empty state
        setAppointments([]);
        setStaffMembers([]);
      } catch (error) {
        console.error('Failed to load schedule data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Time slots for the day
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Generate week days
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { weekday: 'short' })
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return language === 'en' ? 'Confirmed' : 'مؤكد';
      case 'pending': return language === 'en' ? 'Pending' : 'قيد الانتظار';
      case 'overdue': return language === 'en' ? 'Overdue' : 'متأخر';
      case 'completed': return language === 'en' ? 'Completed' : 'مكتمل';
      case 'cancelled': return language === 'en' ? 'Cancelled' : 'ملغى';
      default: return status;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'en' ? 'Loading schedule...' : 'جاري تحميل الجدول...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? terminology.scheduleTitle : `جدول ${terminology.appointment}ات`}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en'
              ? `Manage and view ${terminology.appointment.toLowerCase()} schedule`
              : `إدارة وعرض جدول ${terminology.appointment}ات`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                view === 'day' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              {language === 'en' ? 'Day' : 'يوم'}
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                view === 'week' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              {language === 'en' ? 'Week' : 'أسبوع'}
            </button>
          </div>
          
          {/* Staff Filter */}
          <div className="relative">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                {language === 'en' ? `All ${terminology.staff}` : `كل ${terminology.staff}`}
              </option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Add Appointment Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {language === 'en' ? `Add ${terminology.appointment}` : `إضافة ${terminology.appointment}`}
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </button>
            <div className="font-medium">
              {view === 'day' 
                ? formatDateDisplay(selectedDate)
                : language === 'en' ? 'This Week' : 'هذا الأسبوع'}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              &larr;
            </button>
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg">
              {language === 'en' ? 'Today' : 'اليوم'}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      {view === 'day' ? (
        // Day View
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">
              {formatDateDisplay(selectedDate)}
            </h3>
          </div>
          
          <div className="divide-y">
            {timeSlots.map((time) => {
              const slotAppointments = appointments.filter(app => 
                app.date === selectedDate && app.time === time
              );
              
              return (
                <div key={time} className="p-4 hover:bg-gray-50">
                  <div className="flex">
                    <div className="w-20 flex-shrink-0">
                      <div className="font-medium">{time}</div>
                    </div>
                    
                    <div className="flex-1">
                      {slotAppointments.length > 0 ? (
                        slotAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`mb-2 last:mb-0 p-3 border rounded-lg ${getStatusColor(appointment.status)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{appointment.customerName}</div>
                                <div className="text-sm mt-1 flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {appointment.staffName || 'Staff'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {appointment.amount} AED
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm px-2 py-1 rounded-full bg-white/50">
                                  {getStatusText(appointment.status)}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Filter className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 italic py-2">
                          {language === 'en' ? 'No appointments' : 'لا توجد مواعيد'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Week View
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header */}
              <div className="flex border-b">
                <div className="w-24 border-r p-4 font-medium">
                  {language === 'en' ? 'Time' : 'الوقت'}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={day.date}
                    className={`w-48 border-r p-4 text-center ${
                      day.date === selectedDate ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{day.day}</div>
                    <div className="text-sm text-gray-600">
                      {day.date.split('-')[2]}/{day.date.split('-')[1]}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="flex border-b last:border-b-0">
                  <div className="w-24 border-r p-4 font-medium">
                    {time}
                  </div>
                  
                  {weekDays.map((day) => {
                    const dayAppointments = appointments.filter(app => 
                      app.date === day.date && app.time === time
                    );
                    
                    return (
                      <div
                        key={`${day.date}-${time}`}
                        className="w-48 border-r p-4 min-h-20"
                      >
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`mb-1 p-2 rounded text-sm ${getStatusColor(appointment.status)}`}
                          >
                            <div className="font-medium truncate">{appointment.customerName}</div>
                            <div className="text-xs truncate">{appointment.type}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <h4 className="font-medium mb-3">
          {language === 'en' ? 'Status Legend' : 'مفتاح الحالة'}
        </h4>
        <div className="flex flex-wrap gap-3">
          {['confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`} />
              <span className="text-sm">{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="mt-6 bg-white rounded-xl border p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {language === 'en' ? `No ${terminology.appointment}s Scheduled` : `لا توجد ${terminology.appointment}ات مجدولة`}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'en'
              ? `Start scheduling ${terminology.appointment.toLowerCase()}s to see them appear here.`
              : `ابدأ في جدولة ${terminology.appointment}ات لتراها تظهر هنا.`}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            {language === 'en' ? `Schedule ${terminology.appointment}` : `جدول ${terminology.appointment}`}
          </button>
        </div>
      )}
    </div>
  );
}
