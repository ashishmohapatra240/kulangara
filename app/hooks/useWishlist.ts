import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import wishlistService from '../services/wishlist.service';
import { getErrorMessage } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuth } from './useAuth';

export const useWishlist = () => {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const response = await wishlistService.getWishlist();
            return response;
        },
        enabled: isAuthenticated,
    });
};


export function useCreateWishlistItems() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => wishlistService.createWishlistItems(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    })
}

export function useDeleteWishlistItems() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => wishlistService.deleteWishlistItems(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    })
}
