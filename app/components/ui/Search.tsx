"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { useSearchProducts } from "@/app/hooks/useProducts";
import Link from "next/link";
import Image from "next/image";

export default function Search() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: searchResults, isLoading } = useSearchProducts(debouncedQuery);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Debounce query to avoid excessive API calls
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 focus:outline-none focus:border-black"
          aria-label="Search products"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </form>

      {/* Search Results Dropdown */}
      {isOpen && debouncedQuery.trim() && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-12 h-12 relative mr-4">
                    <Image
                      src={product.images?.[0]?.url || "/images/coming-soon.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.discountedPrice && product.discountedPrice < product.price ? (
                        <>
                          ₹{product.discountedPrice.toLocaleString()} <span className="line-through text-xs text-gray-400">₹{product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <>₹{product.price.toLocaleString()}</>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="p-4 text-center border-t border-gray-100">
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all results
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
