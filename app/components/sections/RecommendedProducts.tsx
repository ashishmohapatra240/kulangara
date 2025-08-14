"use client";
import ProductCard from "@/app/components/ui/ProductCard";
import { useFeaturedProducts } from "@/app/hooks/useProducts";
import { IProduct } from "@/app/types/product.type";

export default function RecommendedProducts() {
  const { data: productsData, isLoading, error } = useFeaturedProducts();

  if (isLoading) {
    return (
      <section className="mt-16">
        <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
      <section className="mt-16">
        <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
        <div className="text-center text-red-500">Failed to load products</div>
      </section>
    );
  }

  const products: IProduct[] = productsData?.data?.slice(0, 4) || [];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: IProduct) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            discountedPrice={product.discountedPrice}
            images={product.images}
            category={product.category}
          />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center text-gray-500">No products to recommend</div>
      )}
    </section>
  );
}