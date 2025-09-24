"use client";

import { IDashboardStats, IOrderAnalytics, IUserAnalytics } from '@/app/types/admin.type';
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi';

interface MetricsCardsProps {
  stats?: IDashboardStats;
  orderAnalytics?: IOrderAnalytics;
  userAnalytics?: IUserAnalytics;
  isLoading?: boolean;
}

const MetricsCards = ({ stats, orderAnalytics, userAnalytics, isLoading }: MetricsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border-2 border-black p-8 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gray-300"></div>
              <div className="w-20 h-4 bg-gray-300"></div>
            </div>
            <div>
              <div className="w-24 h-10 bg-gray-300 mb-2"></div>
              <div className="w-32 h-4 bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Use analytics data when available, fall back to stats
  const totalUsers = userAnalytics?.totalUsers ?? stats?.users?.total ?? 0;
  const totalOrders = orderAnalytics?.orders?.total ?? stats?.orders?.total ?? 0;
  const totalRevenue = orderAnalytics?.revenue?.total ?? stats?.revenue?.total ?? 0;
  const avgOrderValue = orderAnalytics?.aov?.current ?? stats?.revenue?.aov ?? 0;
  const pendingOrders = stats?.orders?.pending ?? 0;
  const lowStockProducts = stats?.products?.lowStock ?? 0;
  const totalProducts = stats?.products?.total ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Users Card */}
      <div className="bg-white border-2 border-black p-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-black">USERS</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-black mb-2">
              {formatNumber(totalUsers)}
            </h3>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {stats?.users?.newToday ?? 0} NEW TODAY
            </p>
          </div>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white border-2 border-black p-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black">
              <FiShoppingCart className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-black">ORDERS</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-black mb-2">
              {formatNumber(totalOrders)}
            </h3>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {pendingOrders} PENDING
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white border-2 border-black p-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-black">REVENUE</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-black mb-2">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {formatCurrency(avgOrderValue)} AOV
            </p>
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white border-2 border-black p-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black">
              <FiPackage className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-black">PRODUCTS</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-black mb-2">
              {formatNumber(totalProducts)}
            </h3>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {lowStockProducts} LOW STOCK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards; 