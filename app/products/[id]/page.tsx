"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import { useProduct } from "@/app/hooks/useProducts";
import { useReviews } from "@/app/hooks/useReviews";
import { useAddToCart } from "@/app/hooks/useCart";
import Button from "@/app/components/ui/Button";
import ProductReviews from "@/app/components/ui/ProductReviews";
import {
  FaTruck,
  FaCreditCard,
  FaShieldAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import Image from "next/image";
import { useWishlist, useCreateWishlistItems, useDeleteWishlistItems } from "@/app/hooks/useWishlist";
import { toast } from "react-hot-toast";
import { IWishlistItem } from "@/app/types/wishlist.type";

type Params = { id: string };

export default function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useProduct(id);
  const { data: reviewsData } = useReviews(id);
  const { data: wishlistResponse } = useWishlist();
  const createWishlistMutation = useCreateWishlistItems();
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { addItemToCart, loading: cartLoading } = useAddToCart();

  // State management
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Check if product is in wishlist
  const wishlistItems = wishlistResponse?.data || [];
  const isWishlisted = wishlistItems.some((item: IWishlistItem) => item.product.id === id);

  // Derive sizes from variants if not available
  const sizes = product?.sizes || [
    ...new Set(product?.variants?.map((v) => v.size) || []),
  ];

  // Fallback data for missing properties
  const companyFeatures = product?.companyFeatures || [
    {
      icon: "truck",
      title: "Free Shipping",
      description: "Free shipping on orders over ₹999",
    },
    {
      icon: "credit-card",
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: "shield",
      title: "Easy Returns",
      description: "30-day return policy",
    },
  ];

  const deliveryInfo = product?.deliveryInfo || {
    estimatedDays: "3-5",
    shippingFee: 0,
    returnPeriod: 30,
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!product) {
      toast.error("Product not found");
      return;
    }

    try {
      // Find the variant for the selected size
      const selectedVariant = product.variants?.find(v => v.size === selectedSize);
      
      await addItemToCart({
        productId: product.id,
        quantity: quantity,
        variantId: selectedVariant?.id
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!product) {
      toast.error("Product not found");
      return;
    }

    try {
      // Find the variant for the selected size
      const selectedVariant = product.variants?.find(v => v.size === selectedSize);
      
      await addItemToCart({
        productId: product.id,
        quantity: quantity,
        variantId: selectedVariant?.id
      });
      
      // Redirect to checkout
      window.location.href = '/checkout';
    } catch (error) {
      console.error("Failed to buy now:", error);
    }
  };

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
          i < rating ? "text-yellow-400" : "text-gray-200"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const images = product.images || [
    { url: "/images/coming-soon.jpg", alt: product.name },
  ];
  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 mt-30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden group">
            <Image
              src={images[selectedImageIndex]?.url || "/images/coming-soon.jpg"}
              alt={images[selectedImageIndex]?.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Add to wishlist"
              disabled={createWishlistMutation.isPending || deleteWishlistMutation.isPending}
            >
              {isWishlisted ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Share Button */}
            <button
              className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Share product"
            >
              <FaShare className="w-5 h-5 text-gray-600" />
            </button>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {discountPercentage}% OFF
              </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    handleImageChange(Math.max(0, selectedImageIndex - 1))
                  }
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() =>
                    handleImageChange(
                      Math.min(images.length - 1, selectedImageIndex + 1)
                    )
                  }
                  disabled={selectedImageIndex === images.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl font-bold text-gray-900">
                ₹{product.discountedPrice || product.price}
              </p>
              {product.discountedPrice && (
                <p className="text-xl text-gray-500 line-through">
                  ₹{product.price}
                </p>
              )}
              {discountPercentage > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                  Save ₹{product.price - product.discountedPrice!}
                </span>
              )}
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(
                  reviewsData?.meta?.stats?.averageRating || 0,
                  "lg"
                )}
                <div className="text-left">
                  <span className="text-2xl font-bold text-gray-900">
                    {reviewsData?.meta?.stats?.averageRating?.toFixed(1) ||
                      "0.0"}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">out of 5</span>
                  <div className="text-sm text-gray-600">
                    {reviewsData?.meta?.total || 0}{" "}
                    {reviewsData?.meta?.total === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {product.stockQuantity || 0} in stock
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-gray-900">
                Select Size
              </label>
              <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-6 py-3 border-2 font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Size {selectedSize} selected
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="space-y-4">
            <label className="block font-semibold text-gray-900">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-4 text-lg font-semibold"
                disabled={!selectedSize || cartLoading}
              >
                {cartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleBuyNow}
                className="flex-1 py-4 text-lg font-semibold"
                disabled={!selectedSize || cartLoading}
              >
                {cartLoading ? "Processing..." : "Buy Now"}
              </Button>
            </div>
            {!selectedSize && (
              <p className="text-sm text-red-600 text-center">
                Please select a size to continue
              </p>
            )}
          </div>

          {/* Company Features */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Why Shop With Us</h2>
            <div className="grid grid-cols-1 gap-4">
              {companyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {feature.icon === "truck" && (
                      <FaTruck className="w-5 h-5 text-gray-600" />
                    )}
                    {feature.icon === "credit-card" && (
                      <FaCreditCard className="w-5 h-5 text-gray-600" />
                    )}
                    {feature.icon === "shield" && (
                      <FaShieldAlt className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                <h2 className="text-xl font-semibold">Delivery & Returns</h2>
                <IoMdArrowDropdown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                    <p className="text-sm">
                      {deliveryInfo.estimatedDays} business days
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-1">Shipping</h3>
                    <p className="text-sm">
                      {deliveryInfo.shippingFee === 0
                        ? "Free shipping"
                        : `₹${deliveryInfo.shippingFee} shipping fee`}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-1">Returns</h3>
                    <p className="text-sm">
                      {deliveryInfo.returnPeriod} days return policy
                    </p>
                  </div>
                </div>
              </div>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                <h2 className="text-xl font-semibold">Product Details</h2>
                <IoMdArrowDropdown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.material && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Material
                      </h3>
                      <p className="text-gray-600">{product.material}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Dimensions
                      </h3>
                      <p className="text-gray-600">{product.dimensions}</p>
                    </div>
                  )}
                </div>
                {product.care && product.care.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Care Instructions
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      {product.care.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                <h2 className="text-xl font-semibold">Features</h2>
                <IoMdArrowDropdown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6">
                {product.features && product.features.length > 0 ? (
                  <ul className="text-gray-600 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No features listed</p>
                )}
              </div>
            </details>
          </div>

          {/* Reviews Section */}
          <ProductReviews
            productId={product.id}
            showSummary={false}
            showAddButton={true}
          />
        </div>
      </div>
    </div>
  );
}
