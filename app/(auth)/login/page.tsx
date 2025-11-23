"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { GoogleSignInButton } from "@/app/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
        <Image
          src="/images/coming-soon.jpg"
          alt="Login"
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
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
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
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        aria-label={showPass ? "Hide password" : "Show password"}
                      >
                        {showPass ? (
                          <FiEyeOff className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <FiEye className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleSignInButton mode="login" />
              </form>
            </CardContent>
          </Card>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
