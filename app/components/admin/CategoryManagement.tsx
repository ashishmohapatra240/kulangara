"use client";

import { useState, useEffect } from "react";
import { 
    useCreateCategory, 
    useUpdateCategory, 
    useCategories, 
    useGenerateSlug 
} from "@/app/hooks/useCategories";
import { ICategory, ICategoryCreate, ICategoryUpdate } from "@/app/types/category.type";
import Button from "../ui/Button";

interface CategoryManagementProps {
    category?: ICategory;
    onClose?: () => void;
}

export default function CategoryManagement({ category, onClose }: CategoryManagementProps) {
    const isEditMode = !!category;
    const { generateSlug } = useGenerateSlug();
    
    const [formData, setFormData] = useState<Partial<ICategoryCreate>>({
        name: category?.name || "",
        slug: category?.slug || "",
        description: category?.description || "",
        parentId: category?.parentId || "",
        isActive: category?.isActive ?? true,
        sortOrder: category?.sortOrder || 0,
        image: category?.image || "",
    });

    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!isEditMode);

    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

    useEffect(() => {
        if (createCategoryMutation.isSuccess || updateCategoryMutation.isSuccess) {
            onClose?.();
        }
    }, [createCategoryMutation.isSuccess, updateCategoryMutation.isSuccess, onClose]);

    // Auto-generate slug when name changes
    useEffect(() => {
        if (autoGenerateSlug && formData.name) {
            setFormData(prev => ({
                ...prev,
                slug: generateSlug(formData.name || "")
            }));
        }
    }, [formData.name, autoGenerateSlug, generateSlug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditMode && category) {
            // Filter out empty/null values for updates to avoid validation errors
            const updateData: ICategoryUpdate = {};
            
            // Only include fields that have been changed or have meaningful values
            if (formData.name && formData.name.trim() !== '') {
                updateData.name = formData.name.trim();
            }
            if (formData.slug && formData.slug.trim() !== '') {
                updateData.slug = formData.slug.trim();
            }
            if (formData.description !== undefined) {
                updateData.description = formData.description?.trim() || undefined;
            }
            if (formData.image && formData.image.trim() !== '') {
                updateData.image = formData.image.trim();
            }
            if (formData.parentId !== undefined && formData.parentId !== '') {
                updateData.parentId = formData.parentId;
            } else if (formData.parentId === '') {
                updateData.parentId = undefined;
            }
            if (formData.isActive !== undefined) {
                updateData.isActive = formData.isActive;
            }
            if (formData.sortOrder !== undefined) {
                updateData.sortOrder = formData.sortOrder;
            }

            updateCategoryMutation.mutate({
                id: category.id,
                data: updateData
            });
        } else {
            const createData = { ...formData } as ICategoryCreate;
            
            if (!createData.image || createData.image.trim() === '') {
                delete createData.image;
            }
            
            if (!createData.parentId || createData.parentId.trim() === '') {
                delete createData.parentId;
            }
            
            if (createData.name) {
                createData.name = createData.name.trim();
            }
            if (createData.slug) {
                createData.slug = createData.slug.trim();
            }
            if (createData.description) {
                createData.description = createData.description.trim();
            }
            
            createCategoryMutation.mutate(createData);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        
        if (name === 'slug') {
            setAutoGenerateSlug(false);
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : 
                   type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                   value,
        }));
    };

    const parentCategories = categoriesResponse?.data?.filter(cat => !cat.parentId) || [];

    const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">
                {isEditMode ? "Edit Category" : "Create New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter category name"
                    />
                </div>

                {/* Category Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Slug *
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="category-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        URL-friendly version of the name. Only lowercase letters, numbers, and hyphens allowed.
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter category description"
                    />
                </div>

                {/* Parent Category */}
                <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category
                    </label>
                    <select
                        id="parentId"
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        disabled={categoriesLoading}
                    >
                        <option value="">None (Top Level Category)</option>
                        {parentCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Sort Order */}
                <div>
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        id="sortOrder"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        min="0"
                        max="9999"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Lower numbers appear first. Use 0 for default ordering.
                    </p>
                </div>

                {/* Active Status */}
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Active (category will be visible to customers)
                        </span>
                    </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            isEditMode ? "Updating..." : "Creating..."
                        ) : (
                            isEditMode ? "Update Category" : "Create Category"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
