"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IOrder } from "@/app/types/order.type";
import orderService from "@/app/services/order.service";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "outline" as const, color: "text-yellow-600", bg: "bg-yellow-50" };
      case "CONFIRMED":
        return { variant: "secondary" as const, color: "text-blue-600", bg: "bg-blue-50" };
      case "PROCESSING":
        return { variant: "secondary" as const, color: "text-purple-600", bg: "bg-purple-50" };
      case "SHIPPED":
        return { variant: "default" as const, color: "text-indigo-600", bg: "bg-indigo-50" };
      case "DELIVERED":
        return { variant: "default" as const, color: "text-green-600", bg: "bg-green-50" };
      case "CANCELLED":
        return { variant: "destructive" as const, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { variant: "outline" as const, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  if (loading) {
    return (
      <div className="pt-30">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading your orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-30">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-30">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FiShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Start shopping to see your orders appear here
            </p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-30 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order: IOrder) => {
          const statusConfig = getStatusConfig(order.status);
          const firstThreeItems = order.items?.slice(0, 3) || [];
          const remainingCount = (order.items?.length || 0) - 3;

          return (
            <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                {/* Header Section */}
                <div className={`${statusConfig.bg} px-6 py-4 border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FiPackage className={`h-5 w-5 ${statusConfig.color}`} />
                        <div>
                          <p className="text-xs text-muted-foreground">Order</p>
                          <p className="font-semibold">#{order.orderNumber}</p>
                        </div>
                      </div>
                      <Separator orientation="vertical" className="h-10" />
                      <div>
                        <p className="text-xs text-muted-foreground">Placed on</p>
                        <p className="text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Separator orientation="vertical" className="h-10" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-bold">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant={statusConfig.variant} className="font-medium">
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {firstThreeItems.map((item, index) => (
                        <div
                          key={index}
                          className="relative w-12 h-12 rounded-lg border-2 border-background overflow-hidden bg-muted"
                        >
                          <Image
                            src={item.product?.images?.[0]?.url || "/images/coming-soon.jpg"}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <div className="relative w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs font-semibold text-muted-foreground">
                            +{remainingCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {firstThreeItems.map(item => item.product?.name).filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/orders/${order.id}`} className="flex-1">
                      <Button variant="default" className="w-full" size="sm">
                        View Order Details
                      </Button>
                    </Link>
                    {order.status === "DELIVERED" && (
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Rate Products
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
