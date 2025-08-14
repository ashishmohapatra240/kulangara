import axiosInstance from '../lib/axios';
import { ICoupon, ICouponFilters, ICouponListResponse, ICouponValidationResponse, ICreateCouponData, IUpdateCouponData } from '../types/coupon.type';

const couponService = {
    // Validate coupon code
    validateCoupon: async (code: string): Promise<ICouponValidationResponse> => {
        const response = await axiosInstance.get(`/api/v1/coupons/validate/${code}`);
        return response.data;
    },
    // Admin: List coupons
    getCoupons: async (filters?: ICouponFilters): Promise<ICouponListResponse> => {
        const response = await axiosInstance.get('/api/v1/coupons/admin/coupons', { params: filters });
        return {
            data: response.data.data,
            meta: response.data.meta,
        };
    },
    // Admin: Create coupon
    createCoupon: async (data: ICreateCouponData): Promise<ICoupon> => {
        const response = await axiosInstance.post('/api/v1/coupons/admin/coupons', data);
        return response.data.data;
    },
    // Admin: Update coupon
    updateCoupon: async (id: string, data: IUpdateCouponData): Promise<ICoupon> => {
        const response = await axiosInstance.put(`/api/v1/coupons/admin/coupons/${id}`, data);
        return response.data.data;
    },
    // Admin: Delete coupon
    deleteCoupon: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/coupons/admin/coupons/${id}`);
    },
};

export default couponService;