import axiosInstance from '../lib/axios';
import { ICartResponse, IAddToCartRequest, IUpdateCartItemRequest } from '../types/cart.type';

const cartService = {
    // Get cart items
    getCart: async (): Promise<ICartResponse> => {
        const response = await axiosInstance.get('/api/v1/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (data: IAddToCartRequest): Promise<ICartResponse> => {
        const response = await axiosInstance.post('/api/v1/cart/items', data);
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (itemId: string, data: IUpdateCartItemRequest): Promise<ICartResponse> => {
        const response = await axiosInstance.put(`/api/v1/cart/items/${itemId}`, data);
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (itemId: string): Promise<ICartResponse> => {
        const response = await axiosInstance.delete(`/api/v1/cart/items/${itemId}`);
        return response.data;
    },

    // Clear entire cart
    clearCart: async (): Promise<ICartResponse> => {
        const response = await axiosInstance.delete('/api/v1/cart/clear');
        return response.data;
    }
};

export default cartService;