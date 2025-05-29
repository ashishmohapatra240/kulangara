"use client";

import { useState } from "react";
import ProductCard from "@/app/components/ui/ProductCard";
import { IoMdArrowDropdown } from "react-icons/io";
import Sidebar from "@/app/components/ui/products/Sidebar";
import { Product } from "../types/product";

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sarbagila T-Shirt",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sizes: ["S", "M", "L", "XL"],
    details: {
      material: "Cotton",
      dimensions: "100x100cm",
      care: ["Wash in cold water", "Do not bleach", "Iron on low heat"],
    },
    features: ["Breathable", "Comfortable", "Durable"],
    inStock: true,
    companyFeatures: [
      {
        icon: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Free Shipping",
        description: "Free shipping on all orders",
      },
    ],
    reviews: {
      rating: 4.5,
      total: 100,
      items: [],
    },
    deliveryInfo: {
      estimatedDays: "3-5 days",
      shippingFee: 0,
      returnPeriod: 30,
    },
    description: "This is a description of the product",
  },
];

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState("Featured");

  return (
    <div className="container mx-auto px-4 py-8 mt-30">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <Sidebar />

        {/* Products Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 border border-gray-300"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* No Results Message */}
          {DUMMY_PRODUCTS.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
