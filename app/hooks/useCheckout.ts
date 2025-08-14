import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "@/app/types/profile.type";
import { ICoupon } from "@/app/types/coupon.type";
import { ICheckoutFormData } from "@/app/types/checkout.type";
import cartService from "@/app/services/cart.service";
import { ProfileService } from "@/app/services/profile.service";
import couponService from "@/app/services/coupon.service";
import orderService from "@/app/services/order.service";
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { getErrorMessage } from "@/app/lib/utils";
import { useRazorpayPayment } from "./useRazorpayPayment";
import { useAppDispatch } from "../store/hooks";
import { clearCart as clearCartThunk, fetchCart as fetchCartThunk } from "../store/slices/cartSlice";

export const useCheckout = () => {
    const queryClient = useQueryClient();
    const { processRazorpayPayment, paymentStatus, resetPaymentStatus } = useRazorpayPayment();
    const dispatch = useAppDispatch();

    // UI state
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [couponCode, setCouponCode] = useState("");

    // Cart
    const { data: cartData, isLoading: cartLoading, error: cartError } = useQuery({
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

    // Addresses
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
    const addresses: IAddress[] = useMemo(() =>
        addressesData || []
        , [addressesData]);

    // Set default address if available when addressesData changes
    useEffect(() => {
        if (addressesData && addressesData.length > 0) {
            const defaultAddress = addressesData.find((addr: IAddress) => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        }
    }, [addressesData]);

    // Coupon
    const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);

    const couponMutation = useMutation({
        mutationFn: async (code: string) => {
            const response = await couponService.validateCoupon(code);
            if (response.status === 'success' && response.data) {
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

    // Order creation
    const orderMutation = useMutation({
        mutationFn: async ({ paymentMethod, formData }: { paymentMethod: string; formData?: ICheckoutFormData }) => {
            if (!selectedAddressId && !formData?.firstName) {
                throw new Error("Please select a shipping address or fill in address details");
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
                        isDefault: (addresses && addresses.length === 0)
                    });
                    addressId = addressResponse.data.addresses[addressResponse.data.addresses.length - 1].id;
                } catch {
                    throw new Error("Failed to create address. Please try again.");
                }
            }
            const orderData = {
                shippingAddressId: addressId,
                paymentMethod: paymentMethod.toUpperCase(),
                items: cartItems.map(item => {
                    const orderItem: {
                        productId: string;
                        quantity: number;
                        variantId?: string;
                    } = {
                        productId: item.productId,
                        quantity: item.quantity
                    };
                    if (item.variantId) {
                        orderItem.variantId = item.variantId;
                    }
                    return orderItem;
                }),
                couponCode: appliedCoupon?.code
            };
            try {
                const response = await orderService.createOrder(orderData);

                if (response.status === "success") {
                    // Do NOT clear cart here for online payments; handle after successful payment verification
                    return response.data.order;
                }
                throw new Error(response.message || "Failed to create order");
            } catch (orderError) {
                throw orderError;
            }
        },
        onSuccess: () => {
            // Keep side-effects minimal here; actual toasts/cart clearing handled based on payment method in createOrder
            dispatch(fetchCartThunk());
        },
        onError: (error: Error | AxiosError) => {
            toast.error(getErrorMessage(error as AxiosError));
            orderMutation.reset();
        },
    });

    const createOrder = async (paymentMethod: string, formData?: ICheckoutFormData) => {
        orderMutation.reset();
        resetPaymentStatus();

        try {
            // First create the order
            const order = await orderMutation.mutateAsync({ paymentMethod, formData });

            const normalizedMethod = paymentMethod.toLowerCase();

            if (normalizedMethod === 'razorpay') {
                const userEmail = formData?.email || '';
                const userPhone = formData?.phone || '';

                const paymentVerified = await processRazorpayPayment(order.id, userEmail, userPhone);

                if (!paymentVerified) {
                    throw new Error('Payment failed or cancelled');
                }

                // Payment verified => clear cart and notify
                try {
                    await dispatch(clearCartThunk()).unwrap();
                } catch {
                    // ignore
                }
                dispatch(fetchCartThunk());
                toast.success('Order placed successfully!');
                return order;
            }

            if (normalizedMethod === 'cod') {
                // COD: order is placed immediately
                try {
                    await dispatch(clearCartThunk()).unwrap();
                } catch {
                    // ignore
                }
                dispatch(fetchCartThunk());
                toast.success('Order placed successfully!');
                return order;
            }

            // Unsupported/Not yet integrated payment methods
            throw new Error('Selected payment method is not available yet. Please choose Razorpay or COD.');
        } catch (error) {
            throw error;
        }
    };

    // Totals
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    const shipping = 0; // FREE shipping
    const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]); // 18% tax
    const discount = useMemo(() => {
        if (!appliedCoupon) return 0;
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (appliedCoupon.type === 'PERCENTAGE') {
            const d = (subtotal * appliedCoupon.value) / 100;
            return appliedCoupon.maxDiscount ? Math.min(d, appliedCoupon.maxDiscount) : d;
        } else {
            return appliedCoupon.value;
        }
    }, [appliedCoupon, cartItems]);
    const total = subtotal + shipping + tax - discount;

    // Loading and error states
    const loading = cartLoading || addressesLoading || couponMutation.isPending || orderMutation.isPending;
    const error = (cartError?.message || addressesError?.message || couponMutation.error?.message || orderMutation.error?.message || "");

    return {
        // State
        cartItems,
        addresses,
        selectedAddressId,
        couponCode,
        appliedCoupon,
        loading,
        error,
        couponMutation, // Expose couponMutation for error state in UI
        paymentStatus, // Expose payment status for UI

        // Actions
        setSelectedAddressId,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        createOrder,
        loadCart: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
        loadAddresses: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
        resetPaymentStatus,

        // Calculations
        subtotal,
        shipping,
        tax,
        discount,
        total
    };
};