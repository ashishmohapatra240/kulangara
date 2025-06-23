import axiosInstance from '../lib/axios';
import { IReview, ICreateReviewData, IUpdateReviewData, IReviewListResponse, IReviewFilters } from '../types/review.type';

const reviewService = {
    getReviews: async (productId: string, filters?: IReviewFilters): Promise<IReviewListResponse> => {
        const response = await axiosInstance.get(`/api/v1/products/${productId}/reviews`, { params: filters });
        return response.data.data;
    },

    createReview: async (productId: string, reviewData: ICreateReviewData): Promise<IReview> => {
        const response = await axiosInstance.post(`/api/v1/products/${productId}/reviews`, reviewData);
        return response.data.data.review;
    },

    updateReview: async (productId: string, reviewId: string, reviewData: IUpdateReviewData): Promise<IReview> => {
        const response = await axiosInstance.put(`/api/v1/products/${productId}/reviews/${reviewId}`, reviewData);
        return response.data.data.review;
    },

    deleteReview: async (productId: string, reviewId: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/products/${productId}/reviews/${reviewId}`);
    },
};

export default reviewService;