export interface Product {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    image: string;
    description: string;
    sizes: string[];
    details: {
        material?: string;
        dimensions?: string;
        care?: string[];
    };
    features: string[];
    inStock: boolean;
    companyFeatures: {
        icon: string;
        title: string;
        description: string;
    }[];
    reviews: {
        rating: number;
        total: number;
        items: {
            user: string;
            rating: number;
            date: string;
            comment: string;
        }[];
    };
    deliveryInfo: {
        estimatedDays: string;
        shippingFee: number;
        returnPeriod: number;
    };
}
