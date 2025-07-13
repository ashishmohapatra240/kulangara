"use client";

import { useWishlist, useDeleteWishlistItems } from "@/app/hooks/useWishlist";
import { toast } from "react-hot-toast";
import WishlistCard from "../WishlistCard";

export const WishlistSection = () => {
  const { data: wishlistResponse, isLoading, error } = useWishlist();
  const deleteWishlistMutation = useDeleteWishlistItems();

  const wishlistItems = wishlistResponse?.data || [];

  const handleRemoveFromWishlist = (productId: string) => {
    deleteWishlistMutation.mutate(productId, {
      onSuccess: () => {
        toast.success("Item removed from wishlist");
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMoveToCart = (_productId: string) => {
    // TODO: Implement move to cart functionality
    toast.success("Item moved to cart");
  };

  if (isLoading) {
    return (
      <div className="pt-30">
        <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-30">
        <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-30">
      <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.product.id}
              item={item.product}
              removeFromWishlist={handleRemoveFromWishlist}
              moveToCart={handleMoveToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
