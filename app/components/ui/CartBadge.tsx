"use client";

import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";
import { useCartSummary } from "@/app/hooks/useCart";
import { Button } from "@/app/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/app/components/ui/button";

type CartBadgeProps = {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
};

export default function CartBadge({ variant = "ghost" }: CartBadgeProps) {
  const { totalItems } = useCartSummary();

  return (
    <Button variant={variant} size="icon" asChild className="relative">
      <Link href="/cart">
        <CiShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
