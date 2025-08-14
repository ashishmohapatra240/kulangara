"use client";

import { Suspense, useState } from "react";
import Button from "@/app/components/ui/Button";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-right" />
      {/* Image container - hidden on mobile */}
      <div className="hidden lg:block w-1/2 h-screen mt-30">
        <Image
          src="/images/coming-soon.jpg"
          alt="Admin Login background"
          className="w-full h-full object-cover"
          height={1000}
          width={1000}
        />
      </div>

      {/* Form container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Only for Admins, Superadmins, and Delivery Partners
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <a href="/admin/register" className="text-black underline">Admin Registration</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}