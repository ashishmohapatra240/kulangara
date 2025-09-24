import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import categoryService from '../services/category.service';
import { 
    ICategoryFilters, 
    ICategoryCreate, 
    ICategoryUpdate 
} from '../types/category.type';

// Query keys
const CATEGORY_QUERY_KEYS = {
    CATEGORIES: 'categories',
    ADMIN_CATEGORIES: 'admin-categories',
    CATEGORY_DETAILS: 'category-details',
} as const;

// Public categories hook
export function useCategories(filters?: ICategoryFilters) {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES, filters],
        queryFn: () => categoryService.getCategories(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

// Admin categories hook
export function useAdminCategories(filters?: ICategoryFilters) {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES, filters],
        queryFn: () => categoryService.getAdminCategories(filters),
        staleTime: 0, // Always consider data stale for admin operations
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnMount: true, // Always refetch on component mount
    });
}

// Category details hook
export function useCategoryById(id: string) {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEYS.CATEGORY_DETAILS, id],
        queryFn: () => categoryService.getCategoryById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

// Create category mutation
export function useCreateCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (categoryData: ICategoryCreate) => {
            // Validate data before submitting
            const errors = categoryService.validateCategoryData(categoryData);
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }
            return categoryService.createCategory(categoryData);
        },
        onSuccess: (data) => {
            // Remove all category-related queries from cache
            queryClient.removeQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES] });
            queryClient.removeQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            // Invalidate and refetch categories
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES] });
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            toast.success('Category created successfully!');
        },
        onError: (error: Error) => {
            const errorMessage = (error as any)?.response?.data?.message || error?.message || 'Failed to create category';
            toast.error(errorMessage);
            console.error('Create category error:', error);
        },
    });
}

// Update category mutation
export function useUpdateCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ICategoryUpdate }) => {
            // Validate data before submitting
            const errors = categoryService.validateCategoryData(data);
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }
            return categoryService.updateCategory(id, data);
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch categories
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES] });
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORY_DETAILS, variables.id] });
            
            toast.success('Category updated successfully!');
        },
        onError: (error: Error) => {
            const errorMessage = (error as any)?.response?.data?.message || error?.message || 'Failed to update category';
            toast.error(errorMessage);
            console.error('Update category error:', error);
        },
    });
}

// Delete category mutation
export function useDeleteCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: () => {
            // Remove all category-related queries from cache
            queryClient.removeQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES] });
            queryClient.removeQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            // Invalidate and refetch categories
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.CATEGORIES] });
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: [CATEGORY_QUERY_KEYS.ADMIN_CATEGORIES] });
            
            toast.success('Category deleted successfully!');
        },
        onError: (error: Error) => {
            const errorMessage = (error as any)?.response?.data?.message || error?.message || 'Failed to delete category';
            toast.error(errorMessage);
            console.error('Delete category error:', error);
        },
    });
}

// Helper hook for generating slug
export function useGenerateSlug() {
    return {
        generateSlug: categoryService.generateSlug,
    };
}
