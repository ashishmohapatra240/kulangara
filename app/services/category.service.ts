import axiosInstance, { publicAxios } from '../lib/axios';
import { 
    ICategory, 
    ICategoryListResponse, 
    ICategoryFilters, 
    ICategoryCreate, 
    ICategoryUpdate, 
    ICategoryResponse,
    ICategoryDetailsResponse 
} from '../types/category.type';

const categoryService = {
    // Public: Get all categories
    getCategories: async (filters?: ICategoryFilters): Promise<ICategoryListResponse> => {
        const response = await publicAxios.get('/api/v1/categories', { params: filters });
        return response.data.data;
    },

    // Public: Get category by ID
    getCategoryById: async (id: string): Promise<ICategory> => {
        const response = await publicAxios.get(`/api/v1/categories/${id}`);
        return response.data.data;
    },

    // Admin: Get all categories with admin data
    getAdminCategories: async (filters?: ICategoryFilters): Promise<ICategoryListResponse> => {
        const response = await axiosInstance.get('/api/v1/categories', { params: filters });
        return response.data.data;
    },

    // Admin: Create category
    createCategory: async (categoryData: ICategoryCreate): Promise<ICategory> => {
        const response = await axiosInstance.post('/api/v1/categories', categoryData);
        return response.data.data.category;
    },

    // Admin: Update category
    updateCategory: async (id: string, categoryData: ICategoryUpdate): Promise<ICategory> => {
        const response = await axiosInstance.put(`/api/v1/categories/${id}`, categoryData);
        return response.data.data.category;
    },

    // Admin: Delete category
    deleteCategory: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/categories/${id}`);
    },

    // Helper: Generate slug from name
    generateSlug: (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    },

    // Helper: Validate category data
    validateCategoryData: (data: ICategoryCreate | ICategoryUpdate): string[] => {
        const errors: string[] = [];
        
        if ('name' in data && (!data.name || data.name.trim().length === 0)) {
            errors.push('Category name is required');
        }
        
        if ('name' in data && data.name && data.name.trim().length > 100) {
            errors.push('Category name must be less than 100 characters');
        }
        
        if ('slug' in data && (!data.slug || data.slug.trim().length === 0)) {
            errors.push('Category slug is required');
        }
        
        if ('slug' in data && data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
            errors.push('Category slug can only contain lowercase letters, numbers, and hyphens');
        }
        
        if ('description' in data && data.description && data.description.length > 500) {
            errors.push('Category description must be less than 500 characters');
        }
        
        if ('sortOrder' in data && data.sortOrder !== undefined && (data.sortOrder < 0 || data.sortOrder > 9999)) {
            errors.push('Sort order must be between 0 and 9999');
        }
        
        return errors;
    }
};

export default categoryService;
