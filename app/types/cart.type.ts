import { IProduct } from './product.type';

export interface ICartItem {
    id: string;
    productId: string;
    product: IProduct;
    variantId?: string;
    variant?: {
        id: string;
        size: string;
        color: string;
        price: number;
        sku: string;
        stock: number;
    };
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICartResponse {
    success: boolean;
    message: string;
    data: {
        items: ICartItem[];
        totalItems: number;
        subtotal: number;
        shipping: number;
        total: number;
    };
}

export interface IAddToCartRequest {
    productId: string;
    quantity: number;
    variantId?: string;
}

export interface IUpdateCartItemRequest {
    quantity: number;
}

export interface ICartState {
    items: ICartItem[];
    totalItems: number;
    subtotal: number;
    shipping: number;
    total: number;
    loading: boolean;
    error: string | null;
}

// For local cart operations (when API is not available)
export interface ILocalCartItem extends IProduct {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}