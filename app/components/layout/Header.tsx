"use client";
import Link from "next/link";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import Button from "../ui/Button";
import Search from "../ui/Search";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 fixed top-10 left-0 right-0 z-40 bg-white">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          KULANGARA
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <RiCloseLine className="w-6 h-6" />
          ) : (
            <RiMenu3Line className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <Search />
          <Link href="/wishlist" className="p-2">
            <CiHeart className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="p-2">
            <CiShoppingCart className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register" className="text-sm">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
          lg:hidden fixed inset-0 top-[120px] bg-white z-50 
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="flex flex-col items-center space-y-6 p-8">
            <Search />
            <div className="flex items-center space-x-6">
              <Link href="/wishlist" className="p-2">
                <CiHeart className="w-6 h-6" />
              </Link>
              <Link href="/cart" className="p-2">
                <CiShoppingCart className="w-6 h-6" />
              </Link>
            </div>
            <div className="flex flex-col space-y-4 w-full">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="primary" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
