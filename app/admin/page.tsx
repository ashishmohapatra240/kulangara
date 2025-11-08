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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-base font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full px-6">
          <Card>
            <div className="p-8 text-center space-y-6">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                You must be an admin, superadmin, or delivery partner to access this page.
              </p>
              <Link href="/admin/login">
                <Button className="w-full" size="lg">
                  Admin Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pt-4 sm:pt-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FiClock className="w-4 h-4" />
            <span className="truncate">
              Last updated: {lastUpdated?.toLocaleTimeString?.() ?? "—"}
            </span>
          </div>
        </div>

        {hasError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Error loading dashboard data. Please try refreshing.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 sm:space-y-8 pb-8">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base font-semibold">
                Welcome back, {user ? `${user.firstName} (${user.role})` : ""}!
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Use the navigation menu to manage orders, users, view analytics,
                and send emails.
              </CardDescription>
            </CardHeader>
          </Card>

          <section>
            <h2 className="text-lg font-semibold mb-4">
              Key Metrics
            </h2>
            <MetricsCards
              stats={dashboardStats}
              orderAnalytics={orderAnalytics}
              userAnalytics={userAnalytics}
              isLoading={dashboardLoading}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
