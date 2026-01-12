// Data service factory - backend integrated API implementation

import { DataService, QueryOptions, Booking, Customer, Staff, Service, Payment, AnalyticsData } from './types';

export function createDataService(apiBaseUrl?: string): DataService {
  const baseUrl = apiBaseUrl || '';
  
  const callApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error (${response.status}): ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  };

  // Helper to convert QueryOptions to query string
  const buildQueryString = (options?: QueryOptions): string => {
    if (!options) return '';
    
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  return {
    // Bookings
    async getBookings(options?: QueryOptions): Promise<Booking[]> {
      const queryString = buildQueryString(options);
      return callApi<Booking[]>(`/api/bookings${queryString}`, {
        method: 'GET',
      });
    },

    async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
      return callApi<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
      });
    },

    async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
      return callApi<Booking>(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // Customers
    async getCustomers(options?: QueryOptions): Promise<Customer[]> {
      const queryString = buildQueryString(options);
      return callApi<Customer[]>(`/api/customers${queryString}`, {
        method: 'GET',
      });
    },

    async getCustomer(id: string): Promise<Customer> {
      return callApi<Customer>(`/api/customers/${id}`, {
        method: 'GET',
      });
    },

    async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
      return callApi<Customer>('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
      });
    },

    // Staff
    async getStaff(options?: QueryOptions): Promise<Staff[]> {
      const queryString = buildQueryString(options);
      return callApi<Staff[]>(`/api/staff${queryString}`, {
        method: 'GET',
      });
    },

    // Services
    async getServices(options?: QueryOptions): Promise<Service[]> {
      const queryString = buildQueryString(options);
      return callApi<Service[]>(`/api/services${queryString}`, {
        method: 'GET',
      });
    },

    // Payments
    async getPayments(options?: QueryOptions): Promise<Payment[]> {
      const queryString = buildQueryString(options);
      return callApi<Payment[]>(`/api/payments${queryString}`, {
        method: 'GET',
      });
    },

    // Analytics
    async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsData> {
      return callApi<AnalyticsData>(`/api/analytics?start=${startDate}&end=${endDate}`, {
        method: 'GET',
      });
    },

    // System
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
      return callApi<{ status: string; timestamp: string }>('/api/health', {
        method: 'GET',
      });
    }
  };
}

// Default export
export const dataService = createDataService(process.env.NEXT_PUBLIC_API_URL);
