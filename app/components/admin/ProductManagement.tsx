"use client";

import { useState, useEffect } from "react";
import { useCategories, useCreateProduct, useUpdateProduct } from "@/app/hooks/useProducts";
import {
  ICreateProductData,
  IUpdateProductData,
} from "@/app/types/product.type";
import { IProduct } from "@/app/types/product.type";
import Button from "../ui/Button";

interface ProductManagementProps {
  product?: IProduct | null;
  onClose?: () => void;
}

export default function ProductManagement({ product, onClose }: ProductManagementProps) {
  const isEditMode = !!product;
  const [formData, setFormData] = useState<Partial<ICreateProductData>>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    sku: product?.sku || "",
    stockQuantity: product?.stockQuantity || 0,
    categoryId: product?.categoryId || "",
    care: product?.care || [],
    material: product?.material || "",
    gender: product?.gender || "UNISEX",
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (createProductMutation.isSuccess || updateProductMutation.isSuccess) {
      onClose?.();
    }
  }, [createProductMutation.isSuccess, updateProductMutation.isSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && product) {
      updateProductMutation.mutate(
        { id: product.id, data: formData as IUpdateProductData }
      );
    } else {
      createProductMutation.mutate(formData as ICreateProductData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<ICreateProductData>) => ({
      ...prev,
      [name]: name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Product" : "Create New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData((prev: Partial<ICreateProductData>) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="" disabled>
              {categoriesLoading ? "Loading categories..." : "Select category"}
            </option>
            {(categoriesResponse?.data || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev: Partial<ICreateProductData>) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="UNISEX">Unisex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={
              createProductMutation.isPending || updateProductMutation.isPending
            }
          >
            {createProductMutation.isPending || updateProductMutation.isPending
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
