"use client";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FiUser, FiShoppingBag, FiLogOut } from "react-icons/fi";
import Button from "../ui/Button";
import Search from "../ui/Search";
import CartBadge from "../ui/CartBadge";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="p-2">
            <CartBadge />
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm hover:text-gray-600"
                >
                  <span className="whitespace-nowrap">
                    Namaskar, {user?.firstName || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiShoppingBag className="mr-2" />
                      Orders
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => logout()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm">
                  <Button variant="primary">Login</Button>
                </Link>
              </>
            )}
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
              <div className="p-2">
                <CartBadge />
              </div>
            </div>
            <div className="flex flex-col space-y-4 w-full">
              {isAuthenticated ? (
                <>
                  <span className="text-center text-sm">
                    Welcome, {user?.firstName || "User"}
                  </span>
                  <Link href="/profile" className="w-full">
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Link href="/orders" className="w-full">
                    <Button variant="outline" className="w-full">
                      Orders
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => logout()}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
