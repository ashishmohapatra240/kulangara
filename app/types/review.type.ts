export interface IReview {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    isVerified: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

export interface IReviewListResponse {
    reviews: IReview[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        stats: {
            averageRating: number;
            ratingDistribution: {
                _count: {
                    _all: number;
                }
                rating: number;
            }[]
        }
    };
}

export interface ICreateReviewData {
    rating: number;
    title?: string;
    comment: string;
}

export interface IUpdateReviewData {
    rating?: number;
    title?: string;
    comment?: string;
}

export interface IReviewFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    approved?: boolean;
}
