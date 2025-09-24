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
    <div className="min-h-screen flex bg-white">
      <Toaster position="top-right" />
      {/* Image container - hidden on mobile */}
      <div className="hidden lg:block w-1/2 h-screen bg-black">
        <Image
          src="/images/coming-soon.jpg"
          alt="Admin Login background"
          className="w-full h-full object-cover opacity-70"
          height={1000}
          width={1000}
        />
      </div>

      {/* Form container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          <div className="border-2 border-black p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black tracking-tight mb-4">
                ADMIN LOGIN
              </h2>
              <p className="text-sm font-medium text-gray-600 tracking-wide">
                ONLY FOR ADMINS, SUPERADMINS, AND DELIVERY PARTNERS
              </p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-black mb-3 tracking-widest">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-black mb-3 tracking-widest">
                    PASSWORD
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                    placeholder="ENTER YOUR PASSWORD"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {error && <div className="text-black font-bold text-center p-4 border-2 border-black tracking-wide">{error.toUpperCase()}</div>}

              <div>
                <Button type="submit" className="w-full py-4 font-bold tracking-widest" disabled={isLoading}>
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </Button>
              </div>
            </form>
            <div className="text-center mt-8">
              <a href="/admin/register" className="text-black font-bold tracking-widest border-b-2 border-black hover:bg-black hover:text-white transition-colors px-2 py-1">
                ADMIN REGISTRATION
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><h1 className="text-3xl font-bold tracking-tight">LOADING...</h1></div>}>
      <AdminLoginContent />
    </Suspense>
  );
}