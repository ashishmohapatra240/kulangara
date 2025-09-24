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
  const {
    dashboardStats,
    orderAnalytics,
    userAnalytics,
    activityLog,
    isLoading: dashboardLoading,
    hasError,
    refreshAll,
    lastUpdated,
  } = useAdminDashboard();

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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold tracking-tight">LOADING...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">ADMIN PANEL</h1>
        <p className="mb-8 text-gray-600 font-medium tracking-wide text-center max-w-md">
          YOU MUST BE AN ADMIN, SUPERADMIN, OR DELIVERY PARTNER TO ACCESS THIS
          PAGE.
        </p>
        <Link
          href="/admin/login"
          className="px-8 py-4 bg-black text-white border-2 border-black font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          ADMIN LOGIN
        </Link>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
          <h1 className="text-4xl font-bold tracking-tight">DASHBOARD</h1>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <FiClock className="w-5 h-5" />
            <span className="font-medium tracking-wide">
              LAST UPDATED: {lastUpdated?.toLocaleTimeString?.() ?? "—"}
            </span>
          </div>
        </div>

        {hasError && (
          <div className="mb-8 p-6 border-2 border-black bg-white">
            <p className="text-black font-bold tracking-wide">
              ERROR LOADING DASHBOARD DATA. PLEASE TRY REFRESHING.
            </p>
          </div>
        )}

        <div className="space-y-12">
          <section className="border-2 border-black bg-white">
            <div className="p-8">
              <p className="text-xl font-bold text-black mb-6 tracking-wide">
                WELCOME BACK,{" "}
                {user ? `${user.firstName.toUpperCase()} (${user.role})` : ""}!
              </p>
              <p className="text-gray-600 font-medium tracking-wide leading-relaxed">
                Use the navigation menu to manage orders, users, view analytics,
                and send emails.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight border-b-2 border-black pb-4">
                KEY METRICS
              </h2>
            </div>
            <MetricsCards
              stats={dashboardStats}
              orderAnalytics={orderAnalytics}
              userAnalytics={userAnalytics}
              isLoading={dashboardLoading}
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <QuickActions
              onRefresh={refreshAll}
              isRefreshing={dashboardLoading}
            />
            {dashboardStats && (
              <SystemHealth
                stats={dashboardStats}
                isLoading={dashboardLoading}
              />
            )}
          </section>

          <section>
            <ActivityFeed
              activities={activityLog}
              isLoading={dashboardLoading}
            />
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
