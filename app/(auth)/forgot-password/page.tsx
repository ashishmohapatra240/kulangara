"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/useAuth";

export default function ForgotPasswordPage() {
    const { forgotPasswordAsync, forgotPasswordLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        await forgotPasswordAsync(email.trim());
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Image container - hidden on mobile */}
            <div className="hidden lg:block w-1/2 h-screen mt-[120px]">
                <Image
                    src="/images/coming-soon.jpg"
                    alt="Forgot password background"
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
                            Forgot your password?
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your email and we’ll send you a reset link.
                        </p>
                    </div>

                    {sent ? (
                        <div className="space-y-6">
                            <div className="p-4 border border-green-200 bg-green-50 text-green-800 text-sm">
                                If an account exists for {email}, you will receive an email with instructions to reset your password.
                            </div>
                            <div className="text-center">
                                <Link href="/login" className="text-black hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <Button type="submit" className="w-full" disabled={forgotPasswordLoading}>
                                    {forgotPasswordLoading ? "Sending..." : "Send reset link"}
                                </Button>
                            </div>

                            <div className="text-sm text-center text-gray-600">
                                Remembered your password?{' '}
                                <Link href="/login" className="font-medium text-black hover:text-gray-800">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}


