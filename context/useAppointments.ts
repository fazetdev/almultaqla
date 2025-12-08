import { create } from 'zustand';

export interface Appointment {
  id: number;
  customerName: string;
  phone: string;
  service: string;
  staffId: number;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'overdue' | 'completed' | 'cancelled';
  amount: number;
  email?: string;
  notes?: string;
}

interface AppointmentsStore {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: number) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByCustomer: (phone: string) => Appointment[];
}

export const useAppointments = create<AppointmentsStore>((set, get) => ({
  // Initial appointments from mock data
  appointments: [
    { id: 1, customerName: "Ahmed Al-Mansoor", phone: "+966 50 123 4567", service: "Haircut", staffId: 1, date: "2024-01-22", time: "10:00", duration: 45, status: "confirmed", amount: 60 },
    { id: 2, customerName: "Fatima Al-Khalifa", phone: "+966 55 234 5678", service: "Facial", staffId: 2, date: "2024-01-22", time: "11:00", duration: 60, status: "confirmed", amount: 120 },
    { id: 3, customerName: "Mohammed Al-Saud", phone: "+966 54 345 6789", service: "Beard Trim", staffId: 1, date: "2024-01-22", time: "14:00", duration: 30, status: "pending", amount: 40 },
    { id: 4, customerName: "Layla Al-Nahyan", phone: "+971 50 456 7890", service: "Massage", staffId: 3, date: "2024-01-22", time: "15:30", duration: 90, status: "confirmed", amount: 180 },
    { id: 5, customerName: "Omar Al-Qasimi", phone: "+971 55 567 8901", service: "Haircut", staffId: 1, date: "2024-01-22", time: "16:30", duration: 45, status: "overdue", amount: 60 },
    { id: 6, customerName: "Noura Al-Thani", phone: "+974 33 678 9012", service: "Manicure", staffId: 2, date: "2024-01-23", time: "09:30", duration: 45, status: "confirmed", amount: 50 },
    { id: 7, customerName: "Khalid Al-Farsi", phone: "+968 99 789 0123", service: "Pedicure", staffId: 4, date: "2024-01-23", time: "11:00", duration: 60, status: "pending", amount: 70 },
    { id: 8, customerName: "Hessa Al-Kuwari", phone: "+974 55 890 1234", service: "Hair Color", staffId: 4, date: "2024-01-23", time: "13:00", duration: 120, status: "confirmed", amount: 250 },
  ],

  addAppointment: (appointment) => {
    const newId = Math.max(...get().appointments.map(a => a.id), 0) + 1;
    const newAppointment: Appointment = {
      ...appointment,
      id: newId,
      status: 'confirmed', // Default status for new bookings
    };
    
    set((state) => ({
      appointments: [...state.appointments, newAppointment]
    }));
    
    return newAppointment;
  },

  updateAppointment: (id, updates) => {
    set((state) => ({
      appointments: state.appointments.map(appointment =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    }));
  },

  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter(appointment => appointment.id !== id)
    }));
  },

  getAppointmentsByDate: (date) => {
    return get().appointments.filter(appointment => appointment.date === date);
  },

  getAppointmentsByCustomer: (phone) => {
    return get().appointments.filter(appointment => appointment.phone === phone);
  },
}));
