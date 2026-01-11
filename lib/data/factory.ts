// Data service factory - abstract interface for backend integration
// All methods return Promises, ready for API implementation

import { DataService, QueryOptions, Booking, Customer, Staff, Service, Payment, AnalyticsData } from './types';

export function createDataService(apiBaseUrl?: string): DataService {
  // This will be implemented with actual API calls
  // For now, returns Promises that will be fulfilled by backend
  
  const callApi = async (endpoint: string, options?: RequestInit) => {
    // This is where real API calls will go
    throw new Error(`API endpoint ${endpoint} not implemented. Backend integration required.`);
  };

  return {
    // Bookings
    async getBookings(options?: QueryOptions): Promise<Booking[]> {
      // TODO: Implement API call to /api/bookings
      return callApi('/api/bookings', {
        method: 'GET'
      }) as Promise<Booking[]>;
    },

    async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
      // TODO: Implement API call to POST /api/bookings
      return callApi('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(booking)
      }) as Promise<Booking>;
    },

    async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
      // TODO: Implement API call to PUT /api/bookings/{id}
      return callApi(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      }) as Promise<Booking>;
    },

    // Customers
    async getCustomers(options?: QueryOptions): Promise<Customer[]> {
      // TODO: Implement API call to /api/customers
      return callApi('/api/customers', {
        method: 'GET'
      }) as Promise<Customer[]>;
    },

    async getCustomer(id: string): Promise<Customer> {
      // TODO: Implement API call to /api/customers/{id}
      return callApi(`/api/customers/${id}`, {
        method: 'GET'
      }) as Promise<Customer>;
    },

    async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
      // TODO: Implement API call to POST /api/customers
      return callApi('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customer)
      }) as Promise<Customer>;
    },

    // Staff
    async getStaff(options?: QueryOptions): Promise<Staff[]> {
      // TODO: Implement API call to /api/staff
      return callApi('/api/staff', {
        method: 'GET'
      }) as Promise<Staff[]>;
    },

    // Services
    async getServices(options?: QueryOptions): Promise<Service[]> {
      // TODO: Implement API call to /api/services
      return callApi('/api/services', {
        method: 'GET'
      }) as Promise<Service[]>;
    },

    // Payments
    async getPayments(options?: QueryOptions): Promise<Payment[]> {
      // TODO: Implement API call to /api/payments
      return callApi('/api/payments', {
        method: 'GET'
      }) as Promise<Payment[]>;
    },

    // Analytics
    async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsData> {
      // TODO: Implement API call to /api/analytics
      return callApi(`/api/analytics?start=${startDate}&end=${endDate}`, {
        method: 'GET'
      }) as Promise<AnalyticsData>;
    },

    // System
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
      // TODO: Implement API call to /api/health
      return callApi('/api/health', {
        method: 'GET'
      }) as Promise<{ status: string; timestamp: string }>;
    }
  };
}

// Default export - will throw errors until backend is implemented
export const dataService = createDataService(process.env.NEXT_PUBLIC_API_URL);
