"use client";

import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Button from "./Button";
import ReviewSummary from "./ReviewSummary";
import { useWishlist, useCreateWishlistItems, useDeleteWishlistItems } from "@/app/hooks/useWishlist";
import { useCart, useAddToCart } from "@/app/hooks/useCart";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images?: { id: string; url: string; alt: string; isPrimary: boolean }[];
  reviews?: {
    rating: number;
    total: number;
  };
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80";

export default function ProductCard({
  id,
  name,
  price,
  images,
  reviews,
}: ProductCardProps) {
  const { data: wishlistResponse } = useWishlist();
  const createWishlistMutation = useCreateWishlistItems();
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { addItemToCart, loading: cartLoading } = useAddToCart();
  const { items: cartItems, loading: cartStateLoading } = useCart();

  // Check if product is in wishlist
  const wishlistItems = wishlistResponse?.data || [];
  const isInWishlist = wishlistItems.some(item => item.product.id === id);

  // Check if product is in cart - improved logic
  const isInCart = cartItems.some(item => item.productId === id);

  // Prefer primary image from images array, fallback to image string, then placeholder
  let displayImage = PLACEHOLDER_IMAGE;
  if (Array.isArray(images) && images.length > 0) {
    const primary = images.find((img) => img.isPrimary) || images[0];
    displayImage = primary.url || PLACEHOLDER_IMAGE;
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isInWishlist) {
        await deleteWishlistMutation.mutateAsync(id);
        toast.success("Removed from wishlist");
      } else {
        await createWishlistMutation.mutateAsync(id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addItemToCart({
        productId: id,
        quantity: 1
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="group relative bg-white">
      <div className="aspect-square w-full overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 rounded-full shadow-sm"
          disabled={createWishlistMutation.isPending || deleteWishlistMutation.isPending}
        >
          {isInWishlist ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <CiHeart className="w-5 h-5" />
          )}
        </button>
      </div>
      <div>
        <div>
          <div className="flex flex-row justify-between my-2">
            <h3 className="text-lg font-medium">
              <Link href={`/products/${id}`} className="hover:underline">
                {name}
              </Link>
            </h3>
            <p className="text-gray-900 font-medium">₹{price}</p>
          </div>

          {/* Review Summary */}
          {reviews && (
            <div className="mb-2">
              <ReviewSummary
                averageRating={reviews.rating}
                totalReviews={reviews.total}
              />
            </div>
          )}
        </div>
        {isInCart ? (
          <Link href="/cart" className="w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Go to Cart
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={cartLoading || cartStateLoading}
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  );
}
