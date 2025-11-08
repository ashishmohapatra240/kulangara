"use client";

import Link from "next/link";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-base font-semibold mb-4">KULANGARA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium quality t-shirts for those who appreciate minimalist
              design and superior comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/profile/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/size-guide" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link 
                  href="/track-order" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="https://www.instagram.com/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.facebook.com/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link 
                  href="https://x.com/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; 2025 Kulangara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link 
              href="/profile/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link 
              href="/profile/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
