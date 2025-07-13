import ProductCard from "@/app/components/ui/ProductCard";
import { DUMMY_WISHLIST } from "@/app/data/wishlist";

export default function RecommendedProducts() {
  // Using DUMMY_WISHLIST as sample products
  const recommendedProducts = DUMMY_WISHLIST.slice(0, 4);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            images={product.images || []}
          />
        ))}
      </div>
    </section>
  );
} 