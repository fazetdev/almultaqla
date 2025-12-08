'use client';

import { Search, User, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import NotificationsDropdown from './NotificationsDropdown';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger menu & Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-200"
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search...' : 'بحث...'}
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-40"
            />
          </div>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium hidden md:inline">
              {language === 'en' ? 'Admin' : 'مدير'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
