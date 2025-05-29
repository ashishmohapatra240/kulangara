"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import WishlistCard from "@/app/components/ui/WishlistCard";
import { Product } from "@/app/types/product";
import { DUMMY_WISHLIST } from "@/app/data/wishlist";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(DUMMY_WISHLIST);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
      <h1 className="text-2xl font-medium mb-20 text-center">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.id}
              item={item as Product}
              removeFromWishlist={removeFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
