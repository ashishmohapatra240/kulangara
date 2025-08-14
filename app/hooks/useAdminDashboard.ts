import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/admin.service';

export const useAdminDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Dashboard Stats with 5-minute cache
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminService.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Order Analytics
  const {
    data: orderAnalytics,
    isLoading: orderAnalyticsLoading,
    error: orderAnalyticsError,
    refetch: refetchOrderAnalytics
  } = useQuery({
    queryKey: ['admin-order-analytics'],
    queryFn: () => adminService.getOrderAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // User Analytics
  const {
    data: userAnalytics,
    isLoading: userAnalyticsLoading,
    error: userAnalyticsError,
    refetch: refetchUserAnalytics
  } = useQuery({
    queryKey: ['admin-user-analytics'],
    queryFn: () => adminService.getUserAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Activity Log
  const {
    data: activityLog,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity
  } = useQuery({
    queryKey: ['admin-activity-log'],
    queryFn: () => adminService.getActivityLog({ limit: 20 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchStats(),
      refetchOrderAnalytics(),
      refetchUserAnalytics(),
      refetchActivity()
    ]);
    setLastUpdated(new Date());
  }, [refetchStats, refetchOrderAnalytics, refetchUserAnalytics, refetchActivity]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshAll]);

  return {
    // Data
    dashboardStats,
    orderAnalytics,
    userAnalytics,
    activityLog: activityLog?.data || [],

    // Loading states
    isLoading: statsLoading || orderAnalyticsLoading || userAnalyticsLoading || activityLoading,
    statsLoading,
    orderAnalyticsLoading,
    userAnalyticsLoading,
    activityLoading,

    // Error states
    hasError: statsError || orderAnalyticsError || userAnalyticsError || activityError,
    statsError,
    orderAnalyticsError,
    userAnalyticsError,
    activityError,

    // Actions
    refreshAll,
    refetchStats,
    refetchOrderAnalytics,
    refetchUserAnalytics,
    refetchActivity,
    lastUpdated,
  };
};