"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent } from "../ui/sheet";
import { useState } from "react";
import { 
  FiUser, 
  FiMapPin, 
  FiShoppingBag, 
  FiHeart, 
  FiMail, 
  FiInfo, 
  FiFileText, 
  FiShield,
  FiLogOut,
  FiMenu
} from "react-icons/fi";

const navigationItems = [
  { name: "Account Settings", href: "/profile", icon: FiUser },
  { name: "Address", href: "/profile/address", icon: FiMapPin },
  { name: "My Orders", href: "/profile/orders", icon: FiShoppingBag },
  { name: "My Wishlist", href: "/profile/wishlist", icon: FiHeart },
  { name: "Contact Us", href: "/profile/contact", icon: FiMail },
  { name: "About Us", href: "/profile/about", icon: FiInfo },
  { name: "Terms of Use", href: "/profile/terms", icon: FiFileText },
  { name: "Privacy Policy", href: "/profile/privacy", icon: FiShield },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-lg font-bold mb-2">My Profile</h1>
        {user && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          </div>
        )}
      </div>
      
      <Separator className="" />
      
      <nav className="space-y-1 flex-1 mt-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-11"
              asChild
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
      
      <Separator className="my-4" />
      
      <Button
        variant="ghost"
        onClick={() => logout()}
        className="w-full justify-start gap-3 h-11"
      >
        <FiLogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header (fixed) */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-background border-b border-border h-16">
        <div className="flex items-center h-full px-8">
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-base font-semibold">My Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-full p-6">
          <div className="h-full flex flex-col">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Layout */}
      <div className="hidden lg:block pt-16">
        <PanelGroup direction="horizontal" className="min-h-screen">
          <Panel 
            defaultSize={20} 
            minSize={15} 
            maxSize={30}
            className="bg-muted/30 border-r border-border"
          >
            <div className="p-6 pt-6 h-full">
              <SidebarContent />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors cursor-col-resize" />

          <Panel minSize={60} className="bg-background">
            <div className="p-8 lg:p-12 h-full overflow-auto">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="pt-16 min-h-screen">
          <div className="h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
