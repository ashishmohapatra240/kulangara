"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { cn } from "@/app/lib/utils";
import { formatCurrency, calculateDiscountPercentage } from "@/app/lib/formatters";
import {
  useWishlist,
  useCreateWishlistItems,
  useDeleteWishlistItems,
} from "@/app/hooks/useWishlist";
import { useReviews } from "@/app/hooks/useReviews";
import { useSingleProductStock } from "@/app/hooks/useCartValidation";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images?: { id: string; url: string; alt: string; isPrimary: boolean }[];
  category?: { name: string };
}

const PLACEHOLDER_IMAGE = "/images/coming-soon.jpg";

function ProductCardComponent({
  id,
  name,
  price,
  discountedPrice,
  images,
  category,
}: ProductCardProps) {
  const { data: wishlistResponse, refetch: refetchWishlist } = useWishlist();
  const createWishlist = useCreateWishlistItems();
  const deleteWishlist = useDeleteWishlistItems();
  const { data: reviewsData } = useReviews(id);
  const { data: stockInfo, isLoading: stockLoading } = useSingleProductStock(id);

  const wishlistItems = wishlistResponse?.data ?? [];
  const isInWishlist = wishlistItems.some((item) => item.product.id === id);

  const displayImage = (() => {
    if (Array.isArray(images) && images.length > 0) {
      const primary = images.find((img) => img.isPrimary) ?? images[0];
      return primary?.url || PLACEHOLDER_IMAGE;
    }
    return PLACEHOLDER_IMAGE;
  })();

  const avgRating = reviewsData?.meta?.stats?.averageRating ?? 0;
  const reviewCount = reviewsData?.meta?.total ?? 0;
  const discountPercent = discountedPrice && discountedPrice < price 
    ? calculateDiscountPercentage(price, discountedPrice) 
    : 0;

  const handleWishlistToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (isInWishlist) {
        await deleteWishlist.mutateAsync(id);
        await refetchWishlist();
        toast.success("Removed from wishlist");
      } else {
        await createWishlist.mutateAsync(id);
        await refetchWishlist();
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Unable to update wishlist right now");
    }
  };

  const stockStatus = () => {
    if (stockLoading) {
      return <Skeleton className="h-5 w-24" />;
    }
    
    if (!stockInfo) return null;

    const { stockQuantity, lowStockThreshold } = stockInfo;

    if (stockQuantity === 0) {
      return (
        <Badge variant="destructive" className="text-xs font-medium">
          Out of Stock
        </Badge>
      );
    }

    if (stockQuantity <= lowStockThreshold) {
      return (
        <Badge className="text-xs font-medium bg-orange-500 hover:bg-orange-600">
          Only {stockQuantity} Left
        </Badge>
      );
    }

    if (stockQuantity <= 10) {
      return (
        <Badge variant="secondary" className="text-xs font-medium bg-yellow-50 text-yellow-700 border-yellow-200">
          Low Stock
        </Badge>
      );
    }

    return null;
  };

  return (
    <Link href={`/products/${id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 pb-10 pt-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 320px, 100vw"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground shadow-md text-xs px-2 py-0.5">
              -{discountPercent}%
            </Badge>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            disabled={createWishlist.isPending || deleteWishlist.isPending}
            className={cn(
              "absolute top-2 right-2 h-7 w-7 rounded-full border backdrop-blur-sm transition-all duration-200",
              isInWishlist 
                ? "border-primary/50 bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-110" 
                : "border-border/50 bg-background/70 text-muted-foreground hover:bg-background/90 hover:text-foreground hover:scale-110"
            )}
          >
            <FiHeart
              className="h-3 w-3 transition-transform"
              style={isInWishlist ? { fill: "currentColor" } : undefined}
            />
          </Button>

          {/* Stock Status Overlay */}
          {stockInfo?.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="text-xs font-semibold px-3">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col px-3.5 space-y-2">
          {/* Category Badge */}
          {category?.name && (
            <Badge variant="secondary" className="w-fit text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 bg-secondary/80">
              {category.name}
            </Badge>
          )}

          {/* Product Name and Price Row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              {discountedPrice && discountedPrice < price ? (
                <>
                  <p className="text-lg font-bold text-foreground leading-tight whitespace-nowrap">
                    {formatCurrency(discountedPrice)}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-through leading-tight whitespace-nowrap">
                    {formatCurrency(price)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-foreground whitespace-nowrap">
                  {formatCurrency(price)}
                </p>
              )}
            </div>
          </div>

          {/* Rating and Stock in same row */}
          <div className="flex items-center justify-between gap-1.5">
            {avgRating > 0 && (
              <div className="flex items-center gap-1">
                <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ({reviewCount})
                </span>
              </div>
            )}
            {stockStatus()}
          </div>

          {/* Save Badge */}
          {discountedPrice && discountedPrice < price && (
            <Badge variant="secondary" className="text-[10px] font-semibold bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 w-fit">
              Save ₹{(price - discountedPrice).toLocaleString()}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}


const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';

export default ProductCard;
