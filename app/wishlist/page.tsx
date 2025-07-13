"use client";

import Link from "next/link";
import Button from "@/app/components/ui/Button";
import WishlistCard from "@/app/components/ui/WishlistCard";
import { useDeleteWishlistItems, useWishlist } from "../hooks/useWishlist";
import { useAddToCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { addItemToCart } = useAddToCart();
  const { data: wishlistResponse, isLoading, error } = useWishlist();

  const wishlistItems = wishlistResponse?.data || [];

  const handleRemoveFromWishlist = (productId: string) => {
    deleteWishlistMutation.mutate(productId, {
      onSuccess: () => {
        toast.success("Item removed from wishlist");
      },
    });
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      // Find the product in wishlist to get its details
      const wishlistItem = wishlistItems.find(
        (item) => item.product.id === productId
      );

      if (!wishlistItem) {
        toast.error("Product not found in wishlist");
        return;
      }

      // Add to cart
      await addItemToCart({
        productId: productId,
        quantity: 1,
        variantId: wishlistItem.product.variants?.[0]?.id, // Use first variant if available
      });

      // Remove from wishlist after successful cart addition
      deleteWishlistMutation.mutate(productId, {
        onSuccess: () => {
          toast.success("Item moved to cart successfully");
        },
      });
    } catch {
      toast.error("Failed to move item to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 mt-30 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading wishlist</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

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
}
