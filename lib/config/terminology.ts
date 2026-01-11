// Terminology configuration for multi-industry support

export type Industry = 'salon' | 'clinic' | 'retail' | 'delivery' | 'school';

export interface Terminology {
  // Entity names
  appointment: string;
  customer: string;
  service: string;
  staff: string;
  business: string;
  payment: string;
  
  // UI labels
  dashboardTitle: string;
  bookButton: string;
  scheduleTitle: string;
  analyticsTitle: string;
  
  // URLs/paths
  bookingsPath: string;
  customersPath: string;
  staffPath: string;
}

export const industryTerminology: Record<Industry, Terminology> = {
  salon: {
    appointment: 'Appointment',
    customer: 'Customer',
    service: 'Service',
    staff: 'Stylist',
    business: 'Salon',
    payment: 'Payment',
    dashboardTitle: 'Salon Management',
    bookButton: 'Book Appointment',
    scheduleTitle: 'Appointment Schedule',
    analyticsTitle: 'Salon Analytics',
    bookingsPath: '/bookings',
    customersPath: '/customers',
    staffPath: '/staff'
  },
  clinic: {
    appointment: 'Consultation',
    customer: 'Patient',
    service: 'Treatment',
    staff: 'Doctor',
    business: 'Clinic',
    payment: 'Bill',
    dashboardTitle: 'Clinic Management',
    bookButton: 'Book Consultation',
    scheduleTitle: 'Consultation Schedule',
    analyticsTitle: 'Clinic Analytics',
    bookingsPath: '/bookings',
    customersPath: '/patients',
    staffPath: '/doctors'
  },
  retail: {
    appointment: 'Booking',
    customer: 'Customer',
    service: 'Product',
    staff: 'Sales Agent',
    business: 'Store',
    payment: 'Invoice',
    dashboardTitle: 'Retail Management',
    bookButton: 'Make Booking',
    scheduleTitle: 'Booking Schedule',
    analyticsTitle: 'Retail Analytics',
    bookingsPath: '/bookings',
    customersPath: '/customers',
    staffPath: '/staff'
  },
  delivery: {
    appointment: 'Delivery Slot',
    customer: 'Client',
    service: 'Delivery',
    staff: 'Driver',
    business: 'Delivery Service',
    payment: 'Charge',
    dashboardTitle: 'Delivery Management',
    bookButton: 'Schedule Delivery',
    scheduleTitle: 'Delivery Schedule',
    analyticsTitle: 'Delivery Analytics',
    bookingsPath: '/deliveries',
    customersPath: '/clients',
    staffPath: '/drivers'
  },
  school: {
    appointment: 'Session',
    customer: 'Student',
    service: 'Course',
    staff: 'Teacher',
    business: 'School',
    payment: 'Fee',
    dashboardTitle: 'School Management',
    bookButton: 'Schedule Session',
    scheduleTitle: 'Class Schedule',
    analyticsTitle: 'School Analytics',
    bookingsPath: '/sessions',
    customersPath: '/students',
    staffPath: '/teachers'
  }
};

// Default industry (can be changed via settings)
export const DEFAULT_INDUSTRY: Industry = 'retail';

// Get terminology for current industry
export function getTerminology(industry: Industry = DEFAULT_INDUSTRY): Terminology {
  return industryTerminology[industry];
}

// Helper to get specific term
export function getTerm(industry: Industry, key: keyof Terminology): string {
  return industryTerminology[industry][key];
}
