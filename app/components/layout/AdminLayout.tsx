"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

const navigationItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Products", href: "/admin/products" },
  { name: "Coupons", href: "/admin/coupons" },
  { name: "Users", href: "/admin/users" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Email", href: "/admin/email" },

];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200">
        <div className="p-6 pt-40">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-1">
            {(user?.role === "DELIVERY_PARTNER"
              ? navigationItems.filter((i) => i.name === "Orders")
              : navigationItems
            ).map((item) => {
              const isDashboard = item.href === "/admin";
              const isActive = isDashboard
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block w-full text-left px-4 py-3 text-sm ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
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
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}