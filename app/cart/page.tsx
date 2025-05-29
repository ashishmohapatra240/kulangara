"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import CartCard from "@/app/components/ui/CartCard";
import RecommendedProducts from "@/app/components/sections/RecommendedProducts";
import { CartItem, DUMMY_CART } from "@/app/data/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(DUMMY_CART);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
      <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartCard
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            <div className="bg-gray-50 p-6 h-fit">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString()}.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
              <Button className="w-full mt-6">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
          <RecommendedProducts />
        </>
      )}
    </div>
  );
}
