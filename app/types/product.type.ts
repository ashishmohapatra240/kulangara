export interface IProduct {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    image?: string;
    description: string;
    shortDescription?: string | null;
    costPrice?: number | null;
    sku?: string;
    stockQuantity?: number;
    lowStockThreshold?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    material?: string;
    care?: string[];
    features: string[];
    dimensions?: string | null;
    weight?: number | null;
    gender?: string;
    categoryId?: string;
    sizes?: string[];
    rating?: number;
    totalReviews?: number;
    details?: {
        material?: string;
        dimensions?: string;
        care?: string[];
    };
    inStock?: boolean;
    companyFeatures?: {
        icon: string;
        title: string;
        description: string;
    }[];
    reviews?: {
        rating: number;
        total: number;
        items: {
            user: string;
            rating: number;
            date: string;
            comment: string;
        }[];
    };
    deliveryInfo?: {
        estimatedDays: string;
        shippingFee: number;
        returnPeriod: number;
    };
    slug?: string;
    images?: IProductImage[];
    variants?: IProductVariant[];
    category?: {
        id: string;
        name: string;
        slug: string;
        description: string;
        image: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: string;
        updatedAt: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface IProductImage {
    id: string;
    productId: string;
    url: string;
    alt: string;
    sortOrder: number;
    isPrimary: boolean;
    createdAt: string;
}

export interface IProductVariant {
    id: string;
    productId: string;
    size: string;
    color: string;
    price: number | null;
    sku: string;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IProductListResponse {
    data: IProduct[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface IProductSearchParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isFeatured?: boolean;
}

export interface ICreateProductData {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountedPrice?: number;
    sku: string;
    stockQuantity: number;
    categoryId: string;
    care: string[];
    material: string;
    gender: string;
}

export interface IUpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    discountedPrice?: number;
    sku?: string;
    stockQuantity?: number;
    categoryId?: string;
    care?: string[];
    material?: string;
    gender?: string;
}

export interface ICreateVariantData {
    size: string;
    color: string;
    price: number;
    sku: string;
    stock: number;
}

export interface IUpdateVariantData {
    size?: string;
    color?: string;
    price?: number;
    sku?: string;
    stock?: number;
}
