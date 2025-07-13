"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

const navigationItems = [
  { name: "Account Settings", href: "/profile" },
  { name: "Address", href: "/profile/address" },
  { name: "My Orders", href: "/profile/orders" },
  { name: "My Wishlist", href: "/profile/wishlist" },
  { name: "Contact Us", href: "/profile/contact" },
  { name: "About Us", href: "/profile/about" },
  { name: "Terms of Use", href: "/profile/terms" },
  { name: "Privacy Policy", href: "/profile/privacy" },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200">
        <div className="p-6 pt-40">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block w-full text-left px-4 py-3 text-sm ${
                  pathname === item.href
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => logout()}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
