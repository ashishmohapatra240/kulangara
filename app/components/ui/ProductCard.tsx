"use client";

import Image from "next/image";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Button from "./Button";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsInWishlist(!isInWishlist);
  };

  return (
    <div className="group relative bg-white">
      <div className="aspect-square w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <CiHeart className="w-5 h-5" />
          )}
        </button>
      </div>
      <div>
        <div>
          <div className="flex flex-row justify-between my-2">
            <h3 className="text-lg font-medium">
              <Link href={`/products/${id}`} className="hover:underline">
                {name}
              </Link>
            </h3>
            <p className="text-gray-900 font-medium">₹{price}</p>
          </div>
        </div>
        <Link href={`/cart`}>
          <Button variant="outline" size="sm" className="w-full">
            Add to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}
