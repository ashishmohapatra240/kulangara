"use client";

import { useState, useEffect } from "react";
import {
  IProduct,
  IProductVariant,
  IUpdateVariantData,
  PRODUCT_SIZES,
  ProductSize,
  ProductFit,
} from "@/app/types/product.type";
import {
  useBulkAddProductVariants,
  useDeleteProductVariant,
  useUpdateProductVariant,
  useProduct,
} from "@/app/hooks/useProducts";
import { Button } from "../ui/button";

interface ProductVariantsManagementProps {
  product: IProduct;
  onClose: () => void;
}

interface SizeRow {
  size: ProductSize;
  stock: string;
  price: string;
  color: string;
  include: boolean;
}

type FitSections = Record<ProductFit, SizeRow[]>;

function buildInitialSections(
  existingVariants: IProductVariant[],
  productPrice: number
): FitSections {
  const build = (fit: ProductFit): SizeRow[] =>
    PRODUCT_SIZES.map((size) => {
      const existing = existingVariants.find(
        (v) => v.size === size && v.fit === fit
      );
      return {
        size,
        stock: existing ? String(existing.stock) : "100",
        price: existing?.price ? String(existing.price) : String(productPrice),
        color: existing?.color ?? "Black",
        include: !!existing,
      };
    });

  return {
    NORMAL: build("NORMAL"),
    OVERSIZED: build("OVERSIZED"),
  };
}

const FIT_LABELS: Record<ProductFit, string> = {
  NORMAL: "Normal",
  OVERSIZED: "Oversized",
};

const FIT_SKU_SUFFIX: Record<ProductFit, string> = {
  NORMAL: "N",
  OVERSIZED: "OS",
};

