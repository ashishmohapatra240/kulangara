import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/admin.service';
import { useAdminOrderAnalytics } from './useAdminOrderAnalytics';

export const useAdminDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Memoize the date calculation to prevent infinite re-renders
  // Changed to show all-time data instead of just last 7 days
  const dashboardFilters = useMemo(() => ({
    startDate: new Date('2020-01-01').toISOString()
  }), []);

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

  // Order Analytics - Use the same hook as analytics page for consistency
  const {
    data: orderAnalytics,
    isLoading: orderAnalyticsLoading,
    error: orderAnalyticsError,
    refetch: refetchOrderAnalytics
  } = useAdminOrderAnalytics(dashboardFilters);

  const {
    data: userAnalytics,
    isLoading: userAnalyticsLoading,
    error: userAnalyticsError,
    refetch: refetchUserAnalytics
  } = useQuery({
    queryKey: ['admin-user-analytics-dashboard', dashboardFilters],
    queryFn: () => adminService.getUserAnalytics(dashboardFilters),
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