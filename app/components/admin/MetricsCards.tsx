"use client";

import { IDashboardStats, IOrderAnalytics, IUserAnalytics } from '@/app/types/admin.type';
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

interface MetricsCardsProps {
  stats?: IDashboardStats;
  orderAnalytics?: IOrderAnalytics;
  userAnalytics?: IUserAnalytics;
  isLoading?: boolean;
}

const MetricsCards = ({ stats, orderAnalytics, userAnalytics, isLoading }: MetricsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
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

  const newUsersToday = stats?.users?.newToday ?? 0;

  const metrics = [
    {
      title: 'USERS',
      icon: FiUsers,
      value: formatNumber(totalUsers),
      subtitle: `${newUsersToday} new today`,
      badge: newUsersToday > 0 ? `+${newUsersToday}` : null,
    },
    {
      title: 'ORDERS',
      icon: FiShoppingCart,
      value: formatNumber(totalOrders),
      subtitle: `${pendingOrders} pending`,
      badge: pendingOrders > 0 ? `${pendingOrders}` : null,
    },
    {
      title: 'REVENUE',
      icon: FiDollarSign,
      value: formatCurrency(totalRevenue),
      subtitle: `${formatCurrency(avgOrderValue)} AOV`,
      badge: null,
    },
    {
      title: 'PRODUCTS',
      icon: FiPackage,
      value: formatNumber(totalProducts),
      subtitle: `${lowStockProducts} low stock`,
      badge: lowStockProducts > 0 ? `${lowStockProducts}` : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary rounded-md">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {metric.title}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">
                    {metric.value}
                  </h3>
                  {metric.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {metric.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metric.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;
