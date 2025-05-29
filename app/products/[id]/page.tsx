import { notFound } from "next/navigation";

import Button from "@/app/components/ui/Button";
import { FaTruck, FaCreditCard, FaStar, FaShieldAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";

import { Product } from "@/app/types/product";
import Image from "next/image";

async function getProduct(id: string): Promise<Product> {
  return {
    id,
    name: "Classic Black Tee",
    price: 2999,
    discountedPrice: 2499,
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1559697242-a465f2578a95?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A timeless black t-shirt crafted from premium cotton. Perfect for everyday wear, this versatile piece features a comfortable fit and excellent durability. The classic design makes it easy to pair with any outfit.",
    details: {
      material: "100% Premium Cotton",
      dimensions: 'S: 38" x 28", M: 40" x 29", L: 42" x 30", XL: 44" x 31"',
      care: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
      ],
    },
    features: [
      "Premium cotton fabric for comfort and durability",
      "Classic crew neck design",
      "Regular fit for everyday wear",
      "Reinforced seams for longevity",
      "Machine washable for easy care",
    ],
    inStock: true,
    companyFeatures: [
      {
        icon: "truck",
        title: "Express Shipping",
        description: "Free express shipping on orders above ₹999",
      },
      {
        icon: "credit-card",
        title: "Zero Interest EMI",
        description: "Available on all major credit cards",
      },
      {
        icon: "shield",
        title: "Secure Checkout",
        description: "100% secure payment",
      },
    ],
    reviews: {
      rating: 4.5,
      total: 128,
      items: [
        {
          user: "John D.",
          rating: 5,
          date: "2024-03-15",
          comment: "Excellent quality and perfect fit!",
        },
      ],
    },
    deliveryInfo: {
      estimatedDays: "3-5",
      shippingFee: 0,
      returnPeriod: 30,
    },
  };
}

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 mt-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white"
            aria-label="Add to wishlist"
          >
            <CiHeart className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-2xl font-semibold">
                ₹{product.discountedPrice || product.price}
              </p>
              {product.discountedPrice && (
                <p className="text-lg text-gray-500 line-through">
                  ₹{product.price}
                </p>
              )}
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.reviews.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews.total} reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="block font-medium">Select Size</label>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="w-12 h-12 border hover:border-black"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between gap-4">
            <Button className="w-full">Add to Cart</Button>
            <Button variant="outline" className="w-full">
              Buy Now
            </Button>
          </div>

          {/* Company Features */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Why Shop With Us</h2>
            <div className="grid grid-cols-1 gap-4">
              {product.companyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100">
                    {feature.icon === "truck" && (
                      <FaTruck className="w-5 h-5" />
                    )}
                    {feature.icon === "credit-card" && (
                      <FaCreditCard className="w-5 h-5" />
                    )}
                    {feature.icon === "shield" && (
                      <FaShieldAlt className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer">
                <h2 className="text-xl font-semibold">Delivery & Returns</h2>
                <IoMdArrowDropdown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium">Delivery</h3>
                  <p className="text-gray-600">
                    Estimated delivery in {product.deliveryInfo.estimatedDays}{" "}
                    business days
                    {product.deliveryInfo.shippingFee === 0
                      ? " (Free Shipping)"
                      : ` (₹${product.deliveryInfo.shippingFee} shipping fee)`}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Returns</h3>
                  <p className="text-gray-600">
                    Easy {product.deliveryInfo.returnPeriod}-day return policy
                  </p>
                </div>
              </div>
            </details>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            {product.details.material && (
              <div>
                <h3 className="font-medium">Material</h3>
                <p className="text-gray-600">{product.details.material}</p>
              </div>
            )}
            {product.details.dimensions && (
              <div>
                <h3 className="font-medium">Dimensions</h3>
                <p className="text-gray-600">{product.details.dimensions}</p>
              </div>
            )}
          </div>

          {/* Care Instructions */}
          {product.details.care && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Care Instructions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {product.details.care.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="grid grid-cols-1 gap-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="w-1 h-1 bg-gray-400 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.items.map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.user}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
