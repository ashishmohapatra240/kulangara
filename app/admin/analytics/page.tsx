"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import adminService from "@/app/services/admin.service";
import { useAdminOrderAnalytics } from "@/app/hooks/useAdminOrderAnalytics";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
} from "react-icons/fi";
import Image from "next/image";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function AnalyticsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState("7d");

  // Move getStartDate above its usage
  const getStartDate = (range: string) => {
    const now = new Date();
    switch (range) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  // Memoize filters to prevent infinite requests
  const filters = useMemo(() => ({ startDate: getStartDate(dateRange) }), [dateRange]);

  // Fetch analytics data
  const { data: orderAnalytics, error: orderError } = useAdminOrderAnalytics(filters);

  const { data: userAnalytics, error: userError } = useQuery({
    queryKey: ["admin-user-analytics", dateRange],
    queryFn: () =>
      adminService.getUserAnalytics({ startDate: getStartDate(dateRange) }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/admin/login");
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== "number" || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number | undefined | null) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const getGrowthIcon = (growth: number | undefined) => {
    if (growth === undefined || growth === null) return null;
    return growth >= 0 ? (
      <FiTrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <FiTrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number | undefined) => {
    if (growth === undefined || growth === null) return "text-gray-600";
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const formatGrowth = (growth: number | undefined) => {
    if (growth === undefined || growth === null) return "N/A";
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">Analytics</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {(orderError || userError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-0">
            <p className="text-red-800">
              Error loading analytics data. Please try refreshing.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Overview Cards */}
          {orderAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-100 rounded-0">
                    <FiDollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(orderAnalytics.revenue?.growth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        orderAnalytics.revenue?.growth
                      )}`}
                    >
                      {formatGrowth(orderAnalytics.revenue?.growth)}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(orderAnalytics.revenue?.total)}
                  </h3>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-green-100 rounded-0">
                    <FiShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(orderAnalytics.orders?.growth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        orderAnalytics.orders?.growth
                      )}`}
                    >
                      {formatGrowth(orderAnalytics.orders?.growth)}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatNumber(orderAnalytics.orders?.total)}
                  </h3>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-100 rounded-0">
                    <FiDollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(orderAnalytics.aov?.growth)}
                    <span
                      className={`text-sm font-medium ${getGrowthColor(
                        orderAnalytics.aov?.growth
                      )}`}
                    >
                      {formatGrowth(orderAnalytics.aov?.growth)}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(orderAnalytics.aov?.current)}
                  </h3>
                  <p className="text-sm text-gray-600">Average Order Value</p>
                </div>
              </div>

              {userAnalytics && (
                <div className="bg-white border border-gray-200 rounded-0 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-orange-100 rounded-0">
                      <FiUsers className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getGrowthIcon(userAnalytics.userGrowth)}
                      <span
                        className={`text-sm font-medium ${getGrowthColor(
                          userAnalytics.userGrowth
                        )}`}
                      >
                        {formatGrowth(userAnalytics.userGrowth)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatNumber(userAnalytics.totalUsers || 0)}
                    </h3>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Status Distribution */}
          {orderAnalytics && orderAnalytics.statusDistribution && (
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-xl font-normal mb-6">
                Order Status Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(orderAnalytics.statusDistribution).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-4 border border-gray-200 rounded-0"
                    >
                      <h3 className="text-lg font-medium capitalize">
                        {status}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(count || 0)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Payment Method Distribution */}
          {orderAnalytics &&
            orderAnalytics.paymentAnalytics?.methodDistribution && (
              <div className="bg-white border border-gray-200 rounded-0 p-6">
                <h2 className="text-xl font-normal mb-6">
                  Payment Method Distribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(
                    orderAnalytics.paymentAnalytics.methodDistribution
                  ).map(([method, count]) => (
                    <div
                      key={method}
                      className="text-center p-4 border border-gray-200 rounded-0"
                    >
                      <h3 className="text-lg font-medium capitalize">
                        {method}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(count || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Top Products */}
          {orderAnalytics && orderAnalytics.topProducts && orderAnalytics.topProducts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-xl font-normal mb-6">
                Top Performing Products
              </h2>
              <div className="space-y-4">
                {orderAnalytics.topProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-0"
                  >
                    <Image
                      src={product.image || "/images/placeholder.jpg"}
                      alt={product.name || "Product"}
                      height={48}
                      width={48}
                      className="w-12 h-12 object-cover rounded-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {product.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatNumber(product.orders || 0)} orders •{" "}
                        {formatCurrency(product.revenue || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Analytics */}
          {orderAnalytics && orderAnalytics.locationAnalytics?.topCities && orderAnalytics.locationAnalytics.topCities.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-xl font-normal mb-6">Top Cities</h2>
              <div className="space-y-4">
                {orderAnalytics.locationAnalytics.topCities
                  .slice(0, 5)
                  .map((city, index) => (
                    <div
                      key={city.city}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-0"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {city.city || "Unknown City"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatNumber(city.orders || 0)} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(city.revenue || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
