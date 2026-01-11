'use client';

import { Search, UserPlus, Phone, Mail, Calendar, Star, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState, useEffect } from 'react';
import { useTerminology } from '../../context/useIndustry';

export default function CustomersPage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This will be replaced with real API call
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        // const data = await dataService.getCustomers();
        // setCustomers(data);
        
        // For now, empty state
        setCustomers([]);
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' AED';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'en' ? 'Loading customers...' : 'جاري تحميل العملاء...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? terminology.customer + 's' : terminology.customer + 'ات'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en'
              ? `Manage ${customers.length} ${terminology.customer.toLowerCase()}s`
              : `إدارة ${customers.length} ${terminology.customer}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? `Search ${terminology.customer.toLowerCase()}s...` : `بحث عن ${terminology.customer}ات...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {language === 'en' ? `Add ${terminology.customer}` : `إضافة ${terminology.customer}`}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{customers.length}</div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Total' : 'إجمالي'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {customers.filter(c => (c.totalSpent || 0) > 1000).length}
              </div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'VIP Customers' : 'عملاء مميزون'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {customers.filter(c => {
                  if (!c.lastVisit) return false;
                  const lastVisit = new Date(c.lastVisit);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return lastVisit > weekAgo;
                }).length}
              </div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Active This Week' : 'نشطون هذا الأسبوع'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">
            {language === 'en' ? `All ${terminology.customer}s` : `جميع ${terminology.customer}ات`}
          </h3>
        </div>

        {filteredCustomers.length > 0 ? (
          <div className="divide-y">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-700">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.lastVisit && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(customer.lastVisit)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {formatCurrency(customer.totalSpent || 0)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? 'Total Spent' : 'إجمالي الإنفاق'}
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                      {language === 'en' ? 'View Profile' : 'عرض الملف'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {language === 'en' 
                ? searchTerm ? `No ${terminology.customer.toLowerCase()}s found` : `No ${terminology.customer.toLowerCase()}s yet`
                : searchTerm ? `لم يتم العثور على ${terminology.customer}ات` : `لا توجد ${terminology.customer}ات بعد`}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? searchTerm 
                  ? `Try a different search term` 
                  : `Add your first ${terminology.customer.toLowerCase()} to get started`
                : searchTerm
                  ? `جرب مصطلح بحث مختلف`
                  : `أضف أول ${terminology.customer} للبدء`}
            </p>
            {!searchTerm && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                <UserPlus className="w-4 h-4" />
                {language === 'en' ? `Add First ${terminology.customer}` : `إضافة أول ${terminology.customer}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800">
              {language === 'en' ? `${terminology.customer} Management` : `إدارة ${terminology.customer}ات`}
            </h4>
            <p className="text-blue-700 text-sm mt-1">
              {language === 'en'
                ? `Manage ${terminology.customer.toLowerCase()} profiles, view booking history, and track spending patterns.`
                : `إدارة ملفات ${terminology.customer}ات، وعرض سجل الحجوزات، وتتبع أنماط الإنفاق.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
