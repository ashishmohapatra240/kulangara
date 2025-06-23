import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import reviewService from '../services/review.service';
import { ICreateReviewData, IUpdateReviewData, IReviewFilters } from '../types/review.type';
import { getErrorMessage } from '../lib/utils';

export function useReviews(productId: string, filters?: IReviewFilters) {
    return useQuery({
        queryKey: ['reviews', productId, filters],
        queryFn: () => reviewService.getReviews(productId, filters),
        enabled: !!productId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: ICreateReviewData }) =>
            reviewService.createReview(productId, data),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            toast.success('Review created successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useUpdateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, reviewId, data }: { productId: string; reviewId: string; data: IUpdateReviewData }) =>
            reviewService.updateReview(productId, reviewId, data),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            toast.success('Review updated successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, reviewId }: { productId: string; reviewId: string }) =>
            reviewService.deleteReview(productId, reviewId),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            toast.success('Review deleted successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}