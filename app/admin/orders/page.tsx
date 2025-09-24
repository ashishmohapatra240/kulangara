"use client";

import {
  useAdminOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "@/app/hooks/useOrders";
import { useState } from "react";
import { IOrder, IOrderFilters } from "@/app/types/order.type";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useAdminUsers } from "@/app/hooks/useAdminUserManagement";
import { FiSearch, FiCalendar } from "react-icons/fi";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "DELIVERY_PARTNER"];
const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIAL_REFUND",
];
const PAYMENT_METHODS = ["RAZORPAY", "COD"];

export default function AdminOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [filters, setFilters] = useState<IOrderFilters>({
    page: 1,
    limit: 10,
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    search: "",
  });

  const { data: ordersData, isLoading: isOrdersLoading } =
    useAdminOrders(filters);
  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();
  const [editing, setEditing] = useState<{ [orderId: string]: boolean }>({});
  const [editingPayment, setEditingPayment] = useState<{
    [orderId: string]: boolean;
  }>({});
  const [statusDraft, setStatusDraft] = useState<{ [orderId: string]: string }>(
    {}
  );
  const [paymentStatusDraft, setPaymentStatusDraft] = useState<{
    [orderId: string]: string;
  }>({});
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsers({
    limit: 1000,
  });
  const users = usersData?.data || [];

  // Extract orders and meta from the response
  const orders = ordersData?.data || [];
  const meta = ordersData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Helper to get user info by userId
  const getUserInfo = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { name: userId, email: "" };
    return { name: `${user.firstName} ${user.lastName}`, email: user.email };
  };

  // Helper to get product names (truncated)
  const getProductNames = (items: IOrder["items"]) => {
    if (!items || items.length === 0) return "-";
    const names = items.map((item) => item.product?.name || "");
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
  };

  const getTotalQuantity = (items: IOrder["items"]) => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const handleFilterChange = (
    key: keyof IOrderFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/(auth)/login?redirect=/admin/orders");
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (
    isLoading ||
    isOrdersLoading ||
    isUsersLoading ||
    !isAuthenticated ||
    !user ||
    !ALLOWED_ROLES.includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold tracking-tight">LOADING...</h1>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-gray-400">
          <h1 className="text-4xl font-bold tracking-tight">
            ORDERS MANAGEMENT
          </h1>
        </div>

        <div className="space-y-12">
          {/* Filters */}
          <div className="bg-white border-2 border-gray-400 p-8">
            <h2 className="text-2xl font-bold mb-8 tracking-tight">FILTERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">
                  SEARCH
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="SEARCH BY ORDER NUMBER OR USER"
                    className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none font-medium placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 tracking-widest">
                  STATUS
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:outline-none font-medium"
                >
                  <option value="">All Statuses</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 tracking-widest">
                  PAYMENT STATUS
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    handleFilterChange("paymentStatus", e.target.value)
                  }
                    className="w-full px-4 py-3 border-2 border-gray-400 focus:outline-none font-medium"
                >
                  <option value="">All Payment Statuses</option>
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">
                  PAYMENT METHOD
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    handleFilterChange("paymentMethod", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-400 focus:outline-none font-medium"
                >
                  <option value="">All Payment Methods</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-3 tracking-widest">
                  LIMIT
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    handleFilterChange("limit", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFilters({
                      page: 1,
                      limit: 10,
                      status: "",
                      paymentStatus: "",
                      paymentMethod: "",
                      search: "",
                    })
                  }
                  className="w-full px-4 py-3 bg-black text-white border-2 border-black font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </div>

          <div className="border-2 border-black">
            <div className="p-8 border-b-2 border-black bg-white">
              <h2 className="text-2xl font-bold text-black tracking-tight">
                ALL ORDERS
              </h2>
              {ordersData && meta && (
                <p className="text-sm font-medium text-black mt-2 tracking-wide">
                  SHOWING {(meta.page - 1) * meta.limit + 1} TO{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} OF {meta.total}{" "}
                  ORDERS
                </p>
              )}
            </div>
            <div className="p-8">
              {isOrdersLoading ? (
                <div className="text-center text-black font-bold tracking-wide py-12">
                  LOADING ORDERS...
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center text-gray-600 font-medium tracking-wide py-12">
                  NO ORDERS FOUND.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Order #
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          User
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Product(s)
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Qty
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Status
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Payment
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Total (₹)
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Method
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          ETA
                        </th>
                        <th className="text-left px-6 py-4 font-semibold border-r border-gray-700 last:border-r-0">
                          Created
                        </th>
                        <th className="text-left px-6 py-4 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: IOrder, index: number) => (
                        <tr
                          key={order.id}
                          className={`border-b border-black ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100`}
                        >
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="font-mono text-sm font-medium">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            {(() => {
                              const info = getUserInfo(order.userId);
                              return (
                                <div>
                                  <div className="font-medium text-black">
                                    {info.name}
                                  </div>
                                  {info.email && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      {info.email}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="text-sm">
                              {getProductNames(order.items)}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0 text-center">
                            <span className="font-medium">
                              {getTotalQuantity(order.items)}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            {editing[order.id] ? (
                              <select
                                className="w-full px-3 py-2 border border-black bg-white text-black font-medium focus:outline-none"
                                value={statusDraft[order.id] ?? order.status}
                                onChange={(e) =>
                                  setStatusDraft((s) => ({
                                    ...s,
                                    [order.id]: e.target.value,
                                  }))
                                }
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  order.status === "DELIVERED"
                                    ? "bg-black text-white"
                                    : order.status === "SHIPPED"
                                    ? "bg-gray-800 text-white"
                                    : order.status === "PROCESSING"
                                    ? "bg-gray-600 text-white"
                                    : order.status === "CONFIRMED"
                                    ? "bg-gray-400 text-white"
                                    : order.status === "CANCELLED"
                                    ? "bg-white text-black border border-black"
                                    : "bg-gray-200 text-black"
                                }`}
                              >
                                {order.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            {editingPayment[order.id] ? (
                              <select
                                className="w-full px-3 py-2 border border-black bg-white text-black font-medium focus:outline-none"
                                value={
                                  paymentStatusDraft[order.id] ??
                                  order.paymentStatus
                                }
                                onChange={(e) =>
                                  setPaymentStatusDraft((s) => ({
                                    ...s,
                                    [order.id]: e.target.value,
                                  }))
                                }
                              >
                                {PAYMENT_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  order.paymentStatus === "PAID"
                                    ? "bg-black text-white"
                                    : order.paymentStatus === "FAILED"
                                    ? "bg-white text-black border border-black"
                                    : order.paymentStatus === "REFUNDED"
                                    ? "bg-gray-600 text-white"
                                    : order.paymentStatus === "PARTIAL_REFUND"
                                    ? "bg-gray-400 text-white"
                                    : "bg-gray-200 text-black"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="font-semibold text-black">
                              ₹{order.totalAmount}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="text-sm font-medium uppercase">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="text-sm">
                              {order.estimatedDelivery
                                ? new Date(
                                    order.estimatedDelivery
                                  ).toLocaleDateString()
                                : "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-gray-200 last:border-r-0">
                            <span className="text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              {editing[order.id] ? (
                                <div className="flex gap-2">
                                  <button
                                    className="px-4 py-2 bg-black text-white border border-black font-medium text-xs hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                      updateStatusMutation.mutate({
                                        orderId: order.id,
                                        status:
                                          statusDraft[order.id] ?? order.status,
                                      });
                                      setEditing((e) => ({
                                        ...e,
                                        [order.id]: false,
                                      }));
                                    }}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    {updateStatusMutation.isPending
                                      ? "Saving..."
                                      : "Save"}
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-white text-black border border-black font-medium text-xs hover:bg-gray-100 transition-colors"
                                    onClick={() =>
                                      setEditing((e) => ({
                                        ...e,
                                        [order.id]: false,
                                      }))
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="px-4 py-2 bg-white text-black border border-black font-medium text-xs hover:bg-gray-100 transition-colors"
                                  onClick={() =>
                                    setEditing((e) => ({
                                      ...e,
                                      [order.id]: true,
                                    }))
                                  }
                                >
                                  Edit Status
                                </button>
                              )}

                              {editingPayment[order.id] ? (
                                <div className="flex gap-2">
                                  <button
                                    className="px-4 py-2 bg-black text-white border border-black font-medium text-xs hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                      updatePaymentStatusMutation.mutate({
                                        orderId: order.id,
                                        paymentStatus:
                                          paymentStatusDraft[order.id] ??
                                          order.paymentStatus,
                                      });
                                      setEditingPayment((e) => ({
                                        ...e,
                                        [order.id]: false,
                                      }));
                                    }}
                                    disabled={
                                      updatePaymentStatusMutation.isPending
                                    }
                                  >
                                    {updatePaymentStatusMutation.isPending
                                      ? "Saving..."
                                      : "Save"}
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-white text-black border border-black font-medium text-xs hover:bg-gray-100 transition-colors"
                                    onClick={() =>
                                      setEditingPayment((e) => ({
                                        ...e,
                                        [order.id]: false,
                                      }))
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="px-4 py-2 bg-white text-black border border-black font-medium text-xs hover:bg-gray-100 transition-colors"
                                  onClick={() =>
                                    setEditingPayment((e) => ({
                                      ...e,
                                      [order.id]: true,
                                    }))
                                  }
                                >
                                  Edit Payment
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {orders.length > 0 && (
                <div className="mt-8 flex items-center justify-between border-t-2 border-black pt-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-black tracking-widest">
                      SHOW
                    </span>
                    <select
                      value={filters.limit}
                      onChange={(e) =>
                        handleFilterChange("limit", Number(e.target.value))
                      }
                      className="border-2 border-black px-3 py-2 text-sm font-medium"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm font-bold text-black tracking-widest">
                      ENTRIES
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-black tracking-wide">
                      SHOWING {(meta.page - 1) * meta.limit + 1} TO{" "}
                      {Math.min(meta.page * meta.limit, meta.total)} OF{" "}
                      {meta.total} RESULTS
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(meta.page - 1)}
                      disabled={meta.page <= 1}
                      className="px-4 py-2 text-sm border-2 border-black font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                    >
                      PREVIOUS
                    </button>

                    {Array.from(
                      { length: Math.min(5, meta.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (meta.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (meta.page <= 3) {
                          pageNum = i + 1;
                        } else if (meta.page >= meta.totalPages - 2) {
                          pageNum = meta.totalPages - 4 + i;
                        } else {
                          pageNum = meta.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 text-sm border-2 border-black font-bold ${
                              meta.page === pageNum
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-black hover:text-white transition-colors"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() => handlePageChange(meta.page + 1)}
                      disabled={meta.page >= meta.totalPages}
                      className="px-4 py-2 text-sm border-2 border-black font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
