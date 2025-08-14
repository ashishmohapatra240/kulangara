"use client";

import { IDashboardStats } from '@/app/types/admin.type';
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi';

interface MetricsCardsProps {
  stats: IDashboardStats;
  isLoading?: boolean;
}

const MetricsCards = ({ stats, isLoading }: MetricsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-0 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-0"></div>
              <div className="w-16 h-8 bg-gray-200 rounded-0"></div>
            </div>
            <div className="mt-4">
              <div className="w-20 h-6 bg-gray-200 rounded-0 mb-2"></div>
              <div className="w-32 h-4 bg-gray-200 rounded-0"></div>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Users Card */}
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-100 rounded-0">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Users</span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.users?.total ?? 0)}
          </h3>
          <p className="text-sm text-gray-600">
            {stats.users?.newToday ?? 0} new today
          </p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-green-100 rounded-0">
            <FiShoppingCart className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Orders</span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.orders?.total ?? 0)}
          </h3>
          <p className="text-sm text-gray-600">
            {stats.orders?.pending ?? 0} pending
          </p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-purple-100 rounded-0">
            <FiDollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Revenue</span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.revenue?.total ?? 0)}
          </h3>
          <p className="text-sm text-gray-600">
            {formatCurrency(stats.revenue?.today ?? 0)} today
          </p>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white border border-gray-200 rounded-0 p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-orange-100 rounded-0">
            <FiPackage className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Products</span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.products?.total ?? 0)}
          </h3>
          <p className="text-sm text-gray-600">
            {stats.products?.lowStock ?? 0} low stock
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards; 