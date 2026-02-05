"use client";

import { useMemo } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { FaStar } from "react-icons/fa";

interface ReviewStats {
  averageRating: number;
}

interface ReviewMeta {
  total: number;
  stats: ReviewStats;
}

interface ReviewsData {
  meta: ReviewMeta;
}

interface ProductInfoProps {
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  reviewsData?: ReviewsData;
}

export default function ProductInfo({
  name,
  price,
  discountedPrice,
  description,
  reviewsData,
}: ProductInfoProps) {
  const renderStars = useMemo(() => {
    const rating = reviewsData?.meta?.stats?.averageRating || 0;
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

      return (
        <FaStar
          key={index}
          className={`h-4 w-4 ${
            filled || halfFilled
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      );
    });
  }, [reviewsData]);

  const savings = useMemo(() => {
    if (discountedPrice && discountedPrice < price) {
      return price - discountedPrice;
    }
    return 0;
  }, [price, discountedPrice]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
          {name}
        </h1>

        {/* Price Section */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            {discountedPrice && discountedPrice < price ? (
              <>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-foreground">
                    ₹{discountedPrice.toLocaleString()}
                  </p>
                  <p className="text-xl text-muted-foreground line-through">
                    ₹{price.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-bold text-foreground">
                  ₹{price.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
              </>
            )}
          </div>
          {savings > 0 && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-3 py-1.5">
              Save ₹{savings.toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Rating Row */}
        {reviewsData?.meta?.stats?.averageRating && reviewsData.meta.stats.averageRating > 0 ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars}
              </div>
              <span className="text-sm font-semibold">
                {reviewsData.meta.stats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({reviewsData.meta.total} {reviewsData.meta.total === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Product Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
