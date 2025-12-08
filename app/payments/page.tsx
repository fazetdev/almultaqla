'use client';

import { DollarSign, Filter, Download, CreditCard, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { payments } from '../../lib/mockData';
import { useState } from 'react';

export default function PaymentsPage() {
  const { language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    return statusMatch;
  });

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid': return language === 'en' ? 'Paid' : 'مدفوع';
      case 'pending': return language === 'en' ? 'Pending' : 'قيد الانتظار';
      case 'overdue': return language === 'en' ? 'Overdue' : 'متأخر';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Payment Management' : 'إدارة المدفوعات'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? `Track ${payments.length} payments` 
              : `تتبع ${payments.length} مدفوعات`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>{language === 'en' ? 'Export' : 'تصدير'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Total Paid' : 'إجمالي المدفوع'}</div>
              <div className="text-2xl font-bold mt-1 text-green-600">
                {totalPaid.toLocaleString()} AED
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {payments.filter(p => p.status === 'paid').length} {language === 'en' ? 'transactions' : 'معاملة'}
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Pending Payments' : 'مدفوعات قيد الانتظار'}</div>
              <div className="text-2xl font-bold mt-1 text-yellow-600">
                {totalPending.toLocaleString()} AED
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {payments.filter(p => p.status === 'pending').length} {language === 'en' ? 'pending' : 'قيد الانتظار'}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{language === 'en' ? 'Overdue Payments' : 'مدفوعات متأخرة'}</div>
              <div className="text-2xl font-bold mt-1 text-red-600">
                {totalOverdue.toLocaleString()} AED
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {payments.filter(p => p.status === 'overdue').length} {language === 'en' ? 'overdue' : 'متأخرة'}
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{language === 'en' ? 'Status:' : 'الحالة:'}</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'en' ? 'All Status' : 'كل الحالات'}</option>
              <option value="paid">{language === 'en' ? 'Paid' : 'مدفوع'}</option>
              <option value="pending">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</option>
              <option value="overdue">{language === 'en' ? 'Overdue' : 'متأخر'}</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{language === 'en' ? 'Date Range:' : 'النطاق الزمني:'}</span>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'en' ? 'All Time' : 'كل الوقت'}</option>
              <option value="week">{language === 'en' ? 'This Week' : 'هذا الأسبوع'}</option>
              <option value="month">{language === 'en' ? 'This Month' : 'هذا الشهر'}</option>
            </select>
          </div>
          
          <div className="md:ml-auto text-sm text-gray-600">
            {language === 'en' ? 'Total:' : 'الإجمالي:'} 
            <span className="font-medium ml-2">
              {filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} AED
            </span>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Customer' : 'العميل'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Date' : 'التاريخ'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Service' : 'الخدمة'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Amount' : 'المبلغ'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Status' : 'الحالة'}
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  {language === 'en' ? 'Actions' : 'الإجراءات'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{payment.customerName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{formatDate(payment.date)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{payment.service}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{payment.amount.toLocaleString()} AED</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {payment.method === 'Card' ? (
                        <CreditCard className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Wallet className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        {language === 'en' ? 'View' : 'عرض'}
                      </button>
                      {payment.status !== 'paid' && (
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          {language === 'en' ? 'Mark Paid' : 'تحديد كمدفوع'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {language === 'en' 
                ? `Showing ${filteredPayments.length} of ${payments.length} payments`
                : `عرض ${filteredPayments.length} من ${payments.length} مدفوعات`}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-600">{language === 'en' ? 'Collected:' : 'المحصل:'}</span>
                <span className="font-medium ml-2 text-green-600">
                  {totalPaid.toLocaleString()} AED
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">{language === 'en' ? 'Due:' : 'المستحق:'}</span>
                <span className="font-medium ml-2 text-red-600">
                  {(totalPending + totalOverdue).toLocaleString()} AED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">
            {language === 'en' ? 'Payment Methods' : 'طرق الدفع'}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Cash</span>
                <span className="font-medium">
                  {payments.filter(p => p.method === 'Cash').length} {language === 'en' ? 'payments' : 'دفعة'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(payments.filter(p => p.method === 'Cash').length / payments.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Card</span>
                <span className="font-medium">
                  {payments.filter(p => p.method === 'Card').length} {language === 'en' ? 'payments' : 'دفعة'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(payments.filter(p => p.method === 'Card').length / payments.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">
            {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex flex-col items-center justify-center">
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-sm">{language === 'en' ? 'Add Payment' : 'إضافة دفعة'}</span>
            </button>
            <button className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex flex-col items-center justify-center">
              <Download className="w-5 h-5 mb-1" />
              <span className="text-sm">{language === 'en' ? 'Export Report' : 'تصدير تقرير'}</span>
            </button>
            <button className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex flex-col items-center justify-center">
              <AlertCircle className="w-5 h-5 mb-1" />
              <span className="text-sm">{language === 'en' ? 'Send Reminders' : 'إرسال تذكيرات'}</span>
            </button>
            <button className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 flex flex-col items-center justify-center">
              <DollarSign className="w-5 h-5 mb-1" />
              <span className="text-sm">{language === 'en' ? 'View Invoices' : 'عرض الفواتير'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
