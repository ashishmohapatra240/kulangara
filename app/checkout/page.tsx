"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { PaymentMethod, ICheckoutFormData } from "@/app/types/checkout.type";
import { useCheckout } from "@/app/hooks/useCheckout";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    addresses,
    selectedAddressId,
    couponCode,
    appliedCoupon,
    loading,
    error,
    subtotal,
    tax,
    discount,
    total,
    setSelectedAddressId,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    createOrder,
  } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cashfree");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<ICheckoutFormData>({
    email: "",
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleApplyCoupon = async () => {
    setFormError("");
    await applyCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      const order = await createOrder(paymentMethod, formData);
      if (order) {
        router.push(`/orders/${order.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unknown error occurred");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ICheckoutFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-4">Delivery</h2>

            {addresses.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Select Address</h3>
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className="flex items-start p-3 border border-gray-300 cursor-pointer hover:border-gray-400"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.address}
                        </p>
                        {address.apartment && (
                          <p className="text-sm text-gray-600">
                            {address.apartment}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Add New Address</h3>
              <div className="space-y-4">
                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  >
                    <option value="">Select State</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                  </select>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN code"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number for order updates"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-4">Payment</h2>
            <p className="text-sm text-gray-600 mb-4">
              All transactions are secure and encrypted.
            </p>

            <div className="space-y-4">
              <label className="flex items-center p-4 border border-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cashfree"}
                  onChange={() => setPaymentMethod("cashfree")}
                  className="mr-2"
                />
                <span>Cashfree Payments (UPI,Cards,Wallets,NetBanking)</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mr-2"
                />
                <span>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mr-2"
                />
                <span>GoKwik Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-4">Billing address</h2>
            <label className="flex items-center mb-4">
              <input
                type="radio"
                checked={useSameAddress}
                onChange={() => setUseSameAddress(true)}
                className="mr-2"
              />
              <span>Same as shipping address</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useSameAddress}
                onChange={() => setUseSameAddress(false)}
                className="mr-2"
              />
              <span>Use a different billing address</span>
            </label>
          </div>

          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || formError}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Processing..." : "Pay now"}
          </Button>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={
                      item.product?.images?.[0]?.url ||
                      "/images/coming-soon.jpg"
                    }
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.variant?.size} / {item.variant?.color || "All ages"}
                  </p>
                </div>
                <p className="font-medium">₹{item.price.toLocaleString()}.00</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none"
              />
              <Button
                variant="outline"
                className="ml-2"
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode.trim()}
              >
                Apply
              </Button>
            </div>

            {appliedCoupon && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <div className="flex justify-between items-center">
                  <span>Coupon applied: {appliedCoupon.code}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm mt-1">{appliedCoupon.description}</p>
              </div>
            )}

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal · {cartItems.length} items</span>
                <span>₹{subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Including ₹{tax.toLocaleString()}.17 in taxes</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
