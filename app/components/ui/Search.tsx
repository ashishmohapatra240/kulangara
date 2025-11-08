"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { useSearchProducts } from "@/app/hooks/useProducts";
import Link from "next/link";
import Image from "next/image";
import { Input } from "./input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";

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
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          className="pl-10"
          aria-label="Search products"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </form>

      {/* Search Results Dropdown */}
      {isOpen && debouncedQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-96 overflow-hidden">
          <Command className="rounded-md border-0">
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Searching...</div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  <CommandGroup>
                    {searchResults.map((product) => (
                      <CommandItem key={product.id} value={product.id} asChild>
                        <Link
                          href={`/products/${product.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center p-3 cursor-pointer"
                        >
                          <div className="w-12 h-12 relative mr-4 flex-shrink-0">
                            <Image
                              src={product.images?.[0]?.url || "/images/coming-soon.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.discountedPrice && product.discountedPrice < product.price ? (
                                <>
                                  ₹{product.discountedPrice.toLocaleString()}{" "}
                                  <span className="line-through text-xs">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <>₹{product.price.toLocaleString()}</>
                              )}
                            </p>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <div className="p-3 text-center border-t border-border">
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-primary hover:underline"
                    >
                      View all results
                    </Link>
                  </div>
                </>
              ) : (
                <CommandEmpty>
                  No products found for &ldquo;{query}&rdquo;
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
