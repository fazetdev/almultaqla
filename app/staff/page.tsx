'use client';

import { User, Lock, Calendar, Clock, Smartphone } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTerminology } from '../../context/useIndustry';

export default function StaffLoginPage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with real API authentication
      // const response = await fetch('/api/auth/staff/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // 
      // if (response.ok) {
      //   const data = await response.json();
      //   // Token/User data would be handled by auth context
      //   router.push('/staff/dashboard');
      // } else {
      //   setError(language === 'en'
      //     ? 'Invalid username or password'
      //     : 'اسم المستخدم أو كلمة المرور غير صحيحة');
      // }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, allow any non-empty credentials
      if (credentials.username && credentials.password) {
        router.push('/staff/dashboard');
      } else {
        setError(language === 'en'
          ? 'Please enter username and password'
          : 'يرجى إدخال اسم المستخدم وكلمة المرور');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(language === 'en'
        ? 'Network error. Please try again.'
        : 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'en' ? `${terminology.staff} Portal` : `بوابة ${terminology.staff}`}
            </h1>
            <p className="opacity-90">
              {language === 'en'
                ? `Access your ${terminology.staff.toLowerCase()} dashboard and schedule`
                : `الوصول إلى لوحة تحكم ${terminology.staff} وجدولك`}
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Username' : 'اسم المستخدم'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'en' ? 'Enter username' : 'أدخل اسم المستخدم'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...'}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {language === 'en'
                    ? 'Need help signing in? Contact your manager.'
                    : 'تحتاج مساعدة في تسجيل الدخول؟ اتصل بمديرك.'}
                </p>
                <a
                  href="/"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm"
                >
                  &larr; {language === 'en' ? 'Back to main dashboard' : 'العودة إلى اللوحة الرئيسية'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm font-medium">
              {language === 'en' ? 'Schedule Access' : 'الوصول إلى الجدول'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm font-medium">
              {language === 'en' ? 'Time Tracking' : 'تتبع الوقت'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm font-medium">
              {language === 'en' ? 'Mobile Friendly' : 'متوافق مع الجوال'}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {language === 'en'
              ? `Secure ${terminology.staff.toLowerCase()} portal powered by SmartOps Gulf Dashboard`
              : `بوابة ${terminology.staff} آمنة مدعومة بـ SmartOps لوحة تحكم الخليج`}
          </p>
        </div>
      </div>
    </div>
  );
}
