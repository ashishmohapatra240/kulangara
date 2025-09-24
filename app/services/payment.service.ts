import axiosInstance from '../lib/axios';

export interface IRazorpayOrderRequest {
    orderId: string;
}

export interface IRazorpayCartOrderRequest {
    cartData: {
        items: Array<{
            productId: string;
            variantId?: string;
            quantity: number;
            price: number;
        }>;
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        couponCode?: string;
        shippingAddressId: string;
    };
    userEmail?: string;
    userPhone?: string;
}

export interface IRazorpayOrderResponse {
    status: string;
    data: {
        orderId: string;
        amount: number;
        currency: string;
        key: string;
        name: string;
        description: string;
        prefill: {
            email: string;
            contact: string;
        };
        theme: {
            color: string;
        };
    };
}

export interface IRazorpayVerifyRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface IRazorpayVerifyWithCartRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    cartData: {
        items: Array<{
            productId: string;
            variantId?: string;
            quantity: number;
        }>;
        shippingAddressId: string;
        paymentMethod: string;
        couponCode?: string;
    };
}

export interface IRazorpayVerifyResponse {
    status: string;
    message: string;
    data?: {
        verified: boolean;
        paymentId: string;
        orderId: string;
    };
}

const paymentService = {
    // Create Razorpay order (legacy - requires existing order)
    createRazorpayOrder: async (data: IRazorpayOrderRequest): Promise<IRazorpayOrderResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/create-order', data);
        return response.data;
    },

    // Create Razorpay order from cart (new - no database order required)
    createRazorpayOrderFromCart: async (data: IRazorpayCartOrderRequest): Promise<IRazorpayOrderResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/create-cart-order', data);
        return response.data;
    },

    // Verify Razorpay payment (legacy)
    verifyRazorpayPayment: async (data: IRazorpayVerifyRequest): Promise<IRazorpayVerifyResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/verify', data);
        return response.data;
    },

    // Verify payment and create order from cart (new)
    verifyRazorpayPaymentAndCreateOrder: async (data: IRazorpayVerifyWithCartRequest): Promise<IRazorpayVerifyResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/verify-and-create', data);
        return response.data;
    }
};

export default paymentService; 