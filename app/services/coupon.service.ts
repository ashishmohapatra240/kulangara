import axiosInstance from '../lib/axios';
import { ICouponValidationResponse } from '../types/coupon.type';

const couponService = {
    // Validate coupon code
    validateCoupon: async (code: string): Promise<ICouponValidationResponse> => {
        const response = await axiosInstance.get(`/api/v1/coupons/validate/${code}`);
        return response.data;
    }
};

export default couponService;