import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "@/app/types/profile.type";
import { ICoupon } from "@/app/types/coupon.type";
import { ICheckoutFormData } from "@/app/types/checkout.type";
import cartService from "@/app/services/cart.service";
import productsService from "@/app/services/products.service";
import { ProfileService } from "@/app/services/profile.service";
import couponService from "@/app/services/coupon.service";
import orderService from "@/app/services/order.service";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { getErrorMessage } from "@/app/lib/utils";
import { useRazorpayPayment } from "./useRazorpayPayment";
import { useAppDispatch } from "../store/hooks";
import {
  clearCart as clearCartThunk,
  fetchCart as fetchCartThunk,
} from "../store/slices/cartSlice";

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const {
    processRazorpayPaymentFromCart,
    paymentStatus,
    resetPaymentStatus,
  } = useRazorpayPayment();
  const dispatch = useAppDispatch();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response = await cartService.getCart();
        return response.data.items;
      } catch (error) {
        toast.error(getErrorMessage(error as AxiosError));
        return [];
      }
    },
  });
  const cartItems = useMemo(() => {
    try {
      const items = cartData || [];
      return items;
    } catch (error) {
      toast.error(getErrorMessage(error as AxiosError));
      return [];
    }
  }, [cartData]);

  const {
    data: addressesData,
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await ProfileService.getAddresses();
      return response.data.addresses;
    },
  });
  const addresses: IAddress[] = useMemo(
    () => addressesData || [],
    [addressesData]
  );

  useEffect(() => {
    if (addressesData && addressesData.length > 0) {
      const defaultAddress = addressesData.find(
        (addr: IAddress) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [addressesData]);

  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);

  const couponMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await couponService.validateCoupon(code);
      if (response.status === "success" && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Invalid coupon code");
      }
    },
    onSuccess: (coupon: ICoupon, code: string) => {
      setAppliedCoupon(coupon);
      setCouponCode(code);
      toast.success("Coupon applied!");
      couponMutation.reset();
    },
    onError: (error: Error | AxiosError) => {
      setAppliedCoupon(null);
      toast.error(getErrorMessage(error as AxiosError));
    },
  });

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return false;
    try {
      await couponMutation.mutateAsync(code);
      return true;
    } catch {
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    couponMutation.reset();
  };

  const orderMutation = useMutation({
    mutationFn: async ({
      paymentMethod,
      formData,
    }: {
      paymentMethod: string;
      formData?: ICheckoutFormData;
    }) => {
      if (!selectedAddressId && !formData?.firstName) {
        throw new Error(
          "Please select a shipping address or fill in address details"
        );
      }
      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }
      let addressId = selectedAddressId;
      if (!selectedAddressId && formData?.firstName) {
        try {
          const addressResponse = await ProfileService.createAddress({
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
            isDefault: addresses && addresses.length === 0,
          });
          addressId =
            addressResponse.data.addresses[
              addressResponse.data.addresses.length - 1
            ].id;
        } catch {
          throw new Error("Failed to create address. Please try again.");
        }
      }
      const orderData = {
        shippingAddressId: addressId,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cartItems.map((item) => {
          const orderItem: {
            productId: string;
            quantity: number;
            variantId?: string;
          } = {
            productId: item.productId,
            quantity: item.quantity,
          };
          if (item.variantId) {
            orderItem.variantId = item.variantId;
          }
          return orderItem;
        }),
        couponCode: appliedCoupon?.code,
        ...(paymentMethod.toUpperCase() === 'COD' ? {
          status: 'CONFIRMED' as const,
          paymentStatus: 'PENDING' as const
        } : {
          status: 'PENDING' as const,
          paymentStatus: 'PENDING' as const
        }),
      };
      try {
        const response = await orderService.createOrder(orderData);

        if (response.status === "success") {
          return response.data.order;
        }
        throw new Error(response.message || "Failed to create order");
      } catch (orderError) {
        if (orderError instanceof Error) {
          if (orderError.message?.includes('Insufficient stock') || 
              orderError.message?.includes('out of stock') ||
              orderError.message?.includes('Stock reservation failed')) {
            throw new Error('Some items in your cart are no longer available. Please review your cart and try again.');
          }
        }
        throw orderError;
      }
    },
    onSuccess: () => {
      dispatch(fetchCartThunk());
    },
    onError: (error: Error | AxiosError) => {
      toast.error(getErrorMessage(error as AxiosError));
      orderMutation.reset();
    },
  });

  const createOrder = async (
    paymentMethod: string,
    formData?: ICheckoutFormData
  ) => {
    orderMutation.reset();
    resetPaymentStatus();

    try {
      const normalizedMethod = paymentMethod.toLowerCase();

      if (normalizedMethod === "razorpay") {
        if (!selectedAddressId && !formData?.firstName) {
          throw new Error(
            "Please select a shipping address or fill in address details"
          );
        }
        if (cartItems.length === 0) {
          throw new Error("Your cart is empty");
        }

        const userEmail = formData?.email || "";
        let userPhone = formData?.phone || "";

        if (!userPhone && selectedAddressId) {
          const selectedAddr = addresses.find(
            (addr) => addr.id === selectedAddressId
          );
          if (selectedAddr) {
            userPhone = selectedAddr.phone || "";
          }
        }

        let currentCartItems = cartItems;
        try {
          const response = await cartService.getCart();
          if (response.data && response.data.items) {
            currentCartItems = response.data.items;
            console.log(
              "Fresh cart data fetched for payment:",
              currentCartItems.length,
              "items"
            );
          }
        } catch (refreshError) {
          console.warn(
            "Failed to fetch fresh cart data, using current data:",
            refreshError
          );
          currentCartItems = cartItems;
        }

        console.log(
          "Cart items for payment processing:",
          currentCartItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            hasVariant: !!item.variant,
            hasProduct: !!item.product,
            variantPrice: item.variant?.price,
            productPrice: item.product?.price,
            productDiscountedPrice: item.product?.discountedPrice,
          }))
        );

        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        const cartItemsWithCurrentPrices = await Promise.all(
          currentCartItems.map(async (item, index) => {
            let currentPrice = item.price; // fallback to cart price

            try {
              console.log(`🔍 Fetching product details for: ${item.productId}`);
              const product = await productsService.getProductById(
                item.productId
              );
              console.log(`📦 Product fetched:`, {
                id: product.id,
                name: product.name,
                price: product.price,
                discountedPrice: product.discountedPrice,
                variantsCount: product.variants?.length || 0,
              });

              if (item.variantId && product.variants) {
                console.log(
                  `🔍 Looking for variant: ${item.variantId} in ${product.variants.length} variants`
                );
                console.log(`📝 Available variants (full):`, product.variants);
                console.log(
                  `📝 Available variants (summary):`,
                  product.variants.map((v) => ({
                    id: v.id,
                    price: v.price,
                    sku: v.sku,
                    size: v.size,
                    color: v.color,
                  }))
                );

                const variant = product.variants.find((v) => {
                  console.log(
                    `Comparing: "${v.id}" === "${item.variantId}" → ${
                      v.id === item.variantId
                    }`
                  );
                  return v.id === item.variantId;
                });

                console.log(`🔍 Found variant:`, variant);

                if (variant) {
                  console.log(
                    `📊 Variant price type: ${typeof variant.price}, value: ${
                      variant.price
                    }`
                  );
                  if (typeof variant.price === "number") {
                    currentPrice = variant.price;
                    console.log(
                      `✅ Using current database variant price: ${currentPrice} for variant ${variant.id}`
                    );
                  } else {
                    console.warn(
                      `⚠️ Variant has null/invalid price, falling back to product base price`
                    );

                    if (typeof product.price === "number") {
                      currentPrice = product.price;
                      console.log(
                        `✅ Using product base price as fallback: ${currentPrice}`
                      );
                    } else if (typeof product.discountedPrice === "number") {
                      currentPrice = product.discountedPrice;
                      console.log(
                        `✅ Using product discounted price as fallback: ${currentPrice}`
                      );
                    } else {
                      console.error(
                        `❌ Both variant and product prices are invalid!`
                      );
                      console.warn(
                        `⚠️ Using cart price fallback: ${currentPrice}`
                      );
                    }
                  }
                } else {
                  console.error(
                    `❌ Variant ${item.variantId} not found in variants!`
                  );
                  console.log(
                    `Available variant IDs:`,
                    product.variants.map((v) => v.id)
                  );
                  console.warn(`⚠️ Using cart price fallback: ${currentPrice}`);
                }
              } else {
                if (typeof product.discountedPrice === "number") {
                  currentPrice = product.discountedPrice;
                  console.log(
                    `✅ Using current database discounted price: ${currentPrice}`
                  );
                } else if (typeof product.price === "number") {
                  currentPrice = product.price;
                  console.log(
                    `✅ Using current database product price: ${currentPrice}`
                  );
                } else {
                  console.warn(
                    `⚠️ Product ${item.productId} has invalid price, using cart price: ${currentPrice}`
                  );
                }
              }
            } catch (priceError) {
              console.error(
                `❌ Failed to fetch current price for item ${index}:`,
                priceError
              );
              console.log(`Using cart price fallback: ${currentPrice}`);
            }

            if (typeof currentPrice !== "number" || currentPrice <= 0) {
              console.error(`Invalid price for cart item ${index}:`, {
                item,
                currentPrice,
                productId: item.productId,
                variantId: item.variantId,
                cartPrice: item.price,
              });
              throw new Error(
                `Invalid price for item: ${
                  item.product?.name || "Unknown product"
                }`
              );
            }

            const cartItem = {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: currentPrice,
            };

            console.log(
              `Cart item being sent with current DB price:`,
              cartItem
            );
            return cartItem;
          })
        );

        const cartData = {
          items: cartItemsWithCurrentPrices,
          subtotal,
          tax,
          discount,
          total,
          couponCode: appliedCoupon?.code,
          shippingAddressId: selectedAddressId,
        };

        const paymentResult = await processRazorpayPaymentFromCart(
          cartData,
          userEmail,
          userPhone
        );

        if (!paymentResult.success) {
          throw new Error("Payment failed or cancelled");
        }

        try {
          await dispatch(clearCartThunk()).unwrap();
        } catch {
          // ignore
        }
        dispatch(fetchCartThunk());
        toast.success("Order placed successfully!");

        return {
          id: paymentResult.orderId,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
        };
      }

      if (normalizedMethod === "cod") {
        // COD: order is created with CONFIRMED status and PENDING payment status
        const order = await orderMutation.mutateAsync({
          paymentMethod,
          formData,
        });

        try {
          await dispatch(clearCartThunk()).unwrap();
        } catch {
          // ignore
        }
        dispatch(fetchCartThunk());
        toast.success("Order placed successfully!");

        // Return the order as-is since status is set correctly by backend
        return order;
      }

      throw new Error(
        "Selected payment method is not available yet. Please choose Razorpay or COD."
      );
    } catch (error) {
      throw error;
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const shipping = 0;
  const tax = 0;
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (appliedCoupon.type === "PERCENTAGE") {
      const d = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount
        ? Math.min(d, appliedCoupon.maxDiscount)
        : d;
    } else {
      return appliedCoupon.value;
    }
  }, [appliedCoupon, cartItems]);
  const total = subtotal + shipping + tax - discount;

  const loading =
    cartLoading ||
    addressesLoading ||
    couponMutation.isPending ||
    orderMutation.isPending;
  const error =
    cartError?.message ||
    addressesError?.message ||
    couponMutation.error?.message ||
    orderMutation.error?.message ||
    "";

  return {
    cartItems,
    addresses,
    selectedAddressId,
    couponCode,
    appliedCoupon,
    loading,
    error,
    couponMutation,
    paymentStatus,

    setSelectedAddressId,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    createOrder,
    loadCart: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    loadAddresses: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    resetPaymentStatus,

    subtotal,
    shipping,
    tax,
    discount,
    total,
  };
};
