"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/app/types/product.type";
import { Button } from "./button";
import productsService from "@/app/services/products.service";

const PLACEHOLDER_IMAGE =
  "/images/coming-soon.jpg";

export default function WishlistCard({
  item,
  removeFromWishlist,
  moveToCart,
}: {
  item: IProduct;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string, variantId?: string) => void;
}) {
  // If wishlist payload is partial (no sizes/variants), fetch full product
  const [resolvedProduct, setResolvedProduct] = useState<IProduct | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;
    const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
    if (!hasSizes && !hasVariants) {
      setLoadingDetails(true);
      productsService
        .getProductById(item.id)
        .then((p) => setResolvedProduct(p))
        .finally(() => setLoadingDetails(false));
    }
  }, [item]);

  const productData = resolvedProduct || item;

  // Prefer primary image from images array, fallback to image string, then placeholder
  let displayImage = PLACEHOLDER_IMAGE;
  if (Array.isArray(item.images) && item.images.length > 0) {
    const primary = item.images.find((img) => img.isPrimary) || item.images[0];
    displayImage = primary?.url || PLACEHOLDER_IMAGE;
  } else if (item.image) {
    displayImage = item.image;
  }

  const sizeOptions = (productData.sizes && productData.sizes.length > 0)
    ? productData.sizes
    : Array.from(
      new Set((productData.variants || []).map((v) => v.size).filter(Boolean))
    );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeOptions.length === 1 ? sizeOptions[0] || null : null
  );
  const selectedVariantId = selectedSize
    ? productData.variants?.find((v) => v.size === selectedSize)?.id
    : undefined;

  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 hover:border-gray-300 transition-colors">
      <Link
        href={`/products/${item.id}`}
        className="block w-24 h-24 relative flex-shrink-0"
      >
        <Image src={displayImage} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex-grow min-w-0">
        <Link href={`/products/${item.id}`}>
          <h2 className="text-base font-medium hover:underline truncate">{item.name}</h2>
        </Link>
        <p className="text-base mt-1 font-semibold">
          {item.discountedPrice && item.discountedPrice < item.price ? (
            <>
              Rs. {item.discountedPrice.toLocaleString()}.00{' '}
              <span className="text-gray-500 line-through text-sm">Rs. {item.price.toLocaleString()}.00</span>
            </>
          ) : (
            <>Rs. {item.price.toLocaleString()}.00</>
          )}
        </p>

        {sizeOptions.length > 0 && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-2">Select Size</div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border text-sm ${isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3">
          <Button
            onClick={() => moveToCart(item.id, selectedVariantId)}
            size="sm"
            className="px-4 py-2 text-sm"
            disabled={(productData.variants?.length || 0) > 0 && !selectedVariantId}
          >
            Move to Cart
          </Button>
          <button
            onClick={() => removeFromWishlist(item.id)}
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Remove
          </button>
        </div>
        {loadingDetails && (
          <div className="mt-2 text-sm text-gray-500">Loading size options…</div>
        )}
      </div>
    </div>
  );
}
