'use client';

import { Bell, Check, X, Clock, DollarSign, Calendar, Settings } from 'lucide-react';
import { useNotifications, Notification } from '../context/useNotifications';
import { useLanguage } from '../context/useLanguage';
import { useState } from 'react';

export default function NotificationsDropdown() {
  const { language } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'booking': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'reminder': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'system': return <Settings className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return language === 'en' ? 'Just now' : 'الآن';
    if (diffMins < 60) return `${diffMins} ${language === 'en' ? 'min ago' : 'دقيقة'}`;
    if (diffHours < 24) return `${diffHours} ${language === 'en' ? 'hours ago' : 'ساعة'}`;
    if (diffDays < 7) return `${diffDays} ${language === 'en' ? 'days ago' : 'يوم'}`;
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA');
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Notifications' : 'الإشعارات'}
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      {unreadCount} {language === 'en' ? 'new' : 'جديد'}
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {language === 'en' ? 'Mark all read' : 'تحديد الكل كمقروء'}
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          
                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                {language === 'en' ? 'Mark read' : 'تحديد كمقروء'}
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              {language === 'en' ? 'Delete' : 'حذف'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {language === 'en' ? 'No notifications' : 'لا توجد إشعارات'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50">
              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  {language === 'en' ? 'View all notifications' : 'عرض جميع الإشعارات'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
