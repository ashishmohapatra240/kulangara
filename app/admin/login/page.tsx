"use client";

import { Suspense, useState } from "react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert } from "@/app/components/ui/alert";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "DELIVERY_PARTNER"];

function AdminLoginContent() {
  const { loginAsync, isLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await loginAsync(formData);
    const loggedInUser = (result as { user?: { role?: string } } | undefined)?.user;
    const next = params.get('next') ?? undefined;
    if (loggedInUser && loggedInUser.role && ALLOWED_ROLES.includes(loggedInUser.role)) {
      if (loggedInUser.role === 'DELIVERY_PARTNER') {
        router.replace('/admin/orders');
      } else if (next && next.startsWith('/admin')) {
        router.replace(next);
      } else {
        router.replace('/admin');
      }
    } else {
      setError("You are not authorized to access the admin panel.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
        <Image
          src="/images/coming-soon.jpg"
          alt="Admin Login"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo/Brand */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access the admin panel
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <p className="text-sm">{error}</p>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Register link - Removed for security */}
          <p className="text-center text-sm text-muted-foreground">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <AdminLoginContent />
    </Suspense>
  );
}