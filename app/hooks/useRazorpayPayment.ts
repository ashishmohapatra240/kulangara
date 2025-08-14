import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import paymentService, { IRazorpayOrderRequest } from '@/app/services/payment.service';
import { IRazorpayOptions, IRazorpayResponse, PaymentStatus } from '@/app/types/payment.type';
import { getErrorMessage } from '@/app/lib/utils';
import { AxiosError } from 'axios';

export const useRazorpayPayment = () => {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

    // Create Razorpay order mutation
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

    // Verify payment mutation
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

    const processRazorpayPayment = useCallback(async (
        orderId: string,
        userEmail: string = '',
        userPhone: string = ''
    ): Promise<boolean> => {
        try {

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                console.error('💳 Razorpay SDK not loaded');
                toast.error('Razorpay SDK not loaded. Please refresh the page.');
                return false;
            }

            setPaymentStatus('creating_order');

            // Create Razorpay order
            const orderResponse = await createOrderMutation.mutateAsync({ orderId });


            if (orderResponse.status !== 'success') {
                console.error('💳 Order response status not success:', orderResponse.status);
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
                    console.error('💳 Error creating/opening Razorpay:', razorpayError);
                    console.error('💳 Razorpay error message:', (razorpayError as Error).message);
                    console.error('💳 Razorpay error stack:', (razorpayError as Error).stack);
                    resolve(false);
                }
            });

            return result;
        } catch (error) {
            console.error('💳 processRazorpayPayment catch block error:', error);
            console.error('💳 Error message:', (error as Error).message);
            console.error('💳 Error stack:', (error as Error).stack);
            setPaymentStatus('failed');
            toast.error(getErrorMessage(error as AxiosError));
            return false;
        }
    }, [createOrderMutation, verifyPaymentMutation]);

    const resetPaymentStatus = useCallback(() => {
        setPaymentStatus('idle');
        createOrderMutation.reset();
        verifyPaymentMutation.reset();
    }, [createOrderMutation, verifyPaymentMutation]);

    return {
        paymentStatus,
        processRazorpayPayment,
        resetPaymentStatus,
        isLoading: createOrderMutation.isPending || verifyPaymentMutation.isPending,
        error: createOrderMutation.error || verifyPaymentMutation.error,
    };
};