import { FEATURED_PRODUCTS } from "@/app/data/featured-products";
import ProductCard from "../ui/ProductCard";

export default function FeaturedProducts() {
  return (
    <section className="py-16 container mx-auto px-4 max-w-6xl">
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
