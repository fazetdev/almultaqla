'use client';

import { Search, UserPlus, Phone, Mail, Calendar, Star, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { customers } from '../../lib/mockData';
import { useState } from 'react';

export default function CustomersPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' AED';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Customers' : 'العملاء'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? `Manage ${customers.length} customers` 
              : `إدارة ${customers.length} عميل`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search customers...' : 'بحث عن العملاء...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Add Customer Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>{language === 'en' ? 'Add Customer' : 'إضافة عميل'}</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Customer' : 'العميل'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Contact' : 'الاتصال'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Total Spent' : 'إجمالي الإنفاق'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Visits' : 'الزيارات'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Last Visit' : 'آخر زيارة'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Status' : 'الحالة'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-blue-600">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.preferredStaff}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{customer.visitCount}</div>
                      <div className="text-sm text-gray-500">
                        {language === 'en' ? 'visits' : 'زيارة'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3" />
                      {formatDate(customer.lastVisit)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      customer.visitCount >= 10 ? 'bg-green-100 text-green-800' :
                      customer.visitCount >= 5 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.visitCount >= 10 
                        ? (language === 'en' ? 'VIP' : 'مميز')
                        : customer.visitCount >= 5 
                        ? (language === 'en' ? 'Regular' : 'منتظم')
                        : (language === 'en' ? 'New' : 'جديد')
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {language === 'en' 
                ? `Showing ${filteredCustomers.length} of ${customers.length} customers`
                : `عرض ${filteredCustomers.length} من ${customers.length} عميل`}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-700">
                {language === 'en' ? 'Total Revenue:' : 'إجمالي الإيرادات:'} 
                <span className="font-medium ml-2">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'VIP Customers' : 'عملاء مميزون'}</div>
              <div className="text-2xl font-bold mt-1">
                {customers.filter(c => c.visitCount >= 10).length}
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Average Visits' : 'متوسط الزيارات'}</div>
              <div className="text-2xl font-bold mt-1">
                {(customers.reduce((sum, c) => sum + c.visitCount, 0) / customers.length).toFixed(1)}
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Avg. Spend' : 'متوسط الإنفاق'}</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)}
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
