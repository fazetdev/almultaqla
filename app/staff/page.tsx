'use client';

import { User, Lock, Calendar, Clock, Smartphone } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock staff credentials
  const staffCredentials = [
    { username: 'ali', password: 'ali123', name: 'Ali', id: 1 },
    { username: 'sarah', password: 'sarah123', name: 'Sarah', id: 2 },
    { username: 'maria', password: 'maria123', name: 'Maria', id: 3 },
    { username: 'fatima', password: 'fatima123', name: 'Fatima', id: 4 },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const staff = staffCredentials.find(
        s => s.username === credentials.username && s.password === credentials.password
      );

      if (staff) {
        // Save staff info to session storage
        sessionStorage.setItem('staffUser', JSON.stringify({
          id: staff.id,
          name: staff.name,
          loggedIn: true,
        }));
        router.push('/staff/dashboard');
      } else {
        setError(language === 'en' 
          ? 'Invalid username or password' 
          : 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'en' ? 'Staff Portal' : 'بوابة الموظفين'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'en' 
              ? 'Sign in to access your schedule' 
              : 'سجل الدخول للوصول إلى جدولك'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleLogin}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {language === 'en' ? 'Username' : 'اسم المستخدم'}
                </div>
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={language === 'en' ? 'Enter your username' : 'أدخل اسم المستخدم'}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </div>
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === 'en' ? 'Signing in...' : 'جارٍ تسجيل الدخول...'}
                </div>
              ) : (
                language === 'en' ? 'Sign In' : 'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {language === 'en' ? 'Demo Credentials' : 'بيانات تجريبية'}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>Username: <code className="bg-gray-100 px-2 py-1 rounded">ali</code></span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>Password: <code className="bg-gray-100 px-2 py-1 rounded">ali123</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white rounded-xl border">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-sm mb-1">{language === 'en' ? 'View Schedule' : 'عرض الجدول'}</h4>
            <p className="text-xs text-gray-500">
              {language === 'en' 
                ? 'See your daily appointments' 
                : 'شاهد مواعيدك اليومية'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl border">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-medium text-sm mb-1">{language === 'en' ? 'Track Time' : 'تتبع الوقت'}</h4>
            <p className="text-xs text-gray-500">
              {language === 'en' 
                ? 'Monitor appointment durations' 
                : 'مراقبة مدة المواعيد'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl border">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-sm mb-1">{language === 'en' ? 'Mobile Ready' : 'جاهز للجوال'}</h4>
            <p className="text-xs text-gray-500">
              {language === 'en' 
                ? 'Access on any device' 
                : 'الوصول من أي جهاز'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {language === 'en' 
              ? 'Having trouble signing in?' 
              : 'تواجه مشكلة في تسجيل الدخول؟'}{' '}
            <a href="tel:+966112345678" className="text-blue-600 hover:underline">
              {language === 'en' ? 'Contact Support' : 'اتصل بالدعم'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
