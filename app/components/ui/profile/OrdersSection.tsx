"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IOrder } from "@/app/types/order.type";
import orderService from "@/app/services/order.service";
import Button from "@/app/components/ui/Button";

export const OrdersSection = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders();
        if (response.data && response.data.data) {
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-30">
      <h1 className="text-2xl font-normal mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center border border-gray-200 p-12">
          <p className="text-gray-600 mb-4">You have no past orders.</p>
          <Link href="/" passHref>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: IOrder) => (
            <Link
              href={`/orders/${order.id}`}
              key={order.id}
              className="block border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-medium text-lg">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">
                      ₹{order.totalAmount.toLocaleString()}.00
                    </p>
                    <span
                      className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PROCESSING"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "SHIPPED"
                          ? "bg-indigo-100 text-indigo-800"
                          : order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
