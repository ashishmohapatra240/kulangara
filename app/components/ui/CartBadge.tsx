"use client";

import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";
import { useCartSummary } from "@/app/hooks/useCart";

export default function CartBadge() {
  const { totalItems } = useCartSummary();

  return (
    <Link href="/cart" className="relative inline-block">
      <CiShoppingCart className="w-6 h-6 mt-1" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
