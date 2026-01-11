'use client';

import { DollarSign, Filter, Download, CreditCard, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { useState, useEffect } from 'react';
import { useTerminology } from '../../context/useIndustry';

export default function PaymentsPage() {
  const { language } = useLanguage();
  const terminology = useTerminology();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        // const data = await dataService.getPayments();
        // setPayments(data);
        
        // For now, empty state
        setPayments([]);
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    return statusMatch;
  });

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

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
            {language === 'en' ? 'Loading payments...' : 'جاري تحميل المدفوعات...'}
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
            {language === 'en' ? terminology.payment + 's' : terminology.payment + 'ات'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en'
              ? `Manage ${terminology.payment.toLowerCase()}s and track revenue`
              : `إدارة ${terminology.payment}ات وتتبع الإيرادات`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {language === 'en' ? 'Export' : 'تصدير'}
          </button>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'en' ? 'All Status' : 'كل الحالات'}</option>
              <option value="paid">{language === 'en' ? 'Paid' : 'مدفوع'}</option>
              <option value="pending">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</option>
              <option value="overdue">{language === 'en' ? 'Overdue' : 'متأخر'}</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Total Paid' : 'إجمالي المدفوع'}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {payments.filter(p => p.status === 'paid').length} {language === 'en' ? 'transactions' : 'معاملة'}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {payments.filter(p => p.status === 'pending').length} {language === 'en' ? 'awaiting payment' : 'في انتظار الدفع'}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</div>
              <div className="text-sm text-gray-600">{language === 'en' ? 'Overdue' : 'متأخر'}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {payments.filter(p => p.status === 'overdue').length} {language === 'en' ? 'overdue payments' : 'دفعات متأخرة'}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">
            {language === 'en' ? `All ${terminology.payment}s` : `جميع ${terminology.payment}ات`}
          </h3>
          <div className="text-sm text-gray-600">
            {filteredPayments.length} {language === 'en' ? 'payments' : 'دفعة'}
          </div>
        </div>

        {filteredPayments.length > 0 ? (
          <div className="divide-y">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {language === 'en' ? `${terminology.payment} #${payment.id}` : `${terminology.payment} رقم ${payment.id}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {payment.customerName || 'Customer'} • {formatDate(payment.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.method || 'Payment method'}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)} flex items-center gap-2`}>
                      {getStatusIcon(payment.status)}
                      {getStatusText(payment.status)}
                    </div>
                    
                    <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                      {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {language === 'en' ? `No ${terminology.payment}s Found` : `لم يتم العثور على ${terminology.payment}ات`}
            </h3>
            <p className="text-gray-600">
              {language === 'en'
                ? statusFilter !== 'all'
                  ? `No ${terminology.payment.toLowerCase()}s with status "${statusFilter}"`
                  : `No ${terminology.payment.toLowerCase()}s recorded yet`
                : statusFilter !== 'all'
                  ? `لا توجد ${terminology.payment}ات بحالة "${getStatusText(statusFilter)}"`
                  : `لم يتم تسجيل أي ${terminology.payment}ات بعد`}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h4 className="font-medium mb-4">{language === 'en' ? 'Payment Methods' : 'طرق الدفع'}</h4>
          <div className="space-y-3">
            {['Credit Card', 'Cash', 'Bank Transfer'].map((method) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-gray-700">{method}</span>
                <span className="font-medium">
                  {formatCurrency(
                    payments
                      .filter(p => p.method === method.toLowerCase())
                      .reduce((sum: number, p: any) => sum + p.amount, 0)
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h4 className="font-medium mb-4">{language === 'en' ? 'Revenue Summary' : 'ملخص الإيرادات'}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(totalPaid + totalPending + totalOverdue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{language === 'en' ? 'Collected' : 'المتحصل'}</span>
              <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{language === 'en' ? 'Outstanding' : 'المستحق'}</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(totalPending + totalOverdue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