export default function ProductVariantsManagement({
  product,
  onClose,
}: ProductVariantsManagementProps) {
  // Always pull fresh data so the list stays in sync after saves/deletes
  const { data: freshProduct } = useProduct(product.id);
  const variants = ((freshProduct?.variants ?? product.variants) || []) as IProductVariant[];

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [sections, setSections] = useState<FitSections>(() =>
    buildInitialSections(product.variants || [], product.price)
  );
  const [editingVariant, setEditingVariant] =
    useState<IProductVariant | null>(null);
  const [editForm, setEditForm] = useState<{
    stock: string;
    price: string;
    color: string;
  }>({ stock: "", price: "", color: "" });

  const bulkAdd = useBulkAddProductVariants();
  const updateVariant = useUpdateProductVariant();
  const deleteVariant = useDeleteProductVariant();

  // Re-sync the bulk modal rows whenever fresh variants arrive (after save/delete)
  useEffect(() => {
    if (!showBulkModal) {
      setSections(buildInitialSections(variants, product.price));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.length, showBulkModal]);

  const handleRowChange = (
    fit: ProductFit,
    size: ProductSize,
    field: keyof Omit<SizeRow, "size">,
    value: string | boolean
  ) => {
    setSections((prev) => ({
      ...prev,
      [fit]: prev[fit].map((r) =>
        r.size === size ? { ...r, [field]: value } : r
      ),
    }));
  };

  const totalSelected =
    sections.NORMAL.filter((r) => r.include).length +
    sections.OVERSIZED.filter((r) => r.include).length;

  const handleBulkSave = () => {
    const payload = (["NORMAL", "OVERSIZED"] as ProductFit[]).flatMap((fit) =>
      sections[fit]
        .filter((r) => r.include)
        .map((r) => ({
          size: r.size,
          fit,
          stock: Number(r.stock) || 0,
          price: r.price !== "" ? Number(r.price) : undefined,
          color: r.color || undefined,
          sku: `${product.sku}-${FIT_SKU_SUFFIX[fit]}-${r.size}`,
        }))
    );

    if (payload.length === 0) return;

    bulkAdd.mutate(
      { productId: product.id, variants: payload as never },
      {
        onSuccess: () => {
          setShowBulkModal(false);
        },
      }
    );
  };

  const handleEditOpen = (variant: IProductVariant) => {
    setEditingVariant(variant);
    setEditForm({
      stock: String(variant.stock ?? ""),
      price: variant.price ? String(variant.price) : "",
      color: variant.color ?? "",
    });
  };

  const handleEditSave = () => {
    if (!editingVariant) return;
    const payload: IUpdateVariantData = {
      stock: editForm.stock !== "" ? Number(editForm.stock) : undefined,
      price: editForm.price !== "" ? Number(editForm.price) : undefined,
      color: editForm.color || undefined,
    };
    updateVariant.mutate(
      {
        productId: product.id,
        variantId: editingVariant.id,
        variantData: payload,
      },
      {
        onSuccess: () => {
          setEditingVariant(null);
        },
      }
    );
  };

  const handleDelete = (variantId: string) => {
    if (!confirm("Delete this variant?")) return;
    deleteVariant.mutate({ productId: product.id, variantId });
  };

  const groupedVariants = {
    NORMAL: variants.filter((v) => v.fit === "NORMAL"),
    OVERSIZED: variants.filter((v) => v.fit === "OVERSIZED"),
    UNSET: variants.filter((v) => !v.fit),
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Variants — {product.name}</h2>
        <Button onClick={() => setShowBulkModal(true)}>
          + Add / Update Variants
        </Button>
      </div>

      {/* Existing variants grouped by fit */}
      {variants.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">
          No variants yet. Click &quot;Add / Update Variants&quot; to add
          sizes.
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {(["NORMAL", "OVERSIZED"] as ProductFit[]).map((fit) => {
            const group = groupedVariants[fit];
            if (group.length === 0) return null;
            return (
              <div key={fit}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      fit === "OVERSIZED"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {FIT_LABELS[fit]}
                  </span>
                </div>
                <table className="min-w-full text-sm border border-gray-100 rounded overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2 font-medium">Size</th>
                      <th className="text-left px-4 py-2 font-medium">Color</th>
                      <th className="text-left px-4 py-2 font-medium">Price</th>
                      <th className="text-left px-4 py-2 font-medium">SKU</th>
                      <th className="text-left px-4 py-2 font-medium">Stock</th>
                      <th className="text-left px-4 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((variant) => (
                      <tr key={variant.id} className="border-b border-gray-100">
                        <td className="px-4 py-2">
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded">
                            {variant.size}
                          </span>
                        </td>
                        <td className="px-4 py-2">{variant.color || "—"}</td>
                        <td className="px-4 py-2">
                          {variant.price ? `₹${variant.price}` : "—"}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-4 py-2">{variant.stock}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOpen(variant)}
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
            );
          })}

          {/* Legacy variants without a fit value */}
          {groupedVariants.UNSET.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  Unassigned
                </span>
              </div>
              <table className="min-w-full text-sm border border-gray-100 rounded overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 font-medium">Size</th>
                    <th className="text-left px-4 py-2 font-medium">SKU</th>
                    <th className="text-left px-4 py-2 font-medium">Stock</th>
                    <th className="text-left px-4 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedVariants.UNSET.map((variant) => (
                    <tr key={variant.id} className="border-b border-gray-100">
                      <td className="px-4 py-2">{variant.size}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{variant.sku}</td>
                      <td className="px-4 py-2">{variant.stock}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOpen(variant)}
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
          )}
        </div>
      )}

      {/* Inline edit form */}
      {editingVariant && (
        <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
          <h3 className="font-semibold mb-3 text-sm">
            Edit Variant —{" "}
            {editingVariant.fit ? `${FIT_LABELS[editingVariant.fit]} ` : ""}
            {editingVariant.size}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Stock</label>
              <input
                type="number"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, stock: e.target.value }))
                }
                min="0"
                className="w-full px-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Price Override (₹)
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, price: e.target.value }))
                }
                min="0"
                placeholder="Product price"
                className="w-full px-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Color</label>
              <input
                type="text"
                value={editForm.color}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, color: e.target.value }))
                }
                placeholder="Optional"
                className="w-full px-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleEditSave}
              disabled={updateVariant.isPending}
            >
              {updateVariant.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingVariant(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Bulk size matrix modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold">Add / Update Variants</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-black text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-1">
              <p className="text-sm text-gray-500 mb-5">
                Check the sizes you want. SKUs are auto-generated as{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  {product.sku}-N-M
                </code>{" "}
                (Normal) /{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  {product.sku}-OS-M
                </code>{" "}
                (Oversized).
              </p>

              {(["NORMAL", "OVERSIZED"] as ProductFit[]).map((fit) => (
                <div key={fit} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        fit === "OVERSIZED"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {FIT_LABELS[fit]} Fit
                    </span>
                    <button
                      type="button"
                      className="text-xs text-gray-400 hover:text-black underline ml-2"
                      onClick={() =>
                        setSections((prev) => ({
                          ...prev,
                          [fit]: prev[fit].map((r) => ({
                            ...r,
                            include: !prev[fit].every((r2) => r2.include),
                          })),
                        }))
                      }
                    >
                      {sections[fit].every((r) => r.include)
                        ? "Deselect all"
                        : "Select all"}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium w-8">
                            <span className="sr-only">Include</span>
                          </th>
                          <th className="text-left px-3 py-2 font-medium">
                            Size
                          </th>
                          <th className="text-left px-3 py-2 font-medium">
                            Stock
                          </th>
                          <th className="text-left px-3 py-2 font-medium">
                            Price Override (₹)
                          </th>
                          <th className="text-left px-3 py-2 font-medium">
                            Color
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections[fit].map((row) => (
                          <tr
                            key={row.size}
                            className={`border-t border-gray-100 ${
                              row.include ? "bg-white" : "bg-gray-50 opacity-60"
                            }`}
                          >
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={row.include}
                                onChange={(e) =>
                                  handleRowChange(
                                    fit,
                                    row.size,
                                    "include",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 accent-black"
                              />
                            </td>
                            <td className="px-3 py-2 font-semibold">
                              {row.size}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={row.stock}
                                onChange={(e) =>
                                  handleRowChange(
                                    fit,
                                    row.size,
                                    "stock",
                                    e.target.value
                                  )
                                }
                                disabled={!row.include}
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 text-sm focus:outline-none focus:border-black disabled:bg-gray-100"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={row.price}
                                onChange={(e) =>
                                  handleRowChange(
                                    fit,
                                    row.size,
                                    "price",
                                    e.target.value
                                  )
                                }
                                disabled={!row.include}
                                min="0"
                                placeholder="Product price"
                                className="w-28 px-2 py-1 border border-gray-300 text-sm focus:outline-none focus:border-black disabled:bg-gray-100"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={row.color}
                                onChange={(e) =>
                                  handleRowChange(
                                    fit,
                                    row.size,
                                    "color",
                                    e.target.value
                                  )
                                }
                                disabled={!row.include}
                                placeholder="Optional"
                                className="w-24 px-2 py-1 border border-gray-300 text-sm focus:outline-none focus:border-black disabled:bg-gray-100"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkSave}
                disabled={bulkAdd.isPending || totalSelected === 0}
              >
                {bulkAdd.isPending
                  ? "Saving..."
                  : `Save ${totalSelected} Variant${totalSelected !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
