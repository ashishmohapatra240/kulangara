import axiosInstance from '../lib/axios';
import { IWishlist, IWishlistListResponse } from '../types/wishlist.type';

const wishlistService = {
    getWishlist: async (): Promise<IWishlistListResponse> => {
        const response = await axiosInstance.get('/api/v1/wishlist');
        return response.data;
    },

    createWishlistItems: async (productId: string): Promise<IWishlist> => {
        const response = await axiosInstance.post('/api/v1/wishlist/items', {
            productId
        });
        return response.data;
    },

    deleteWishlistItems: async (productId: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/wishlist/items/${productId}`);
    }
}

export default wishlistService;