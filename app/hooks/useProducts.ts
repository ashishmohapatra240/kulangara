import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import productsService from '../services/products.service';
import { IProductSearchParams, IUpdateProductData, ICreateVariantData, IUpdateVariantData } from '../types/product.type';
import { getErrorMessage } from '../lib/utils';

export function useProducts(params?: IProductSearchParams) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productsService.getProducts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productsService.getProductById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useProductBySlug(slug: string) {
    return useQuery({
        queryKey: ['product', 'slug', slug],
        queryFn: () => productsService.getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useFeaturedProducts() {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productsService.getProducts({ isFeatured: true, limit: 12 }),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

export function useSearchProducts(query: string) {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: () => productsService.searchProducts(query),
        enabled: !!query && query.length >= 1,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

//------------------------------Admin hooks--------------------------------------------
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IUpdateProductData }) =>
            productsService.updateProduct(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            toast.success('Product updated successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useAddProductImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, images }: { productId: string; images: Array<{ url: string; alt: string; isPrimary: boolean }> }) =>
            productsService.addProductImages(productId, images),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast.success('Images added successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useDeleteProductImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
            productsService.deleteProductImage(productId, imageId),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast.success('Image deleted successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useAddProductVariant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, variantData }: { productId: string; variantData: ICreateVariantData }) =>
            productsService.addProductVariant(productId, variantData),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast.success('Variant added successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useUpdateProductVariant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, variantId, variantData }: { productId: string; variantId: string; variantData: IUpdateVariantData }) =>
            productsService.updateProductVariant(productId, variantId, variantData),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast.success('Variant updated successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useDeleteProductVariant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) =>
            productsService.deleteProductVariant(productId, variantId),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast.success('Variant deleted successfully!');
        },
        onError: (error: AxiosError) => {
            toast.error(getErrorMessage(error));
        },
    });
}