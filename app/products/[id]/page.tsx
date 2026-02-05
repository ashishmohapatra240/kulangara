"use client";

import { notFound } from "next/navigation";
import { use, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/app/hooks/useProducts";
import { useReviews } from "@/app/hooks/useReviews";
import { useAddToCart } from "@/app/hooks/useCart";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchCart } from "@/app/store/slices/cartSlice";
import ProductReviews from "@/app/components/ui/ProductReviews";
import ProductGallery from "@/app/components/product/ProductGallery";
import ProductInfo from "@/app/components/product/ProductInfo";
import ProductActions from "@/app/components/product/ProductActions";
import {
  FaTruck,
  FaCreditCard,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import {
  useWishlist,
  useCreateWishlistItems,
  useDeleteWishlistItems,
} from "@/app/hooks/useWishlist";
import { useSingleProductStock } from "@/app/hooks/useCartValidation";
import { toast } from "react-hot-toast";
import { IWishlistItem } from "@/app/types/wishlist.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import SizeGuideModal from "@/app/components/ui/SizeGuideModal";

type Params = { id: string };

export default function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: reviewsData } = useReviews(id);
  const { data: wishlistResponse } = useWishlist();
  const createWishlistMutation = useCreateWishlistItems();
  const deleteWishlistMutation = useDeleteWishlistItems();
  const { addItemToCart, loading: cartLoading } = useAddToCart();
  const { data: stockInfo, isLoading: stockLoading } = useSingleProductStock(id);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const wishlistItems = wishlistResponse?.data || [];
  const isWishlisted = useMemo(
    () => wishlistItems.some((item: IWishlistItem) => item.product.id === id),
    [wishlistItems, id]
  );

  // Derive and sort sizes
  const sizes = useMemo(() => {
    const rawSizes = product?.sizes || [
      ...new Set(product?.variants?.map((v) => v.size) || []),
    ];

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    return [...rawSizes].sort((a, b) => {
      const aIndex = sizeOrder.findIndex(size => size.toUpperCase() === a.toUpperCase());
      const bIndex = sizeOrder.findIndex(size => size.toUpperCase() === b.toUpperCase());

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [product]);

  const companyFeatures = useMemo(
    () =>
      product?.companyFeatures || [
        {
          icon: "truck",
          title: "Free Shipping",
          description: "Free shipping on all orders",
        },
        {
          icon: "credit-card",
          title: "Secure Payment",
          description: "100% secure payment processing",
        },
        {
          icon: "shield",
          title: "Easy Returns",
          description: "7-day return policy",
        },
      ],
    [product]
  );

  const deliveryInfo = useMemo(
    () =>
      product?.deliveryInfo || {
        estimatedDays: "8-10",
        shippingFee: 0,
        returnPeriod: 7,
      },
    [product]
  );

  const handleWishlistToggle = useCallback(async () => {
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
  }, [isWishlisted, deleteWishlistMutation, id, createWishlistMutation]);

  const handleAddToCart = useCallback(
    async (selectedSize: string, quantity: number) => {
      if (!selectedSize) {
        toast.error("Please select a size");
        return;
      }

      if (!product) {
        toast.error("Product not found");
        return;
      }

      // Check stock availability before adding to cart
      if (stockInfo && stockInfo.stockQuantity === 0) {
        toast.error("This item is out of stock");
        return;
      }

      if (stockInfo && quantity > stockInfo.stockQuantity) {
        toast.error(`Only ${stockInfo.stockQuantity} items available`);
        return;
      }

      try {
        const selectedVariant = product.variants?.find(
          (v) => v.size === selectedSize
        );

        await addItemToCart({
          productId: product.id,
          quantity: quantity,
          variantId: selectedVariant?.id,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message?.includes("Insufficient stock")
        ) {
          toast.error(
            "This item is no longer available in the requested quantity."
          );
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error("Failed to add to cart:", error);
          }
        }
      }
    },
    [product, stockInfo, addItemToCart]
  );

  const handleBuyNow = useCallback(
    async (selectedSize: string, quantity: number) => {
      if (!selectedSize) {
        toast.error("Please select a size");
        return;
      }

      if (!product) {
        toast.error("Product not found");
        return;
      }

      // Check stock availability before buying
      if (stockInfo && stockInfo.stockQuantity === 0) {
        toast.error("This item is out of stock");
        return;
      }

      if (stockInfo && quantity > stockInfo.stockQuantity) {
        toast.error(`Only ${stockInfo.stockQuantity} items available`);
        return;
      }

      try {
        // Find the variant for the selected size
        const selectedVariant = product.variants?.find(
          (v) => v.size === selectedSize
        );

        // Add item to cart and wait for it to complete
        await addItemToCart({
          productId: product.id,
          quantity: quantity,
          variantId: selectedVariant?.id,
        });

        // Fetch the latest cart state to ensure it's synced
        await dispatch(fetchCart()).unwrap();

        // Navigate to checkout using Next.js router
        router.push("/checkout");
      } catch (error) {
        if (
          error instanceof Error &&
          error.message?.includes("Insufficient stock")
        ) {
          toast.error(
            "This item is no longer available in the requested quantity."
          );
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error("Failed to buy now:", error);
          }
          toast.error("Failed to proceed to checkout. Please try again.");
        }
      }
    },
    [product, stockInfo, addItemToCart, dispatch, router]
  );

  const images = useMemo(
    () =>
      product?.images || [
        { id: "placeholder", url: "/images/coming-soon.jpg", alt: product?.name || "Product", isPrimary: true },
      ],
    [product]
  );

  const discountPercentage = useMemo(
    () =>
      product?.discountedPrice
        ? Math.round(
          ((product.price - product.discountedPrice) / product.price) * 100
        )
        : 0,
    [product]
  );

  const wishlistLoading =
    createWishlistMutation.isPending || deleteWishlistMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:py-12 mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Image Gallery Skeleton - 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-14 rounded-lg" />
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Product Image Gallery - 3 columns */}
          <div className="lg:col-span-3">
            <ProductGallery
              images={images}
              productName={product.name}
              discountPercentage={discountPercentage}
              isWishlisted={isWishlisted}
              onWishlistToggle={handleWishlistToggle}
              wishlistLoading={wishlistLoading}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ProductInfo
              name={product.name}
              price={product.price}
              discountedPrice={product.discountedPrice}
              description={product.description}
              reviewsData={reviewsData}
            />

            <Separator />

            <ProductActions
              sizes={sizes}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              stockInfo={stockInfo}
              stockLoading={stockLoading}
              cartLoading={cartLoading}
            />

            <Separator />

            {/* Company Features */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Why Shop With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {feature.icon === "truck" && (
                        <FaTruck className="w-5 h-5" />
                      )}
                      {feature.icon === "credit-card" && (
                        <FaCreditCard className="w-5 h-5" />
                      )}
                      {feature.icon === "shield" && (
                        <FaShieldAlt className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h4 className="font-semibold text-sm mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Information Accordion */}
            <Accordion type="single" collapsible className="w-full border border-border/60 rounded-xl overflow-hidden">
              <AccordionItem value="delivery" className="border-b">
                <AccordionTrigger className="text-base font-semibold px-6 hover:no-underline hover:bg-muted/50">
                  Delivery & Returns
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <FaTruck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Estimated Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          {deliveryInfo.estimatedDays} business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <FaCreditCard className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Shipping Cost</h4>
                        <p className="text-sm text-muted-foreground">
                          {deliveryInfo.shippingFee === 0
                            ? "Free shipping on this order"
                            : `₹${deliveryInfo.shippingFee} shipping fee`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <FaShieldAlt className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Return Policy</h4>
                        <p className="text-sm text-muted-foreground">
                          {deliveryInfo.returnPeriod} days hassle-free returns
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="details" className="border-b">
                <AccordionTrigger className="text-base font-semibold px-6 hover:no-underline hover:bg-muted/50">
                  Product Details
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.material && (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">
                            Material
                          </h4>
                          <p className="text-sm text-muted-foreground">{product.material}</p>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">
                            Dimensions
                          </h4>
                          <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                        </div>
                      )}
                    </div>
                    {product.care && product.care.length > 0 && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold text-sm mb-3">
                          Care Instructions
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          {product.care.map((instruction, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <FaCheck className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features" className="border-none">
                <AccordionTrigger className="text-base font-semibold px-6 hover:no-underline hover:bg-muted/50">
                  Features & Highlights
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-4">
                    {product.features && product.features.length > 0 ? (
                      <ul className="space-y-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <FaCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No features listed</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="mt-16">
          <Separator className="mb-12" />

          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Customer Reviews
              </h2>
              <p className="text-muted-foreground">
                See what our customers are saying about this product
              </p>
            </div>

            <ProductReviews
              productId={product.id}
              showSummary={true}
              showAddButton={true}
            />
          </div>
        </div>

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      </div>
    </div>
  );
}
