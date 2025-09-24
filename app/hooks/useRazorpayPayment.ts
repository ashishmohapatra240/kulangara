import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import paymentService, { IRazorpayOrderRequest, IRazorpayCartOrderRequest, IRazorpayVerifyWithCartRequest } from '@/app/services/payment.service';
import { IRazorpayOptions, IRazorpayResponse, PaymentStatus } from '@/app/types/payment.type';
import { getErrorMessage } from '@/app/lib/utils';
import { AxiosError } from 'axios';

export const useRazorpayPayment = () => {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

    // Create Razorpay order mutation (legacy - for existing orders)
    const createOrderMutation = useMutation({
        mutationFn: async (data: IRazorpayOrderRequest) => {
            try {
                const response = await paymentService.createRazorpayOrder(data);
                return response;
            } catch (error) {
                console.error('💳 Error in createOrderMutation:', error);
                console.error('💳 Error message:', (error as Error).message);
                console.error('💳 Error stack:', (error as Error).stack);
                throw error;
            }
        },
        onError: (error: Error | AxiosError) => {
            console.error('💳 createOrderMutation onError:', error);
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
        }
    });

    // Create Razorpay order from cart mutation (new - cart-based)
    const createCartOrderMutation = useMutation({
        mutationFn: async (data: IRazorpayCartOrderRequest) => {
            try {
                console.log('Sending cart order request:', JSON.stringify(data, null, 2));
                const response = await paymentService.createRazorpayOrderFromCart(data);
                return response;
            } catch (error) {
                console.error('Error in createCartOrderMutation:', error);
                
                // Log detailed error information
                if (error instanceof Error && 'response' in error) {
                    const axiosError = error as AxiosError;
                    console.error('Response status:', axiosError.response?.status);
                    console.error('Response headers:', axiosError.response?.headers);
                    console.error('Response data:', axiosError.response?.data);
                    console.error('Request config:', axiosError.config);
                }
                
                console.error('Error message:', (error as Error).message);
                console.error('Error stack:', (error as Error).stack);
                throw error;
            }
        },
        onError: (error: Error | AxiosError) => {
            console.error('createCartOrderMutation onError:', error);
            
            // Log backend error details
            if ('response' in error && error.response) {
                console.error('Backend error response:', error.response.data);
            }
            
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
        }
    });

    // Verify payment mutation (legacy)
    const verifyPaymentMutation = useMutation({
        mutationFn: paymentService.verifyRazorpayPayment,
        onSuccess: (response) => {
            // Some backends return only { status: 'success', message: '...' } without a data.verified flag
            if (response.status === 'success' || response.data?.verified) {
                setPaymentStatus('success');
                toast.success(response?.message || 'Payment verified successfully!');
            } else {
                setPaymentStatus('failed');
                toast.error(response?.message || 'Payment verification failed');
            }
        },
        onError: (error: Error | AxiosError) => {
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
        }
    });

    // Verify payment and create order mutation (new - cart-based)
    const verifyPaymentAndCreateOrderMutation = useMutation({
        mutationFn: paymentService.verifyRazorpayPaymentAndCreateOrder,
        onSuccess: (response) => {
            if (response.status === 'success' || response.data?.verified) {
                setPaymentStatus('success');
                toast.success(response?.message || 'Payment verified and order created successfully!');
            } else {
                setPaymentStatus('failed');
                toast.error(response?.message || 'Payment verification failed');
            }
        },
        onError: (error: Error | AxiosError) => {
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
        }
    });

    // Process payment with cart data (new approach - no database order created initially)
    const processRazorpayPaymentFromCart = useCallback(async (
        cartData: IRazorpayCartOrderRequest['cartData'],
        userEmail: string = '',
        userPhone: string = ''
    ): Promise<{ success: boolean; orderId?: string }> => {
        try {
            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                console.error('Razorpay SDK not loaded');
                toast.error('Razorpay SDK not loaded. Please refresh the page.');
                return { success: false };
            }

            setPaymentStatus('creating_order');

            // Create Razorpay order from cart data
            const requestData: IRazorpayCartOrderRequest = {
                cartData
            };
            
            if (userEmail && userEmail.trim()) {
                requestData.userEmail = userEmail.trim();
            }
            if (userPhone && userPhone.trim()) {
                requestData.userPhone = userPhone.trim();
            }
            
            const orderResponse = await createCartOrderMutation.mutateAsync(requestData);

            if (orderResponse.status !== 'success') {
                console.error('Order response status not success:', orderResponse.status);
                toast.error('Failed to create payment order');
                setPaymentStatus('failed');
                return { success: false };
            }

            setPaymentStatus('payment_pending');

            // Return a promise that resolves based on verification or dismissal
            return new Promise<{ success: boolean; orderId?: string }>((resolve) => {
                // Configure Razorpay options
                const options: IRazorpayOptions = {
                    key: orderResponse.data.key,
                    amount: orderResponse.data.amount,
                    currency: orderResponse.data.currency,
                    name: orderResponse.data.name,
                    description: orderResponse.data.description,
                    order_id: orderResponse.data.orderId,
                    prefill: {
                        email: userEmail || orderResponse.data.prefill?.email || '',
                        contact: userPhone || orderResponse.data.prefill?.contact || '',
                    },
                    theme: {
                        color: orderResponse.data.theme?.color || '#000000',
                    },
                    handler: async (response: IRazorpayResponse) => {
                        setPaymentStatus('verifying');
                        try {
                            // Build cart data for verification
                            const verificationData: IRazorpayVerifyWithCartRequest = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                cartData: {
                                    items: cartData.items.map(item => ({
                                        productId: item.productId,
                                        variantId: item.variantId,
                                        quantity: item.quantity
                                    })),
                                    shippingAddressId: cartData.shippingAddressId,
                                    paymentMethod: 'RAZORPAY',
                                    couponCode: cartData.couponCode
                                }
                            };

                            const verifyResponse = await verifyPaymentAndCreateOrderMutation.mutateAsync(verificationData);
                            
                            if (verifyResponse.status === 'success' || verifyResponse.data?.verified) {
                                resolve({ success: true, orderId: verifyResponse.data?.orderId });
                            } else {
                                resolve({ success: false });
                            }
                        } catch {
                            resolve({ success: false });
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setPaymentStatus('failed');
                            toast.error('Payment cancelled');
                            resolve({ success: false });
                        },
                    },
                };

                // Open Razorpay checkout
                try {
                    const razorpay = new window.Razorpay(options);
                    razorpay.open();
                } catch (razorpayError) {
                    console.error('Error creating/opening Razorpay:', razorpayError);
                    console.error('Razorpay error message:', (razorpayError as Error).message);
                    console.error('Razorpay error stack:', (razorpayError as Error).stack);
                    resolve({ success: false });
                }
            });
        } catch (error) {
            console.error('processRazorpayPaymentFromCart catch block error:', error);
            console.error('Error message:', (error as Error).message);
            console.error('Error stack:', (error as Error).stack);
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
            return { success: false };
        }
    }, [createCartOrderMutation, verifyPaymentAndCreateOrderMutation]);

    // Process payment with order ID (legacy approach)
    const processRazorpayPayment = useCallback(async (
        orderId: string,
        userEmail: string = '',
        userPhone: string = ''
    ): Promise<boolean> => {
        try {

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                console.error('Razorpay SDK not loaded');
                toast.error('Razorpay SDK not loaded. Please refresh the page.');
                return false;
            }

            setPaymentStatus('creating_order');

            // Create Razorpay order
            const orderResponse = await createOrderMutation.mutateAsync({ orderId });


            if (orderResponse.status !== 'success') {
                console.error('Order response status not success:', orderResponse.status);
                toast.error('Failed to create payment order');
                setPaymentStatus('failed');
                return false;
            }

            setPaymentStatus('payment_pending');


            // Return a promise that resolves based on verification or dismissal
            const result: boolean = await new Promise<boolean>((resolve) => {
                // Configure Razorpay options with safe property access
                const options: IRazorpayOptions = {
                    key: orderResponse.data.key,
                    amount: orderResponse.data.amount,
                    currency: orderResponse.data.currency,
                    name: orderResponse.data.name,
                    description: orderResponse.data.description,
                    order_id: orderResponse.data.orderId,
                    prefill: {
                        email: userEmail || orderResponse.data.prefill?.email || '',
                        contact: userPhone || orderResponse.data.prefill?.contact || '',
                    },
                    theme: {
                        color: orderResponse.data.theme?.color || '#000000',
                    },
                    handler: async (response: IRazorpayResponse) => {
                        setPaymentStatus('verifying');
                        try {
                            const verifyResponse = await verifyPaymentMutation.mutateAsync({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            // onSuccess of mutation already sets status and toast; ensure resolve here
                            if (verifyResponse.status === 'success' || verifyResponse.data?.verified) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } catch {
                            resolve(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setPaymentStatus('failed');
                            toast.error('Payment cancelled');
                            resolve(false);
                        },
                    },
                };



                // Open Razorpay checkout
                try {
                    const razorpay = new window.Razorpay(options);

                    razorpay.open();
                } catch (razorpayError) {
                    console.error('Error creating/opening Razorpay:', razorpayError);
                    console.error('Razorpay error message:', (razorpayError as Error).message);
                    console.error('Razorpay error stack:', (razorpayError as Error).stack);
                    resolve(false);
                }
            });

            return result;
        } catch (error) {
            console.error('processRazorpayPayment catch block error:', error);
            console.error('Error message:', (error as Error).message);
            console.error('Error stack:', (error as Error).stack);
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
            return false;
        }
    }, [createOrderMutation, verifyPaymentMutation]);

    const resetPaymentStatus = useCallback(() => {
        setPaymentStatus('idle');
        createOrderMutation.reset();
        createCartOrderMutation.reset();
        verifyPaymentMutation.reset();
        verifyPaymentAndCreateOrderMutation.reset();
    }, [createOrderMutation, createCartOrderMutation, verifyPaymentMutation, verifyPaymentAndCreateOrderMutation]);

    return {
        paymentStatus,
        processRazorpayPayment, // Legacy - for existing order
        processRazorpayPaymentFromCart, // New - for cart-based payment
        resetPaymentStatus,
        isLoading: createOrderMutation.isPending || createCartOrderMutation.isPending || verifyPaymentMutation.isPending || verifyPaymentAndCreateOrderMutation.isPending,
        error: createOrderMutation.error || createCartOrderMutation.error || verifyPaymentMutation.error || verifyPaymentAndCreateOrderMutation.error,
    };
};