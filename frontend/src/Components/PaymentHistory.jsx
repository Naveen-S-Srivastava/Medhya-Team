import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  User, 
  Clock, 
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { usePayments } from '../hooks/usePayments.js';
import { useAuth } from '../hooks/useAuth.js';

const PaymentHistory = () => {
  const { user } = useAuth();
  const { 
    payments, 
    loading, 
    error, 
    summary, 
    pagination, 
    getCounselorPayments, 
    getEarningsSummary 
  } = usePayments();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    if (user?._id) {
      loadPayments();
      loadEarningsSummary();
    }
  }, [user, currentPage, filters]);

  const loadPayments = async () => {
    try {
      await getCounselorPayments(user._id, {
        page: currentPage,
        limit: 10,
        ...filters
      });
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const loadEarningsSummary = async () => {
    try {
      const data = await getEarningsSummary(user._id, 'month');
      setEarningsData(data);
    } catch (err) {
      console.error('Failed to load earnings summary:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getSessionTypeBadge = (type) => {
    const typeConfig = {
      online: { color: 'bg-blue-100 text-blue-800', label: 'Online' },
      oncampus: { color: 'bg-purple-100 text-purple-800', label: 'On Campus' }
    };

    const config = typeConfig[type] || typeConfig.online;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading && !payments.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {summary ? formatCurrency(summary.totalEarnings) : '₹0'}
            </div>
            <p className="text-xs text-green-600">
              {summary?.totalSessions || 0} sessions completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Average Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {summary ? formatCurrency(summary.averageEarnings) : '₹0'}
            </div>
            <p className="text-xs text-blue-600">Per session</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {earningsData ? formatCurrency(earningsData.summary.totalEarnings) : '₹0'}
            </div>
            <p className="text-xs text-purple-600">
              {earningsData?.summary.totalSessions || 0} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {summary ? formatCurrency(summary.pendingPayments * (summary.averageEarnings || 0)) : '₹0'}
            </div>
            <p className="text-xs text-orange-600">
              {summary?.pendingPayments || 0} payments pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            View your earnings and payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">To:</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
              />
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Payment List */}
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-semibold">
                        {payment.student?.firstName} {payment.student?.lastName}
                      </h4>
                      {getStatusBadge(payment.paymentStatus)}
                      {getSessionTypeBadge(payment.sessionType)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Session:</span> {formatDate(payment.appointment?.date)}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {payment.sessionDuration} min
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span> ₹{payment.ratePerHour}/hr
                      </div>
                      <div>
                        <span className="font-medium">Method:</span> {payment.paymentMethod}
                      </div>
                    </div>

                    {payment.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Notes:</span> {payment.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(payment.counselorEarnings)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Fee: {formatCurrency(payment.platformFee)}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 gap-1">
                      <Eye className="w-3 h-3" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {payments.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No payments found for the selected filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} payments
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
