"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useAdminCategories, useDeleteCategory } from "@/app/hooks/useCategories";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/app/components/layout/AdminLayout";
import Button from "@/app/components/ui/Button";
import CategoryManagement from "@/app/components/admin/CategoryManagement";
import Modal from "@/app/components/ui/Modal";
import { ICategory } from "@/app/types/category.type";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function AdminCategoriesPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const { data: categoriesData, isLoading: isCategoriesLoading, refetch: refetchCategories } = useAdminCategories();
    const deleteCategoryMutation = useDeleteCategory();
    
    const [showCreate, setShowCreate] = useState(false);
    const [editCategory, setEditCategory] = useState<ICategory | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<ICategory | null>(null);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace("/(auth)/login?redirect=/admin/categories");
            } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
                router.replace("/");
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <h1 className="text-3xl font-bold tracking-tight">LOADING...</h1>
            </div>
        );
    }

    const handleDeleteConfirm = () => {
        if (deleteCategory) {
            deleteCategoryMutation.mutate(deleteCategory.id);
            setDeleteCategory(null);
        }
    };

    if (showCreate) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-white">
                    <div className="flex justify-between items-center mb-12 pb-6 border-b-2 border-black">
                        <h1 className="text-4xl font-bold tracking-tight">CREATE NEW CATEGORY</h1>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>
                            BACK TO CATEGORIES
                        </Button>
                    </div>
                    <div className="border-2 border-black p-8">
                        <CategoryManagement onClose={() => setShowCreate(false)} />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const categories = categoriesData?.data || [];
    
    console.log('Categories Debug Info:', {
        categoriesData,
        categoriesLength: categories.length,
        categories: categories.map(c => ({ id: c.id, name: c.name }))
    });

    return (
        <AdminLayout>
            <div className="min-h-screen bg-white">
                <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
                    <h1 className="text-4xl font-bold tracking-tight">CATEGORIES MANAGEMENT</h1>
                    <div className="space-x-3">
                        <Button variant="outline" onClick={() => refetchCategories()}>
                            REFRESH
                        </Button>
                        <Button onClick={() => setShowCreate(true)}>ADD CATEGORY</Button>
                    </div>
                </div>

                <div className="">
                    {isCategoriesLoading ? (
                        <div className="p-12 text-center">
                            <p className="text-black font-bold tracking-wide">LOADING CATEGORIES...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-600 font-medium tracking-wide mb-6">NO CATEGORIES FOUND.</p>
                            <Button 
                                onClick={() => setShowCreate(true)}
                                className="mt-4"
                            >
                                CREATE YOUR FIRST CATEGORY
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            CATEGORY
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            SLUG
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            PARENT
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            PRODUCTS
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            STATUS
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest border-r border-gray-700">
                                            SORT
                                        </th>
                                        <th className="px-8 py-4 text-left text-sm font-bold tracking-widest">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {categories.map((category, index) => (
                                        <tr key={category.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-8 py-6 border-r border-gray-200">
                                                <div className="flex items-center">
                                                    {category.image && (
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover mr-4 border-2 border-black"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-lg font-bold text-black tracking-wide">
                                                            {category.name}
                                                        </div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-600 font-medium truncate max-w-xs">
                                                                {category.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-black border-r border-gray-200">
                                                {category.slug}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-black border-r border-gray-200">
                                                {category.parent ? category.parent.name : 'NONE'}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-black border-r border-gray-200">
                                                {category._count?.products || 0}
                                            </td>
                                            <td className="px-8 py-6 border-r border-gray-200">
                                                <span
                                                    className={`px-3 py-1 text-xs font-bold tracking-widest ${
                                                        category.isActive
                                                            ? 'bg-black text-white'
                                                            : 'bg-white text-black border border-black'
                                                    }`}
                                                >
                                                    {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-black border-r border-gray-200">
                                                {category.sortOrder}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => setEditCategory(category)}
                                                    className="px-4 py-2 bg-white text-black border-2 border-black font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
                                                >
                                                    EDIT
                                                </button>
                                                <button
                                                    onClick={() => setDeleteCategory(category)}
                                                    className="px-4 py-2 bg-white text-black border-2 border-black font-bold tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={(category._count?.products ?? 0) > 0}
                                                >
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Edit Category Modal */}
                {editCategory && (
                    <Modal
                        isOpen={!!editCategory}
                        onClose={() => setEditCategory(null)}
                    >
                        <CategoryManagement
                            category={editCategory}
                            onClose={() => setEditCategory(null)}
                        />
                    </Modal>
                )}

                {/* Delete Confirmation Modal */}
                {deleteCategory && (
                    <Modal
                        isOpen={!!deleteCategory}
                        onClose={() => setDeleteCategory(null)}
                    >
                        <div className="p-8 border-2 border-black">
                            <h3 className="text-2xl font-bold text-black mb-6 tracking-tight">DELETE CATEGORY</h3>
                            <p className="text-black font-medium mb-6 tracking-wide">
                                ARE YOU SURE YOU WANT TO DELETE THE CATEGORY &quot;{deleteCategory.name.toUpperCase()}&quot;?
                                {deleteCategory._count?.products && deleteCategory._count.products > 0 && (
                                    <span className="block mt-4 text-black font-bold tracking-wide border-2 border-black p-4">
                                        THIS CATEGORY HAS {deleteCategory._count.products} PRODUCT(S) AND CANNOT BE DELETED.
                                    </span>
                                )}
                            </p>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteCategory(null)}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteCategoryMutation.isPending || 
                                        (deleteCategory._count?.products ?? 0) > 0}
                                >
                                    {deleteCategoryMutation.isPending ? 'DELETING...' : 'DELETE'}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AdminLayout>
    );
}
