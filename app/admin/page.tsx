"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useAdminDashboard } from "@/app/hooks/useAdminDashboard";
import MetricsCards from "@/app/components/admin/MetricsCards";
import QuickActions from "@/app/components/admin/QuickActions";
import ActivityFeed from "@/app/components/admin/ActivityFeed";
import SystemHealth from "@/app/components/admin/SystemHealth";
import { FiClock } from "react-icons/fi";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "DELIVERY_PARTNER"];

export default function AdminPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { dashboardStats, activityLog, isLoading: dashboardLoading, hasError, refreshAll, lastUpdated } = useAdminDashboard();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Do not redirect, show admin login link instead
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      } else if (user.role === "DELIVERY_PARTNER") {
        // Delivery partners should land on Orders
        router.replace("/admin/orders");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p className="mb-6">You must be an admin, superadmin, or delivery partner to access this page.</p>
        <Link href="/admin/login" className="px-6 py-2 bg-black text-white border-2 border-black font-medium">Admin Login</Link>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiClock className="w-4 h-4" />
            <span>Last updated: {lastUpdated?.toLocaleTimeString?.() ?? "—"}</span>
          </div>
        </div>

        {hasError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-0">
            <p className="text-red-800">Error loading dashboard data. Please try refreshing.</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-normal">Welcome</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-900 mb-4">
                Welcome back, {user ? `${user.firstName} (${user.role})` : ""}!
              </p>
              <p className="text-gray-600">
                Use the navigation menu to manage orders, users, view analytics, and send emails.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-normal">Key Metrics</h2>
            </div>
            <div className="p-6">
              {dashboardStats ? (
                <MetricsCards stats={dashboardStats} isLoading={dashboardLoading} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No metrics available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions and System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuickActions onRefresh={refreshAll} isRefreshing={dashboardLoading} />
            {dashboardStats && (
              <SystemHealth stats={dashboardStats} isLoading={dashboardLoading} />
            )}
          </div>

          {/* Recent Activity */}
          <div className="border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-normal">Recent Activity</h2>
            </div>
            <div className="p-6">
              <ActivityFeed activities={activityLog} isLoading={dashboardLoading} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 