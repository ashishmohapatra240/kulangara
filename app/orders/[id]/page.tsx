"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import { IOrder, IOrderItem, ITrackingHistoryItem } from "@/app/types/order.type";
import { OrderTrackingComponent } from "@/app/components/ui/OrderTracking";
import ReviewModal from "@/app/components/ui/ReviewModal";
import reviewService from "@/app/services/review.service";
import { ICreateReviewData, IUpdateReviewData } from "@/app/types/review.type";
import orderService from "@/app/services/order.service";

interface ActualOrderApiResponse {
  data: {
    data: IOrder;
  };
}

export default function OrderConfirmationPage() {
  const params = useParams();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-30">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-30">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Order Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-medium">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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

        {/* Tracking Information */}
        <div className="mb-6">
          <OrderTrackingComponent
            tracking={tracking}
            currentStatus={order.status}
          />
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: IOrderItem, index: number) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={
                      item.product?.images?.[0]?.url ||
                      "/images/coming-soon.jpg"
                    }
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.variant?.size} / {item.variant?.color || "Standard"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹{item.price.toLocaleString()}.00
                  </p>
                  {order.status === 'DELIVERED' && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleRateProduct(item.product?.id || item.productId)}>
                        Rate this product
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-gray-600">{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && (
              <p className="text-gray-600">{order.shippingAddress.apartment}</p>
            )}
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.pincode}
            </p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0
                    ? "FREE"
                    : `₹${order.shippingFee.toLocaleString()}.00`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.taxAmount.toLocaleString()}.00</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount.toLocaleString()}.00</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Payment Information</h2>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Payment Status</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  order.paymentStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            {deliveredDate && (
              <div className="mt-3 text-sm text-gray-700">
                Delivered on {deliveredDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* Return/Exchange policy note */}
        {deliveredDate && (
          <div className={`mb-6 p-4 rounded-lg border ${isReturnEligible ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
            Return/Exchange is eligible for 30 days post the delivery date. {isReturnEligible ? '' : `Your order is not eligible for return/exchange as it was delivered on ${deliveredDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}.`}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Continue Shopping
          </Button>
          {order.status === "PENDING" && (
            <Button
              onClick={handleCancelOrder}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={loading}
            >
              Cancel Order
            </Button>
          )}
          <Button
            onClick={handleTrackOrder}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Refresh Tracking
          </Button>
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
