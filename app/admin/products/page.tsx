"use client";

import {
  useAdminProducts,
  useToggleFeaturedProduct,
} from "@/app/hooks/useProducts";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: productsData, isLoading: isProductsLoading } = useAdminProducts(
    {
      page: currentPage,
      limit: pageSize,
    }
  );
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

  if (
    isLoading ||
    !isAuthenticated ||
    !user ||
    !ALLOWED_ROLES.includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold tracking-tight">LOADING...</h1>
      </div>
    );
  }

  if (showCreate) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-white">
          <div className="flex justify-between items-center mb-12 pb-6 border-b-2 border-black">
            <h1 className="text-4xl font-bold tracking-tight">CREATE NEW PRODUCT</h1>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              BACK TO PRODUCTS
            </Button>
          </div>
          <div className="border-2 border-black p-8">
            <ProductManagement />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const products = productsData?.data || [];
  const meta = productsData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
          <h1 className="text-4xl font-bold tracking-tight">PRODUCTS MANAGEMENT</h1>
          <Button onClick={() => setShowCreate(true)}>ADD PRODUCT</Button>
        </div>
        <div className="border-2 border-black">
          <div className="p-8 border-b-2 border-black bg-white flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black tracking-tight">ALL PRODUCTS</h2>
            {!isProductsLoading && products.length > 0 && (
              <span className="text-sm font-medium text-black tracking-wide">
                TOTAL: {meta.total} PRODUCTS
              </span>
            )}
          </div>
          <div className="p-8">
            {isProductsLoading ? (
              <div className="text-center text-black font-bold tracking-wide py-12">
                LOADING PRODUCTS...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-600 font-medium tracking-wide py-12">
                NO PRODUCTS FOUND.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white text-black">
                      <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">NAME</th>
                      <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">PRICE</th>
                      <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">STOCK</th>
                      <th className="text-left px-8 py-4 font-bold tracking-widest border-r border-gray-700">
                        CATEGORY
                      </th>
                      <th className="text-left px-8 py-4 font-bold tracking-widest">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: IProduct, index) => (
                      <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-8 py-4 font-medium text-black border-r border-gray-200">{product.name}</td>
                        <td className="px-8 py-4 font-bold text-black border-r border-gray-200">₹{product.price}</td>
                        <td className="px-8 py-4 font-medium text-black border-r border-gray-200">{product.stockQuantity}</td>
                        <td className="px-8 py-4 font-medium text-black border-r border-gray-200">
                          {product.category?.name || product.categoryId}
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditProduct(product)}
                            >
                              EDIT
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVariantProduct(product)}
                            >
                              VARIANTS
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setImageProduct(product)}
                            >
                              IMAGES
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                product.isFeatured ? "outline" : "secondary"
                              }
                              onClick={() =>
                                toggleFeatured.mutate({
                                  id: product.id,
                                  isFeatured: !product.isFeatured,
                                })
                              }
                              disabled={toggleFeatured.isPending}
                            >
                              {product.isFeatured
                                ? "UNMARK FEATURED"
                                : "MARK FEATURED"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {products.length > 0 && (
              <div className="mt-8 flex items-center justify-between border-t-2 border-black pt-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-black tracking-widest">SHOW</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="border-2 border-black px-3 py-2 text-sm font-medium"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm font-bold text-black tracking-widest">ENTRIES</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-black tracking-wide">
                    SHOWING {(currentPage - 1) * pageSize + 1} TO{" "}
                    {Math.min(currentPage * pageSize, meta.total)} OF{" "}
                    {meta.total} RESULTS
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 text-sm border-2 border-black font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    PREVIOUS
                  </button>

                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (meta.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= meta.totalPages - 2) {
                        pageNum = meta.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm border-2 border-black font-bold ${
                            currentPage === pageNum
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-black hover:text-white transition-colors"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= meta.totalPages}
                    className="px-4 py-2 text-sm border-2 border-black font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {editProduct && (
          <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)}>
            <div className="p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <ProductManagement
                product={editProduct}
                onClose={() => setEditProduct(null)}
              />
            </div>
          </Modal>
        )}

        {variantProduct && (
          <Modal
            isOpen={!!variantProduct}
            onClose={() => setVariantProduct(null)}
            maxWidth="max-w-2xl"
          >
            <ProductVariantsManagement
              product={variantProduct}
              onClose={() => setVariantProduct(null)}
            />
          </Modal>
        )}

        {imageProduct && (
          <Modal
            isOpen={!!imageProduct}
            onClose={() => setImageProduct(null)}
            maxWidth="max-w-2xl"
          >
            <ProductImagesManagement
              product={imageProduct}
              onClose={() => setImageProduct(null)}
            />
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
