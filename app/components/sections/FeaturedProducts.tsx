"use client";
import { IProduct } from "@/app/types/product.type";
import ProductCard from "../ui/ProductCard";
import { useFeaturedProducts } from "@/app/hooks/useProducts";

export default function FeaturedProducts() {
  const { data: productsData, isLoading, error } = useFeaturedProducts();

  if (isLoading) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square mb-4"></div>
              <div className="h-4 bg-gray-200 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="text-center text-red-500">
          Failed to load featured products
        </div>
      </section>
    );
  }

  // Extract products array from the response
  const products = productsData?.data || [];

  return (
    <section className="py-16 container mx-auto px-4 max-w-6xl">
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product: IProduct) => (
          <ProductCard
            key={product.id}
            {...product}
            images={product.images || []}
          />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center text-gray-500">
          No featured products available
        </div>
      )}
    </section>
  );
}
