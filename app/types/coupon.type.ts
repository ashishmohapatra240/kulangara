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