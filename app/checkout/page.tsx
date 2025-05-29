"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/ui/Button";
import { CartItem, DUMMY_CART } from "@/app/data/cart";
import { PaymentMethod, CheckoutFormData } from "@/app/types/checkout";


export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>(DUMMY_CART);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cashfree");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [formData, setFormData] = useState<CheckoutFormData>({
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // FREE shipping
  const tax = Math.round(subtotal * 0.18); // 18% tax
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, paymentMethod });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-medium mb-4">Account</h1>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-4">Delivery</h2>
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
                  {/* Add more states */}
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

          <Button onClick={handleSubmit} className="w-full">
            Pay now
          </Button>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">XS / All ages</p>
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
                className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none"
              />
              <Button variant="outline" className="ml-2">
                Apply
              </Button>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal · {cartItems.length} items</span>
                <span>₹{subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
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