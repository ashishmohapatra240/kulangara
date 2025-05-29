import { Product } from "@/app/types/product";

export const DUMMY_WISHLIST: Product[] = [
    {
        id: "1",
        name: "Zenith Retreat Tee",
        price: 2499,
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A comfortable and stylish tee",
        sizes: ["S", "M", "L", "XL"],
        details: {
            material: "100% cotton",
            dimensions: "100% cotton, machine washable",
            care: ["Breathable", "Moisture-wicking"],
        },
        features: ["Breathable", "Moisture-wicking"],
        inStock: true,
        companyFeatures: [
            {
                icon: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Breathable",
                description: "Moisture-wicking",
            },
        ],
        reviews: {
            rating: 4.5,
            total: 100,
            items: [
                {
                    user: "John Doe",
                    rating: 4.5,
                    date: "2024-01-01",
                    comment: "Great quality and comfortable",
                },
            ],
        },
        deliveryInfo: {
            estimatedDays: "3-5",
            shippingFee: 99,
            returnPeriod: 30,
        },
    },
    {
        id: "2",
        name: "Zenith Retreat Tee",
        price: 2499,
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A comfortable and stylish tee",
        sizes: ["S", "M", "L", "XL"],
        details: {
            material: "100% cotton",
            dimensions: "100% cotton, machine washable",
            care: ["Breathable", "Moisture-wicking"],
        },
        features: ["Breathable", "Moisture-wicking"],
        inStock: true,
        companyFeatures: [
            {
                icon: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Breathable",
                description: "Moisture-wicking",
            },
        ],
        reviews: {
            rating: 4.5,
            total: 100,
            items: [
                {
                    user: "John Doe",
                    rating: 4.5,
                    date: "2024-01-01",
                    comment: "Great quality and comfortable",
                },
            ],
        },
        deliveryInfo: {
            estimatedDays: "3-5",
            shippingFee: 99,
            returnPeriod: 30,
        },
    },
];
