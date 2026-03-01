"use client";

import {
  useAdminProducts,
  useToggleFeaturedProduct,
} from "@/app/hooks/useProducts";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { Button } from "@/app/components/ui/button";
import ProductManagement from "@/app/components/admin/ProductManagement";
import { IProduct } from "@/app/types/product.type";
import Modal from "@/app/components/ui/Modal";
import ProductVariantsManagement from "@/app/components/admin/ProductVariantsManagement";
import ProductImagesManagement from "@/app/components/admin/ProductImagesManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-base font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showCreate) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 sm:pt-6 mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold">Create New Product</h1>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="w-full sm:w-auto">
              Back to Products
            </Button>
          </div>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <ProductManagement />
            </CardContent>
          </Card>
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
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 sm:pt-6 mb-6 pb-4 border-b">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <Button onClick={() => setShowCreate(true)} className="w-full sm:w-auto">Add Product</Button>
        </div>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base font-semibold">All Products</CardTitle>
            {!isProductsLoading && products.length > 0 && (
              <span className="text-sm font-medium text-black tracking-wide">
                TOTAL: {meta.total} PRODUCTS
              </span>
            )}
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {isProductsLoading ? (
              <div className="text-center text-muted-foreground py-16">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                No products found.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 w-[220px]">Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Fit</TableHead>
                      <TableHead className="pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: IProduct) => {
                      const fits = [
                        ...new Set(
                          (product.variants || [])
                            .map((v) => v.fit)
                            .filter(Boolean)
                        ),
                      ];
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="pl-6 font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.stockQuantity}</TableCell>
                          <TableCell>
                            {product.category?.name || product.categoryId}
                          </TableCell>
                          <TableCell>
                            {fits.length === 0 ? (
                              <span className="text-muted-foreground text-xs">—</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {fits.map((fit) => (
                                  <Badge
                                    key={fit}
                                    variant="secondary"
                                    className={
                                      fit === "OVERSIZED"
                                        ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    }
                                  >
                                    {fit === "OVERSIZED" ? "Oversized" : "Normal"}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditProduct(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setVariantProduct(product)}
                              >
                                Variants
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setImageProduct(product)}
                              >
                                Images
                              </Button>
                              <Button
                                size="sm"
                                variant={product.isFeatured ? "secondary" : "outline"}
                                onClick={() =>
                                  toggleFeatured.mutate({
                                    id: product.id,
                                    isFeatured: !product.isFeatured,
                                  })
                                }
                                disabled={toggleFeatured.isPending}
                              >
                                {product.isFeatured ? "Unmark Featured" : "Mark Featured"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page</span>
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="border rounded-md px-2 py-1 text-sm bg-background"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, meta.total)} of {meta.total}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (meta.totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
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
    </AdminLayout>
  );
}
