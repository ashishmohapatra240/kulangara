"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  discountPercentage: number;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  wishlistLoading: boolean;
}

export default function ProductGallery({
  images,
  productName,
  discountPercentage,
  isWishlisted,
  onWishlistToggle,
  wishlistLoading,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageChange = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedImageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  const currentImage = images[selectedImageIndex] || {
    url: "/images/coming-soon.jpg",
    alt: productName,
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/20 group border border-border/40">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onWishlistToggle}
          className={`absolute top-5 right-5 h-11 w-11 rounded-full backdrop-blur-md border transition-all duration-200 shadow-lg ${
            isWishlisted
              ? "bg-primary/90 border-primary/50 text-primary-foreground hover:bg-primary hover:scale-110"
              : "bg-background/80 border-border/60 text-muted-foreground hover:bg-background hover:text-foreground hover:scale-110"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          disabled={wishlistLoading}
        >
          {isWishlisted ? (
            <FaHeart className="w-5 h-5" />
          ) : (
            <FaRegHeart className="w-5 h-5" />
          )}
        </Button>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-5 left-5 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1.5 shadow-lg">
            -{discountPercentage}% OFF
          </Badge>
        )}

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              disabled={selectedImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-md border border-border/60 hover:bg-background shadow-lg disabled:opacity-40 transition-all hover:scale-110"
            >
              <FaChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              disabled={selectedImageIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 backdrop-blur-md border border-border/60 hover:bg-background shadow-lg disabled:opacity-40 transition-all hover:scale-110"
            >
              <FaChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleImageChange(index)}
              className={`relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-border/40 hover:border-primary/50 hover:scale-105"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
