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

  // Hide header on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="border-b border-border fixed top-10 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-accent transition-colors">
          KULANGARA
        </Link>

        <div className="hidden lg:flex items-center gap-4">
          <Search />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <CiHeart className="w-5 h-5" />
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
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-8">
              <Search />
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/wishlist">
                    <CiHeart className="w-5 h-5" />
                  </Link>
                </Button>
                <CartBadge />
              </div>
              <Separator />
              <div className="flex flex-col gap-3">
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
