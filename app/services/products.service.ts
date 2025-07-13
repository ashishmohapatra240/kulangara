import axiosInstance from '../lib/axios';
import { IProduct, IProductListResponse, IProductSearchParams, ICreateProductData, IUpdateProductData, ICreateVariantData, IUpdateVariantData } from '../types/product.type';

const productsService = {
    // Get all products
    getProducts: async (params?: IProductSearchParams): Promise<IProductListResponse> => {
        const response = await axiosInstance.get('/api/v1/products/list', { params });
        return response.data.data;
    },

    // Get product by ID
    getProductById: async (id: string): Promise<IProduct> => {
        const response = await axiosInstance.get(`/api/v1/products/${id}`);
        return response.data.data;
    },

    // Get product by slug
    getProductBySlug: async (slug: string): Promise<IProduct> => {
        const response = await axiosInstance.get(`/api/v1/products/slug/${slug}`);
        return response.data.data;
    },

    // Search products
    searchProducts: async (query: string): Promise<IProduct[]> => {
        const response = await axiosInstance.get(`/api/v1/products/search?q=${encodeURIComponent(query)}`);
        return response.data.data;
    },

    // Admin: Create product
    createProduct: async (productData: ICreateProductData): Promise<IProduct> => {
        const response = await axiosInstance.post('/api/v1/products', productData);
        return response.data.data;
    },

    // Admin: Update product
    updateProduct: async (id: string, productData: IUpdateProductData): Promise<IProduct> => {
        const response = await axiosInstance.put(`/api/v1/products/${id}`, productData);
        return response.data.data;
    },

    // Admin: Delete product
    deleteProduct: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/products/${id}`);
    },

    // Admin: Get upload URLs for images
    getUploadUrls: async (productId: string, fileTypes: string[]): Promise<{ urls: string[] }> => {
        const response = await axiosInstance.post(`/api/v1/products/${productId}/images/upload-urls`, {
            fileTypes
        });
        return response.data.data;
    },

    // Admin: Add images to product
    addProductImages: async (productId: string, images: Array<{ url: string; alt: string; isPrimary: boolean }>): Promise<void> => {
        await axiosInstance.post(`/api/v1/products/${productId}/images`, { images });
    },

    // Admin: Delete product image
    deleteProductImage: async (productId: string, imageId: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/products/${productId}/images/${imageId}`);
    },

    // Admin: Add product variant
    addProductVariant: async (productId: string, variantData: ICreateVariantData): Promise<ICreateVariantData> => {
        const response = await axiosInstance.post(`/api/v1/products/${productId}/variants`, variantData);
        return response.data.data;
    },

    // Admin: Add bulk product variants
    addBulkProductVariants: async (productId: string, variants: ICreateVariantData[]): Promise<ICreateVariantData[]> => {
        const response = await axiosInstance.post(`/api/v1/products/${productId}/variants/bulk`, { variants });
        return response.data.data;
    },

    // Admin: Update product variant
    updateProductVariant: async (productId: string, variantId: string, variantData: IUpdateVariantData): Promise<IUpdateVariantData> => {
        const response = await axiosInstance.put(`/api/v1/products/${productId}/variants/${variantId}`, variantData);
        return response.data.data;
    },

    // Admin: Delete product variant
    deleteProductVariant: async (productId: string, variantId: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/products/${productId}/variants/${variantId}`);
    },
};

export default productsService;