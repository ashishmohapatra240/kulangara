export interface ICategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string | null;
    parentId?: string | null;
    isActive: boolean;
    sortOrder: number;
    parent?: ICategory | null;
    children?: ICategory[];
    _count?: {
        products: number;
        children?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ICategoryFilters {
    page?: number;
    limit?: number;
    parentId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ICategoryListResponse {
    data: ICategory[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
}

export interface ICategoryUpdate {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
}

export interface ICategoryResponse {
    status: string;
    message?: string;
    data: {
        category?: ICategory;
    };
}

export interface ICategoryDetailsResponse {
    status: string;
    data: ICategory;
}
