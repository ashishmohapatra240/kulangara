"use client";

import { useWishlist, useDeleteWishlistItems } from "@/app/hooks/useWishlist";
import { toast } from "react-hot-toast";
import WishlistCard from "../WishlistCard";
import { useAddToCart } from "@/app/hooks/useCart";
import productsService from "@/app/services/products.service";
import { Card, CardContent } from "../card";
import { Alert, AlertDescription } from "../alert";

export const WishlistSection = () => {
  const { data: wishlistResponse, isLoading, error } = useWishlist();
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { addItemToCart } = useAddToCart();

  const wishlistItems = wishlistResponse?.data || [];

  const handleRemoveFromWishlist = (productId: string) => {
    deleteWishlistMutation.mutate(productId, {
      onSuccess: () => {
        toast.success("Item removed from wishlist");
      },
    });
  };

  const handleMoveToCart = async (productId: string, variantId?: string) => {
    try {
      const wishlistItem = wishlistItems.find(
        (item) => item.product.id === productId
      );

      if (!wishlistItem) {
        toast.error("Product not found in wishlist");
        return;
      }

      // If no variant selected, fetch product to confirm variants exist
      if (!variantId) {
        try {
          const fullProduct = await productsService.getProductById(productId);
          if ((fullProduct.variants?.length || 0) > 0) {
            toast.error("Please select a size");
            return;
          }
        } catch {
          if ((wishlistItem.product.variants?.length || 0) > 0) {
            toast.error("Please select a size");
            return;
          }
        }
      }

      await addItemToCart({
        productId,
        quantity: 1,
        variantId,
      });

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
      <div className="pt-30">
        <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading wishlist...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-30">
        <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Error loading wishlist. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 lg:pt-1">
      <h1 className="text-2xl font-normal mb-8">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
          </CardContent>
        </Card>
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
