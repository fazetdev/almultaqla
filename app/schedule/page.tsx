'use client';

import { Calendar as CalendarIcon, Clock, User, Plus, Filter, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { staff, getStaffName } from '../../lib/mockData';
import { useState } from 'react';
import { useAppointments } from '../../context/useAppointments';

export default function SchedulePage() {
  const { language } = useLanguage();
  const { appointments } = useAppointments();
  const [selectedDate, setSelectedDate] = useState('2024-01-22');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [view, setView] = useState<'day' | 'week'>('week');

  // Filter appointments
  const filteredAppointments = appointments.filter(app => {
    const dateMatch = app.date === selectedDate;
    const staffMatch = selectedStaff === 'all' || getStaffName(app.staffId) === selectedStaff;
    return dateMatch && staffMatch;
  });

  // Time slots for the day
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Sample days for week view
  const weekDays = [
    { date: '2024-01-22', day: language === 'en' ? 'Mon' : 'الإثنين' },
    { date: '2024-01-23', day: language === 'en' ? 'Tue' : 'الثلاثاء' },
    { date: '2024-01-24', day: language === 'en' ? 'Wed' : 'الأربعاء' },
    { date: '2024-01-25', day: language === 'en' ? 'Thu' : 'الخميس' },
    { date: '2024-01-26', day: language === 'en' ? 'Fri' : 'الجمعة' },
    { date: '2024-01-27', day: language === 'en' ? 'Sat' : 'السبت' },
    { date: '2024-01-28', day: language === 'en' ? 'Sun' : 'الأحد' },
  ];

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Appointment Schedule' : 'جدول المواعيد'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? `Manage ${appointments.length} appointments` 
              : `إدارة ${appointments.length} موعد`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'day' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              {language === 'en' ? 'Day' : 'يوم'}
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'week' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              {language === 'en' ? 'Week' : 'أسبوع'}
            </button>
          </div>
          
          {/* Add Appointment Button */}
          <a 
            href="/book"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'New Booking' : 'حجز جديد'}</span>
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{language === 'en' ? 'Date:' : 'التاريخ:'}</span>
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {weekDays.map(day => (
                <option key={day.date} value={day.date}>
                  {day.day} - {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{language === 'en' ? 'Staff:' : 'الموظف:'}</span>
            <select 
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'en' ? 'All Staff' : 'كل الموظفين'}</option>
              {staff.map(person => (
                <option key={person.id} value={person.name}>{person.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:ml-auto text-sm text-gray-600">
            {language === 'en' ? 'Showing:' : 'عرض:'} 
            <span className="font-medium ml-2">
              {filteredAppointments.length} {language === 'en' ? 'appointments' : 'موعد'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {/* Week Days Header */}
        {view === 'week' && (
          <div className="grid grid-cols-7 border-b">
            {weekDays.map(day => (
              <div 
                key={day.date} 
                className={`p-4 text-center border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${selectedDate === day.date ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="text-sm text-gray-500">{day.day}</div>
                <div className={`text-lg font-medium ${selectedDate === day.date ? 'text-blue-600' : 'text-gray-800'}`}>
                  {new Date(day.date).getDate()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {appointments.filter(a => a.date === day.date).length} {language === 'en' ? 'appts' : 'موعد'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Time Slots Grid */}
        <div className="p-4">
          <div className="space-y-4">
            {timeSlots.map(timeSlot => {
              const slotAppointments = filteredAppointments.filter(app => 
                app.time.startsWith(timeSlot.split(':')[0])
              );
              
              return (
                <div key={timeSlot} className="flex border-b pb-4 last:border-b-0 last:pb-0">
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-700">{timeSlot}</div>
                  </div>
                  
                  {/* Appointments */}
                  <div className="flex-1">
                    {slotAppointments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {slotAppointments.map(app => (
                          <div 
                            key={app.id} 
                            className={`border rounded-lg p-3 ${getStatusColor(app.status)}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{app.customerName}</div>
                              <div className="text-sm">{app.amount} AED</div>
                            </div>
                            <div className="text-sm flex items-center gap-3 text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {getStaffName(app.staffId)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {app.duration} min
                              </div>
                            </div>
                            <div className="mt-2 text-sm">{app.service}</div>
                            <div className="mt-2 text-xs opacity-75">
                              {app.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm italic pl-4">
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Confirmed' : 'مؤكد'}</div>
              <div className="text-2xl font-bold mt-1 text-green-600">
                {filteredAppointments.filter(a => a.status === 'confirmed').length}
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</div>
              <div className="text-2xl font-bold mt-1 text-yellow-600">
                {filteredAppointments.filter(a => a.status === 'pending').length}
              </div>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Today\'s Revenue' : 'إيراد اليوم'}</div>
              <div className="text-2xl font-bold mt-1">
                {filteredAppointments.reduce((sum, a) => sum + a.amount, 0)} AED
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Total Appointments' : 'إجمالي المواعيد'}</div>
              <div className="text-2xl font-bold mt-1">
                {filteredAppointments.length}
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
