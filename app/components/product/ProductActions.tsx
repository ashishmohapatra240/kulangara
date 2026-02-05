"use client";

import { useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { FaCheck, FaMinus, FaPlus, FaShoppingBag, FaBolt } from "react-icons/fa";
import SizeGuideModal from "@/app/components/ui/SizeGuideModal";

interface StockInfo {
  stockQuantity: number;
  lowStockThreshold: number;
}

interface ProductActionsProps {
  sizes: string[];
  onAddToCart: (selectedSize: string, quantity: number) => void;
  onBuyNow: (selectedSize: string, quantity: number) => void;
  stockInfo?: StockInfo;
  stockLoading: boolean;
  cartLoading: boolean;
}

export default function ProductActions({
  sizes,
  onAddToCart,
  onBuyNow,
  stockInfo,
  stockLoading,
  cartLoading,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }, []);

  const getStockDisplay = useCallback(() => {
    if (stockLoading)
      return <Badge variant="secondary">Checking stock...</Badge>;
    if (!stockInfo)
      return <Badge variant="secondary">Stock info unavailable</Badge>;

    const { stockQuantity, lowStockThreshold } = stockInfo;

    if (stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockQuantity <= lowStockThreshold) {
      return (
        <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
          Only {stockQuantity} left!
        </Badge>
      );
    } else if (stockQuantity <= 10) {
      return (
        <Badge variant="outline" className="border-yellow-500/50 bg-yellow-50 text-yellow-700">
          Low stock ({stockQuantity} available)
        </Badge>
      );
    }

    return <Badge variant="outline" className="border-green-500/50 bg-green-50 text-green-700">In Stock</Badge>;
  }, [stockInfo, stockLoading]);

  const handleAddToCartClick = useCallback(() => {
    onAddToCart(selectedSize, quantity);
  }, [selectedSize, quantity, onAddToCart]);

  const handleBuyNowClick = useCallback(() => {
    onBuyNow(selectedSize, quantity);
  }, [selectedSize, quantity, onBuyNow]);

  const isOutOfStock = stockInfo?.stockQuantity === 0;
  const maxQuantity = stockInfo ? Math.min(10, stockInfo.stockQuantity) : 10;

  return (
    <>
      <div className="space-y-6">
        {/* Stock Status */}
        <div className="flex items-center gap-4">
          {getStockDisplay()}
        </div>

        <Separator />

        {/* Size Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-semibold">
              Select Size
            </label>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsSizeGuideOpen(true)}
              className="h-auto p-0 text-sm text-primary hover:text-primary/80"
            >
              Size Guide
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => handleSizeSelect(size)}
                className={`min-w-[3.5rem] h-12 font-semibold transition-all ${
                  selectedSize === size
                    ? "ring-2 ring-primary/20 shadow-md"
                    : "hover:border-primary/50"
                }`}
                disabled={isOutOfStock}
              >
                {size}
              </Button>
            ))}
          </div>
          {selectedSize && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <FaCheck className="text-green-600" />
              Size {selectedSize} selected
            </div>
          )}
        </div>

        <Separator />

        {/* Quantity Selection */}
        <div className="space-y-4">
          <label className="text-base font-semibold">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="h-11 w-11 rounded-lg hover:bg-muted transition-colors"
            >
              <FaMinus className="w-3.5 h-3.5" />
            </Button>
            <span className="w-20 text-center text-xl font-bold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity || isOutOfStock}
              className="h-11 w-11 rounded-lg hover:bg-muted transition-colors"
            >
              <FaPlus className="w-3.5 h-3.5" />
            </Button>
            {stockInfo && stockInfo.stockQuantity > 0 && (
              <span className="text-sm text-muted-foreground ml-2">
                Max {maxQuantity} per order
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={handleAddToCartClick}
              disabled={cartLoading || !selectedSize || isOutOfStock}
              className="flex-1 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FaShoppingBag className="mr-2 h-5 w-5" />
              {cartLoading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleBuyNowClick}
              disabled={cartLoading || !selectedSize || isOutOfStock}
              className="flex-1 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-orange-500 hover:bg-orange-600 text-white"
            >
              <FaBolt className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </div>
          {!selectedSize && (
            <p className="text-sm text-muted-foreground text-center">
              Please select a size to continue
            </p>
          )}
          {isOutOfStock && (
            <p className="text-sm text-destructive text-center font-medium">
              This item is currently out of stock
            </p>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
}
