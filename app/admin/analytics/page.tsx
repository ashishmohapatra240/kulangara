"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import AdminLayout from "@/app/components/layout/AdminLayout";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function AnalyticsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState("7d");

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

  const filters = useMemo(() => {
    const startDate = getStartDate(dateRange);
    return { startDate };
  }, [dateRange]);

  const { data: orderAnalytics, error: orderError } =
    useAdminOrderAnalytics(filters);

  const { data: userAnalytics, error: userError } = useQuery({
    queryKey: ["admin-user-analytics", filters],
    queryFn: () => adminService.getUserAnalytics(filters),
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

  const formatGrowth = (growth: number | undefined) => {
    if (growth === undefined || growth === null) return "N/A";
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold tracking-tight">LOADING...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pt-30 mb-12 pb-6 border-b-2 border-black">
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">ANALYTICS DASHBOARD</h1>
              <p className="text-gray-600 mt-3 font-medium tracking-wide">MONITOR YOUR BUSINESS PERFORMANCE AND KEY METRICS</p>
            </div>
            <div className="flex-shrink-0">
              <select
                value={dateRange}

                onChange={(e) => setDateRange(e.target.value)}
                className="px-6 py-3 border-2 border-black bg-white text-black font-bold focus:outline-none min-w-[160px] tracking-wide"
              >
                <option value="7d">LAST 7 DAYS</option>
                <option value="30d">LAST 30 DAYS</option>
                <option value="90d">LAST 90 DAYS</option>
              </select>
            </div>
          </div>

          {(orderError || userError) && (
            <div className="mb-8 p-6 border-2 border-black bg-white">
              <p className="text-black font-bold tracking-wide">
                ERROR LOADING ANALYTICS DATA. PLEASE TRY REFRESHING THE PAGE.
              </p>
            </div>
          )}

          <div className="space-y-12">
            {/* Overview Cards */}
            {orderAnalytics && (
              <section>
                <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-black pb-4 tracking-tight">KEY METRICS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border-2 border-black p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-black">
                        <FiDollarSign className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-black tracking-widest">
                          {formatGrowth(orderAnalytics.revenue?.growth)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-black mb-2">
                        {formatCurrency(orderAnalytics.revenue?.total)}
                      </h3>
                      <p className="text-gray-600 font-medium tracking-widest">TOTAL REVENUE</p>
                    </div>
              </div>

                  <div className="bg-white border-2 border-black p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-black">
                        <FiShoppingCart className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-black tracking-widest">
                          {formatGrowth(orderAnalytics.orders?.growth)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-black mb-2">
                        {formatNumber(orderAnalytics.orders?.total)}
                      </h3>
                      <p className="text-gray-600 font-medium tracking-widest">TOTAL ORDERS</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-black p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-black">
                        <FiDollarSign className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-black tracking-widest">
                          {formatGrowth(orderAnalytics.aov?.growth)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-black mb-2">
                        {formatCurrency(orderAnalytics.aov?.current)}
                      </h3>
                      <p className="text-gray-600 font-medium tracking-widest">AVERAGE ORDER VALUE</p>
                    </div>
                  </div>

                  {userAnalytics && (
                    <div className="bg-white border-2 border-black p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 bg-black">
                          <FiUsers className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-black tracking-widest">
                            {formatGrowth(userAnalytics.userGrowth)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-black mb-2">
                          {formatNumber(userAnalytics.totalUsers || 0)}
                        </h3>
                        <p className="text-gray-600 font-medium tracking-widest">TOTAL USERS</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Order Status Distribution */}
            {orderAnalytics && orderAnalytics.statusDistribution && (
              <section>
                <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Order Status Distribution
                </h2>
                <div className="bg-white border border-gray-200 p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {Object.entries(orderAnalytics.statusDistribution).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="text-center p-6 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <h3 className="text-base font-semibold capitalize text-gray-700 mb-3">
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
              </section>
            )}

            {/* Payment Method Distribution */}
            {orderAnalytics &&
              orderAnalytics.paymentAnalytics?.methodDistribution && (
                <section>
                  <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-black pb-4 tracking-tight">
                    PAYMENT METHOD DISTRIBUTION
                  </h2>
                  <div className="bg-white border-2 border-black p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Object.entries(
                        orderAnalytics.paymentAnalytics.methodDistribution
                      ).map(([method, count]) => {
                        const displayName = method === 'razorpay' ? 'RAZORPAY' : method === 'cod' ? 'COD' : method.toUpperCase();
                        return (
                          <div
                            key={method}
                            className="text-center p-8 border-2 border-black"
                          >
                            <h3 className="text-lg font-bold text-black mb-4 tracking-widest">
                              {displayName}
                            </h3>
                            <p className="text-3xl font-bold text-black">
                              {formatNumber(count || 0)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

            {/* Top Products */}
            {orderAnalytics &&
              orderAnalytics.topProducts &&
              orderAnalytics.topProducts.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-black pb-4 tracking-tight">
                    TOP PERFORMING PRODUCTS
                  </h2>
                  <div className="bg-white border-2 border-black p-8">
                    <div className="space-y-6">
                      {orderAnalytics.topProducts
                        .slice(0, 5)
                        .map((product, index) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-6 p-6 border-2 border-black"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-black text-xl mb-3 tracking-wide">
                                {product.name || "UNKNOWN PRODUCT"}
                              </h3>
                              <div className="flex items-center gap-8">
                                <span className="text-gray-600 font-medium tracking-widest">
                                  {formatNumber(product.orders || 0)} ORDERS
                                </span>
                                <span className="text-black font-bold">
                                  {formatCurrency(product.revenue || 0)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <FiTrendingUp className="w-8 h-8 text-black" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>
              )}

            {/* Location Analytics */}
            {orderAnalytics &&
              orderAnalytics.locationAnalytics?.topCities &&
              orderAnalytics.locationAnalytics.topCities.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-black pb-4 tracking-tight">TOP CITIES</h2>
                  <div className="bg-white border-2 border-black p-8">
                    <div className="space-y-6">
                      {orderAnalytics.locationAnalytics.topCities
                        .slice(0, 5)
                        .map((city, index) => (
                          <div
                            key={city.city}
                            className="flex items-center justify-between p-6 border-2 border-black"
                          >
                            <div className="flex items-center gap-6">
                              <span className="text-2xl font-bold text-black w-10">
                                #{index + 1}
                              </span>
                              <div>
                                <h3 className="font-bold text-black text-xl mb-2 tracking-wide">
                                  {city.city || "UNKNOWN CITY"}
                                </h3>
                                <p className="text-gray-600 font-medium tracking-widest">
                                  {formatNumber(city.orders || 0)} ORDERS
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-black text-xl">
                                {formatCurrency(city.revenue || 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>
              )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
