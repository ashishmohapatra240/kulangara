export interface IOrderItem {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    product?: {
        id: string;
        name: string;
        slug: string;
        images: Array<{
            url: string;
            alt: string;
            isPrimary: boolean;
        }>;
    };
    variant?: {
        id: string;
        size: string;
        color: string;
        price: number;
        sku: string;
        stock: number;
    };
}

export interface IOrder {
    id: string;
    userId: string;
    orderNumber: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
    items: IOrderItem[];
    shippingAddress: {
        id: string;
        firstName: string;
        lastName: string;
        address: string;
        apartment: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
    subtotal: number;
    shippingFee: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    couponCode?: string;
    couponDiscount?: number;
    trackingNumber?: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
    deliveredAt?: string;
}

export interface IOrderRequest {
    shippingAddressId: string;
    paymentMethod: string;
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;
    couponCode?: string;
}

export interface IOrderResponse {
    status: string;
    success: boolean;
    message: string;
    data: {
      order: IOrder;
    };
}

export interface IOrderListResponse {
    status: string;
    data: {
        data: IOrder[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
    message?: string;
}

export interface ITrackingHistoryItem {
    id: string;
    orderId: string;
    status: string;
    note: string;
    updatedBy: string | null;
    createdAt: string;
}

export interface IOrderTrackingServiceResponse {
    status: string;
    data: {
        currentStatus: string;
        trackingNumber: string;
        estimatedDelivery: string;
        history: ITrackingHistoryItem[];
    };
}