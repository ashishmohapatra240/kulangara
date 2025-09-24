"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const navigationItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Products", href: "/admin/products" },
  { name: "Categories", href: "/admin/categories" },
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
    <div className="min-h-screen bg-white">
      <PanelGroup direction="horizontal" className="min-h-screen">

        <Panel 
          defaultSize={25} 
          minSize={15} 
          maxSize={40}
          className="bg-gray-100 text-black"
        >
          <div className="p-8 pt-12 h-full">
            <h1 className="text-3xl font-bold mb-12 tracking-tight">ADMIN</h1>
            <nav className="space-y-0">
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
                    className={`block w-full text-left px-6 py-4 text-sm font-medium border-b border-gray-200 transition-colors ${
                      isActive 
                        ? "bg-white text-black" 
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {item.name.toUpperCase()}
                  </Link>
                );
              })}
              <button
                onClick={() => logout()}
                className="w-full text-left px-6 py-4 text-sm font-medium text-black hover:bg-gray-200 border-b border-gray-800 transition-colors"
              >
                LOGOUT
              </button>
            </nav>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-col-resize" />

        <Panel minSize={60} className="bg-white">
          <div className="p-12 h-full">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}