import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
}

export const useNotifications = create<NotificationsStore>((set, get) => ({
  notifications: [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking',
      message: 'Ahmed booked a haircut for tomorrow at 2:00 PM',
      timestamp: new Date('2024-01-21T10:30:00'),
      read: false,
      data: { customer: 'Ahmed', service: 'Haircut', time: '2:00 PM' }
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Fatima paid 120 AED for facial treatment',
      timestamp: new Date('2024-01-21T09:15:00'),
      read: false,
      data: { customer: 'Fatima', amount: 120, service: 'Facial' }
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'Mohammed has an appointment in 2 hours',
      timestamp: new Date('2024-01-21T08:45:00'),
      read: true,
      data: { customer: 'Mohammed', time: '10:00 AM' }
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      message: 'New features added to booking portal',
      timestamp: new Date('2024-01-20T16:20:00'),
      read: true,
      data: { version: '1.5.0' }
    },
  ],
  
  unreadCount: 2,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
      unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length,
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      return {
        notifications: state.notifications.filter(notification => notification.id !== id),
        unreadCount: notification?.read ? state.unreadCount : state.unreadCount - 1,
      };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  getNotificationsByType: (type) => {
    return get().notifications.filter(notification => notification.type === type);
  },
}));
