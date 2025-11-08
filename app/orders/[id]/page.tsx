"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";
import { IOrder, IOrderItem, ITrackingHistoryItem } from "@/app/types/order.type";
import { OrderTrackingComponent } from "@/app/components/ui/OrderTracking";
import ReviewModal from "@/app/components/ui/ReviewModal";
import reviewService from "@/app/services/review.service";
import { ICreateReviewData, IUpdateReviewData } from "@/app/types/review.type";
import orderService from "@/app/services/order.service";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface ActualOrderApiResponse {
  data: {
    data: IOrder;
  };
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<IOrder | null>(null);
  const [tracking, setTracking] = useState<ITrackingHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingProductId, setRatingProductId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(orderId);
      setOrder((response as unknown as ActualOrderApiResponse).data.data);
    } catch (error) {
      console.error("Error loading order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const loadTracking = useCallback(async () => {
    try {
      const response = await orderService.trackOrder(orderId);
      if (response.status === "success") {
        setTracking(response.data.history || []);
      }
    } catch (error) {
      console.error("Error loading tracking:", error);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setLoading(true);
      await orderService.cancelOrder(order.id);
      // Reload order to get updated status
      await loadOrder();
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async () => {
    await loadTracking();
  };

  const handleRateProduct = (productId: string) => {
    setRatingProductId(productId);
    setRatingModalOpen(true);
  };

  const submitReview = async (data: ICreateReviewData) => {
    if (!ratingProductId) return;
    try {
      setIsSubmittingReview(true);
      await reviewService.createReview(ratingProductId, data);
      setRatingModalOpen(false);
    } catch (e) {
      console.error('Error submitting review', e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "outline";
      case "CONFIRMED":
        return "secondary";
      case "PROCESSING":
        return "secondary";
      case "SHIPPED":
        return "default";
      case "DELIVERED":
        return "default";
      default:
        return "destructive";
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "outline";
      default:
        return "destructive";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-30">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-30">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // compute delivered date for messaging
  const deliveredAt = order.deliveredAt || tracking.find(t => t.status === 'DELIVERED')?.createdAt || null;
  const deliveredDate = deliveredAt ? new Date(deliveredAt) : null;
  const today = new Date();
  const diffDays = deliveredDate ? Math.floor((today.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isReturnEligible = deliveredDate ? diffDays !== null && diffDays <= 30 : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-24">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-4 -ml-2"
      >
        <FiArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header with Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.status)} className="text-sm px-4 py-2">
                  {order.status}
                </Badge>
              </div>
              
              {deliveredDate && (
                <Alert className={isReturnEligible ? "border-blue-200 bg-blue-50" : "border-orange-200 bg-orange-50"}>
                  <AlertDescription className="text-sm">
                    <strong>Delivery Date:</strong> {deliveredDate.toLocaleDateString(undefined, { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {isReturnEligible ? (
                      <span className="ml-2 text-blue-700">• Eligible for return/exchange (30 days)</span>
                    ) : (
                      <span className="ml-2 text-orange-700">• Return/exchange period expired</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: IOrderItem, index: number) => (
                <div key={index}>
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg border overflow-hidden flex-shrink-0 bg-muted">
                      <Image
                        src={item.product?.images?.[0]?.url || "/images/coming-soon.jpg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-base">{item.product?.name}</h3>
                      <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                        <span>Size: {item.variant?.size || "N/A"}</span>
                        <span>•</span>
                        <span>Color: {item.variant?.color || "Standard"}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {order.status === 'DELIVERED' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3" 
                          onClick={() => handleRateProduct(item.product?.id || item.productId)}
                        >
                          Rate this product
                        </Button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping & Payment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p className="text-sm text-muted-foreground">{order.shippingAddress.apartment}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Summary & Tracking */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">
                    {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">₹{order.taxAmount.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button onClick={handleTrackOrder} variant="outline" className="w-full">
                  Refresh Tracking
                </Button>
                {order.status === "PENDING" && (
                  <Button 
                    onClick={handleCancelOrder} 
                    variant="destructive" 
                    disabled={loading} 
                    className="w-full"
                  >
                    {loading ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
                <Button 
                  onClick={() => (window.location.href = "/")} 
                  variant="outline" 
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTrackingComponent tracking={tracking} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        productId={ratingProductId || ''}
        onSubmit={submitReview as (data: ICreateReviewData | IUpdateReviewData) => void}
        isLoading={isSubmittingReview}
      />
    </div>
  );
}
