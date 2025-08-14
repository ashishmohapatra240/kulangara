export interface IRazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: IRazorpayResponse) => void;
    prefill: {
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    modal: {
        ondismiss: () => void;
    };
}

export interface IRazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface IRazorpay {
    open(): void;
}

declare global {
    interface Window {
        Razorpay: new (options: IRazorpayOptions) => IRazorpay;
    }
}

export type PaymentStatus = 'idle' | 'creating_order' | 'payment_pending' | 'verifying' | 'success' | 'failed'; 