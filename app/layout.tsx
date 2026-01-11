'use client';

import '../styles/globals.css';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useLanguage } from '../context/useLanguage';
import { IndustryProvider } from '../context/useIndustry';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <body className="bg-gray-50">
        <IndustryProvider>
          <div className="flex min-h-screen">
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={closeSidebar}
              />
            )}

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className={`
              fixed md:relative
              inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'}
              w-64
              transform ${sidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}
              md:translate-x-0
              transition-transform duration-300 ease-in-out
              z-50 md:z-auto
              flex-shrink-0
              bg-white border-r
            `}>
              <Sidebar onClose={closeSidebar} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar onMenuClick={toggleSidebar} />
              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </IndustryProvider>
      </body>
    </html>
  );
}
