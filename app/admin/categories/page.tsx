"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useAdminCategories, useDeleteCategory } from "@/app/hooks/useCategories";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { Button } from "@/app/components/ui/button";
import CategoryManagement from "@/app/components/admin/CategoryManagement";
import Modal from "@/app/components/ui/Modal";
import { ICategory } from "@/app/types/category.type";
import { Card, CardContent } from "@/app/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

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
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-base font-medium text-muted-foreground">Loading...</p>
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
                <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 sm:pt-6 mb-6 pb-4 border-b">
                        <h1 className="text-2xl font-bold">Create New Category</h1>
                        <Button variant="outline" onClick={() => setShowCreate(false)} className="w-full sm:w-auto">
                            Back to Categories
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <CategoryManagement onClose={() => setShowCreate(false)} />
                        </CardContent>
                    </Card>
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
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-black hover:bg-black">
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        CATEGORY
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        SLUG
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        PARENT
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        PRODUCTS
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        STATUS
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest border-r border-gray-700">
                                        SORT
                                    </TableHead>
                                    <TableHead className="px-8 py-4 text-white font-bold tracking-widest">
                                        ACTIONS
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category, index) => (
                                    <TableRow
                                        key={category.id}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <TableCell className="px-8 py-6 border-r border-gray-200">
                                            <div className="flex items-center gap-4">
                                                {category.image && (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover border-2 border-black shrink-0"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-black tracking-wide">
                                                        {category.name}
                                                    </div>
                                                    {category.description && (
                                                        <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                                                            {category.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-sm font-mono text-gray-700 border-r border-gray-200">
                                            {category.slug}
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-sm font-medium text-black border-r border-gray-200">
                                            {category.parent ? category.parent.name : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-sm font-bold text-black border-r border-gray-200">
                                            {category._count?.products || 0}
                                        </TableCell>
                                        <TableCell className="px-8 py-6 border-r border-gray-200">
                                            <Badge
                                                className={
                                                    category.isActive
                                                        ? "bg-black text-white border-black rounded-none tracking-widest text-xs font-bold"
                                                        : "bg-white text-black border-black rounded-none tracking-widest text-xs font-bold"
                                                }
                                                variant="outline"
                                            >
                                                {category.isActive ? "ACTIVE" : "INACTIVE"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-sm font-bold text-black border-r border-gray-200">
                                            {category.sortOrder}
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditCategory(category)}
                                                    className="px-4 py-2 bg-white text-black border-2 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
                                                >
                                                    EDIT
                                                </button>
                                                <button
                                                    onClick={() => setDeleteCategory(category)}
                                                    className="px-4 py-2 bg-white text-black border-2 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    disabled={(category._count?.products ?? 0) > 0}
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
