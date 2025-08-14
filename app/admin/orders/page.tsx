"use client";

import { useAdminOrders, useUpdateOrderStatus } from "@/app/hooks/useOrders";
import { useState } from "react";
import { IOrder } from "@/app/types/order.type";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useAdminUsers } from "@/app/hooks/useAdminUserManagement";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "DELIVERY_PARTNER"];
const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: orders, isLoading: isOrdersLoading } = useAdminOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [editing, setEditing] = useState<{ [orderId: string]: boolean }>({});
  const [statusDraft, setStatusDraft] = useState<{ [orderId: string]: string }>({});
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsers({ limit: 1000 });
  const users = usersData?.data || [];
  console.log('Fetched users:', users);

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

  // Helper to get total quantity
  const getTotalQuantity = (items: IOrder["items"]) => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
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

  if (isLoading || isOrdersLoading || isUsersLoading || !isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">Orders Management</h1>
        </div>

        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-normal">All Orders</h2>
          </div>
          <div className="p-6">
            {isOrdersLoading ? (
              <div className="text-center text-gray-500">Loading orders...</div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center text-gray-500">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-2 font-medium">Order #</th>
                      <th className="text-left px-4 py-2 font-medium">User</th>
                      <th className="text-left px-4 py-2 font-medium">Product(s)</th>
                      <th className="text-left px-4 py-2 font-medium">Quantity</th>
                      <th className="text-left px-4 py-2 font-medium">Status</th>
                      <th className="text-left px-4 py-2 font-medium">Payment Status</th>
                      <th className="text-left px-4 py-2 font-medium">Total (₹)</th>
                      <th className="text-left px-4 py-2 font-medium">Payment Method</th>
                      <th className="text-left px-4 py-2 font-medium">ETA</th>
                      <th className="text-left px-4 py-2 font-medium">Created</th>
                      <th className="text-left px-4 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: IOrder) => (
                      <tr key={order.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{order.orderNumber}</td>
                        <td className="px-4 py-2">
                          {(() => {
                            const info = getUserInfo(order.userId);
                            console.log('Order userId:', order.userId, 'Matched user:', info);
                            return (
                              <div>
                                <div className="font-medium">{info.name}</div>
                                {info.email && (
                                  <div className="text-xs text-gray-500">{info.email}</div>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-2">{getProductNames(order.items)}</td>
                        <td className="px-4 py-2">{getTotalQuantity(order.items)}</td>
                        <td className="px-4 py-2">
                          {editing[order.id] ? (
                            <select
                              className="px-2 py-1 border border-gray-300 focus:outline-none focus:border-black"
                              value={statusDraft[order.id] ?? order.status}
                              onChange={e => setStatusDraft(s => ({ ...s, [order.id]: e.target.value }))}
                            >
                              {ORDER_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          ) : (
                            <span>{order.status}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">{order.paymentStatus}</td>
                        <td className="px-4 py-2">{order.totalAmount}</td>
                        <td className="px-4 py-2">{order.paymentMethod}</td>
                        <td className="px-4 py-2">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          {editing[order.id] ? (
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-black text-white border border-black font-medium"
                                onClick={() => {
                                  updateStatusMutation.mutate({ orderId: order.id, status: statusDraft[order.id] ?? order.status });
                                  setEditing(e => ({ ...e, [order.id]: false }));
                                }}
                                disabled={updateStatusMutation.isPending}
                              >
                                {updateStatusMutation.isPending ? "Saving..." : "Save"}
                              </button>
                              <button
                                className="px-3 py-1 bg-white text-black border border-gray-300 font-medium"
                                onClick={() => setEditing(e => ({ ...e, [order.id]: false }))}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="px-3 py-1 bg-white text-black border border-gray-300 font-medium"
                              onClick={() => setEditing(e => ({ ...e, [order.id]: true }))}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 