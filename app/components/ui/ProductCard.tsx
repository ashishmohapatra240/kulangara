"use client";

import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import {
  useWishlist,
  useCreateWishlistItems,
  useDeleteWishlistItems,
} from "@/app/hooks/useWishlist";
import { useReviews } from "@/app/hooks/useReviews";
import { useSingleProductStock } from "@/app/hooks/useCartValidation";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images?: { id: string; url: string; alt: string; isPrimary: boolean }[];
  category?: { name: string };
}

const PLACEHOLDER_IMAGE =
  "/images/coming-soon.jpg";

export default function ProductCard({
  id,
  name,
  price,
  discountedPrice,
  images,
  category,
}: ProductCardProps) {
  const { data: wishlistResponse } = useWishlist();
  const createWishlistMutation = useCreateWishlistItems();
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { data: reviewsData } = useReviews(id);
  const { data: stockInfo, isLoading: stockLoading } =
    useSingleProductStock(id);

  const wishlistItems = wishlistResponse?.data || [];
  const isInWishlist = wishlistItems.some((item) => item.product.id === id);

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

  const avgRating = reviewsData?.meta?.stats?.averageRating ?? 0;
  const reviewCount = reviewsData?.meta?.total ?? 0;

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"
        }`}
      />
    ));
  };

  const getStockDisplay = () => {
    if (stockLoading) return null;
    if (!stockInfo) return null;

    const { stockQuantity, lowStockThreshold } = stockInfo;

    if (stockQuantity === 0) {
      return (
        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
      );
    } else if (stockQuantity <= lowStockThreshold) {
      return (
        <span className="text-xs text-orange-500 font-medium">
          Only {stockQuantity} left!
        </span>
      );
    } else if (stockQuantity <= 10) {
      return (
        <span className="text-xs text-yellow-600 font-medium">Low stock</span>
      );
    }

    return null;
  };

  return (
    <Link
      href={`/products/${id}`}
      className="group relative block bg-white border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
    >
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
          className="absolute top-4 right-4 p-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 border border-gray-200"
          disabled={
            createWishlistMutation.isPending || deleteWishlistMutation.isPending
          }
        >
          {isInWishlist ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <CiHeart className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div>
          {category?.name && (
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">
              {category.name}
            </div>
          )}
          <div className="flex flex-row justify-between items-start mb-2">
            <h3 className="text-lg font-medium leading-tight group-hover:text-gray-700 transition-colors">
              {name}
            </h3>
            <div className="flex flex-col items-end">
              {discountedPrice && discountedPrice < price ? (
                <>
                  <span className="text-gray-900 font-semibold">
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 font-semibold">
                  ₹{price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          {/* Rating row like product detail page */}
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center">
                {renderStars(avgRating, "lg")}
              </div>
              <span className="text-lg font-bold text-gray-900">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">out of 5</span>
              <span className="text-sm text-gray-600">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}

          <div className="mt-1">
            {getStockDisplay()}
          </div>
        </div>
      </div>
    </Link>
  );
}
