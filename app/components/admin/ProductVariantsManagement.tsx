"use client";

import { useState } from "react";
import {
  IProduct,
  IProductVariant,
  ICreateVariantData,
  IUpdateVariantData,
} from "@/app/types/product.type";
import { useAddProductVariant, useDeleteProductVariant, useUpdateProductVariant } from "@/app/hooks/useProducts";
import Button from "../ui/Button";

interface ProductVariantsManagementProps {
  product: IProduct;
  onClose: () => void;
}

export default function ProductVariantsManagement({
  product,
  onClose,
}: ProductVariantsManagementProps) {
  const [variants, setVariants] = useState<IProductVariant[]>(product.variants || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVariant, setEditingVariant] = useState<IProductVariant | null>(null);
  const [formData, setFormData] = useState<{
    size: string;
    color: string;
    price: string;
    sku: string;
    stock: string;
  }>({ size: "", color: "", price: "", sku: "", stock: "" });

  const addVariant = useAddProductVariant();
  const updateVariant = useUpdateProductVariant();
  const deleteVariant = useDeleteProductVariant();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const payload: ICreateVariantData = {
      size: formData.size,
      color: formData.color,
      price: Number(formData.price),
      sku: formData.sku,
      stock: Number(formData.stock),
    };
    addVariant.mutate(
      { productId: product.id, variantData: payload },
      {
        onSuccess: (created) => {
          setVariants((prev) => [...prev, (created as unknown as IProductVariant) ?? payload as unknown as IProductVariant]);
          setIsAdding(false);
          setFormData({ size: "", color: "", price: "", sku: "", stock: "" });
        },
      }
    );
  };

  const handleEdit = (variant: IProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size ?? "",
      color: variant.color ?? "",
      price: String(variant.price ?? ""),
      sku: variant.sku ?? "",
      stock: String(variant.stock ?? ""),
    });
  };

  const handleUpdate = async () => {
    if (!editingVariant) return;
    const payload: IUpdateVariantData = {
      size: formData.size,
      color: formData.color,
      price: formData.price !== "" ? Number(formData.price) : undefined,
      sku: formData.sku,
      stock: formData.stock !== "" ? Number(formData.stock) : undefined,
    };
    updateVariant.mutate(
      { productId: product.id, variantId: editingVariant.id, variantData: payload },
      {
        onSuccess: () => {
          setVariants((prev) => prev.map((v) => (v.id === editingVariant.id ? { ...v, ...payload } as IProductVariant : v)));
          setEditingVariant(null);
          setFormData({ size: "", color: "", price: "", sku: "", stock: "" });
        },
      }
    );
  };

  const handleDelete = async (variantId: string) => {
    if (!confirm('Delete this variant?')) return;
    deleteVariant.mutate(
      { productId: product.id, variantId },
      {
        onSuccess: () => setVariants((prev) => prev.filter((v) => v.id !== variantId)),
      }
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Variants for {product.name}</h2>
      <div className="mb-4">
        <Button
          onClick={() => {
            setIsAdding(true);
            setFormData({ size: "", color: "", price: "", sku: "", stock: "" });
          }}
        >
          Add Variant
        </Button>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium">Size</th>
              <th className="text-left px-4 py-2 font-medium">Color</th>
              <th className="text-left px-4 py-2 font-medium">Price</th>
              <th className="text-left px-4 py-2 font-medium">SKU</th>
              <th className="text-left px-4 py-2 font-medium">Stock</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{variant?.size || "N/A"}</td>
                <td className="px-4 py-2">{variant?.color || "N/A"}</td>
                <td className="px-4 py-2">₹{variant?.price || 0}</td>
                <td className="px-4 py-2">{variant?.sku || "N/A"}</td>
                <td className="px-4 py-2">{variant?.stock || 0}</td>
                <td className="px-4 py-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(variant)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(variant.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Form */}
      {(isAdding || editingVariant) && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isAdding) handleAdd();
            else handleUpdate();
          }}
          className="space-y-4 border-t pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={addVariant.isPending || updateVariant.isPending}>
              {addVariant.isPending || updateVariant.isPending ? "Saving..." : isAdding ? "Add" : "Update"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setEditingVariant(null);
                setFormData({ size: "", color: "", price: "", sku: "", stock: "" });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
