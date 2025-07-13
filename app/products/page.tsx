"use client";

import { useState } from "react";
import ProductCard from "@/app/components/ui/ProductCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { useProducts } from "../hooks/useProducts";
import { IProductSearchParams } from "../types/product.type";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useState<IProductSearchParams>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: productsData, isLoading, error } = useProducts(searchParams);

  const handleSortChange = (sortBy: string) => {
    let actualSortBy = sortBy;
    let sortOrder: "asc" | "desc" = "desc";

    if (sortBy === "price-asc") {
      actualSortBy = "price";
      sortOrder = "asc";
    } else if (sortBy === "price-desc") {
      actualSortBy = "price";
      sortOrder = "desc";
    }

    setSearchParams((prev: IProductSearchParams) => ({
      ...prev,
      sortBy: actualSortBy,
      sortOrder,
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-30">
        <div className="flex justify-end items-center mb-6">
          <div className="relative">
            <select
              className="appearance-none px-4 py-2 pr-8 border border-gray-300"
              disabled
            >
              <option>Loading...</option>
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square mb-4"></div>
              <div className="h-4 bg-gray-200 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-30">
        <div className="text-center text-red-500">Error loading products</div>
      </div>
    );
  }

  const products = productsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8 mt-30 max-w-7xl">
      <div className="flex justify-end items-center mb-6">
        <div className="relative">
          <select
            value={
              searchParams.sortBy === "price" &&
              searchParams.sortOrder === "asc"
                ? "price-asc"
                : searchParams.sortBy === "price" &&
                  searchParams.sortOrder === "desc"
                ? "price-desc"
                : searchParams.sortBy
            }
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 border border-gray-300"
          >
            <option value="createdAt">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} images={product.images || []} />
        ))}
      </div>

      {/* No Results Message */}
      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No products found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {productsData && productsData.meta.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from(
              { length: productsData.meta.totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setSearchParams((prev: IProductSearchParams) => ({ ...prev, page }))}
                className={`px-3 py-2 border ${
                  searchParams.page === page
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
