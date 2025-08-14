export interface ICoupon {
    id: string;
    name?: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    maxDiscount?: number;
    minOrderValue: number;
    validFrom?: string;
    validUntil?: string;
    usageLimit?: number;
    userUsageLimit?: number;
    isActive?: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICouponValidationResponse {
    status: 'success' | 'error';
    data?: ICoupon;
    message?: string;
}

export interface ICouponListResponse {
    data: ICoupon[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ICouponFilters {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export interface ICreateCouponData {
    name: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    maxDiscount?: number;
    minOrderValue: number;
    validFrom?: string;
    validUntil?: string;
    usageLimit?: number;
    userUsageLimit?: number;
    description?: string;
    isActive?: boolean;
}

export interface IUpdateCouponData extends Partial<ICreateCouponData> {
    id: string;
}