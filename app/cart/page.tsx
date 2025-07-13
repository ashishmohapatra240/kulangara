"use client";

import Link from "next/link";
import Button from "@/app/components/ui/Button";
import CartCard from "@/app/components/ui/CartCard";
import RecommendedProducts from "@/app/components/sections/RecommendedProducts";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/app/hooks/useCart";
import { ICartItem } from "../types/cart.type";

export default function CartPage() {
  const { items, totalItems, subtotal, shipping, total, loading, error } =
    useCart();
  const { updateItem, loading: updateLoading } = useUpdateCartItem();
  const { removeItem, loading: removeLoading } = useRemoveFromCart();
  const { clearAllItems, loading: clearLoading } = useClearCart();

  const isCartLoading =
    loading || updateLoading || removeLoading || clearLoading;

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity === 0) {
      await removeItem(id);
      return;
    }

    await updateItem(id, { quantity });
  };

  const removeFromCart = async (id: string) => {
    await removeItem(id);
  };

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading cart: {error}</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto px-4 py-16 mt-30 max-w-6xl ${
        isCartLoading ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>

      {items.length === 0 && !loading ? (
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
              {items.map((item: ICartItem) => (
                <CartCard
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}

              {/* Clear Cart Button */}
              <div className="mt-6 text-right">
                <Button
                  variant="outline"
                  onClick={clearAllItems}
                  disabled={isCartLoading}
                >
                  {clearLoading ? "Clearing..." : "Clear Cart"}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 h-fit">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>₹{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping?.toLocaleString()}.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-6" disabled={isCartLoading}>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
          <RecommendedProducts />
        </>
      )}
    </div>
  );
}
