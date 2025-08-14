"use client";

import { useAdminProducts, useToggleFeaturedProduct } from "@/app/hooks/useProducts";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/app/components/layout/AdminLayout";
import Button from "@/app/components/ui/Button";
import ProductManagement from "@/app/components/admin/ProductManagement";
import { IProduct } from "@/app/types/product.type";
import Modal from "@/app/components/ui/Modal";
import ProductVariantsManagement from "@/app/components/admin/ProductVariantsManagement";
import ProductImagesManagement from "@/app/components/admin/ProductImagesManagement";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function AdminProductsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: productsData, isLoading: isProductsLoading } = useAdminProducts();
  const toggleFeatured = useToggleFeaturedProduct();
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [variantProduct, setVariantProduct] = useState<IProduct | null>(null);
  const [imageProduct, setImageProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/(auth)/login?redirect=/admin/products");
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (showCreate) {
    return (
      <AdminLayout>
        <div className="pt-30">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-normal">Create New Product</h1>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Back to Products
            </Button>
          </div>
          <div className="border border-gray-200 p-6">
            <ProductManagement />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const products = productsData?.data || [];

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">Products Management</h1>
          <Button onClick={() => setShowCreate(true)}>Add Product</Button>
        </div>
        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-normal">All Products</h2>
          </div>
          <div className="p-6">
            {isProductsLoading ? (
              <div className="text-center text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500">No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-2 font-medium">Name</th>
                      <th className="text-left px-4 py-2 font-medium">Price</th>
                      <th className="text-left px-4 py-2 font-medium">Stock</th>
                      <th className="text-left px-4 py-2 font-medium">Category</th>
                      <th className="text-left px-4 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: IProduct) => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">₹{product.price}</td>
                        <td className="px-4 py-2">{product.stockQuantity}</td>
                        <td className="px-4 py-2">{product.category?.name || product.categoryId}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditProduct(product)}>Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => setVariantProduct(product)}>Variants</Button>
                            <Button size="sm" variant="outline" onClick={() => setImageProduct(product)}>Images</Button>
                            <Button
                              size="sm"
                              variant={product.isFeatured ? "outline" : "secondary"}
                              onClick={() => toggleFeatured.mutate({ id: product.id, isFeatured: !product.isFeatured })}
                              disabled={toggleFeatured.isPending}
                            >
                              {product.isFeatured ? "Unmark Featured" : "Mark Featured"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Edit Product Modal */}
        {editProduct && (
          <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)}>
            <div className="p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              {/* TODO: Pass product data to ProductManagement for editing */}
              <ProductManagement product={editProduct} onClose={() => setEditProduct(null)} />
            </div>
          </Modal>
        )}

        {/* Variants Modal */}
        {variantProduct && (
          <Modal isOpen={!!variantProduct} onClose={() => setVariantProduct(null)} maxWidth="max-w-2xl">
            <ProductVariantsManagement product={variantProduct} onClose={() => setVariantProduct(null)} />
          </Modal>
        )}

        {/* Images Modal */}
        {imageProduct && (
          <Modal isOpen={!!imageProduct} onClose={() => setImageProduct(null)} maxWidth="max-w-2xl">
            <ProductImagesManagement product={imageProduct} onClose={() => setImageProduct(null)} />
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
} 