"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function TrackOrderPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace("/profile/orders");
    } else {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("postLoginRedirect", "/profile/orders");
      }
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Checking your account and redirecting...
      </p>
    </div>
  );
}


