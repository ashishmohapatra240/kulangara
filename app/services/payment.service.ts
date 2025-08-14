import axiosInstance from '../lib/axios';

export interface IRazorpayOrderRequest {
    orderId: string;
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
    // Create Razorpay order
    createRazorpayOrder: async (data: IRazorpayOrderRequest): Promise<IRazorpayOrderResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/create-order', data);
        return response.data;
    },

    // Verify Razorpay payment
    verifyRazorpayPayment: async (data: IRazorpayVerifyRequest): Promise<IRazorpayVerifyResponse> => {
        const response = await axiosInstance.post('/api/v1/payments/verify', data);
        return response.data;
    }
};

export default paymentService; 