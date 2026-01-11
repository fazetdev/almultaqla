// Abstract data types for backend-ready architecture

export interface Booking {
  id: string;
  customerId: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  lastVisit?: string;
  totalSpent: number;
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  performanceScore: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // in minutes
  price: number;
  description?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  method: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export interface AnalyticsData {
  weeklyRevenue: number[];
  staffPerformance: Array<{
    id: string;
    name: string;
    revenue: number;
    bookings: number;
  }>;
  popularServices: Array<{
    id: string;
    name: string;
    count: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: number;
    bookings: number;
  }>;
}

// Filter and query options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Data service interface
export interface DataService {
  // Bookings
  getBookings: (options?: QueryOptions) => Promise<Booking[]>;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
  
  // Customers
  getCustomers: (options?: QueryOptions) => Promise<Customer[]>;
  getCustomer: (id: string) => Promise<Customer>;
  createCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
  
  // Staff
  getStaff: (options?: QueryOptions) => Promise<Staff[]>;
  
  // Services
  getServices: (options?: QueryOptions) => Promise<Service[]>;
  
  // Payments
  getPayments: (options?: QueryOptions) => Promise<Payment[]>;
  
  // Analytics
  getAnalytics: (startDate: string, endDate: string) => Promise<AnalyticsData>;
  
  // System
  healthCheck: () => Promise<{ status: string; timestamp: string }>;
}
