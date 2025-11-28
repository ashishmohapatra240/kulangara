"use client";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { RiMenu3Line } from "react-icons/ri";
import { FiUser, FiShoppingBag, FiLogOut, FiChevronDown } from "react-icons/fi";
import { Button } from "@/app/components/ui/button";
import Search from "../ui/Search";
import CartBadge from "../ui/CartBadge";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isProfileRoute = pathname?.startsWith("/profile");
  const isAdminRoute = pathname?.startsWith("/admin");

  // Hide header completely on admin routes
  if (isAdminRoute) {
    return null;
  }

  // On profile routes, show header only on large screens
  const headerClasses = isProfileRoute 
    ? "border-b border-border fixed top-0 left-0 right-0 z-40 bg-white shadow-sm hidden lg:block"
    : "border-b border-border fixed top-10 left-0 right-0 z-40 bg-white shadow-sm";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-black">
          KULANGARA
        </Link>

        <div className="hidden lg:flex items-center gap-4">
          <Search />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <CiHeart className="w-6 h-6" />
            </Link>
          </Button>
          <CartBadge />
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <span className="whitespace-nowrap text-sm">
                      Namaskar, {user?.firstName || "User"}
                    </span>
                    <FiChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <FiUser className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders" className="cursor-pointer">
                      <FiShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <RiMenu3Line className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-full max-w-xs sm:max-w-md p-0"
          >
            {/* Top-right close button with spacing and bg */}
            <div className="flex justify-end p-4">
              <button
                aria-label="Close"
                className="rounded-full bg-muted hover:bg-muted/80 text-foreground transition p-2"
                onClick={() => setIsMenuOpen(false)}
                type="button"
              >
              </button>
            </div>
            <div className="flex flex-col gap-6 mt-2 px-4 pb-8">
              <Search />

              {/* Wishlist & Cart centered with proper spacing */}
              <div className="flex justify-center items-center gap-6 mt-2 mb-2">
                <Button variant="outline" size="icon" asChild className="rounded-full">
                  <Link href="/wishlist">
                    <CiHeart className="w-6 h-6" />
                  </Link>
                </Button>
                <CartBadge variant="outline" className="rounded-full" />
              </div>

              <Separator />

              <div className="flex flex-col gap-3 px-2">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm font-medium text-muted-foreground text-center">
                      Welcome, {user?.firstName || "User"}
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/profile">
                        <FiUser className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/profile/orders">
                        <FiShoppingBag className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
