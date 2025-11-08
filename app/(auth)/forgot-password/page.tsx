"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert } from "@/app/components/ui/alert";

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
        <div className="min-h-screen flex">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
                <Image
                    src="/images/coming-soon.jpg"
                    alt="Forgot password"
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
                        <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and we&apos;ll send you a reset link
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            {sent ? (
                                <div className="space-y-4">
                                    <Alert>
                                        <p className="text-sm">
                                            If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
                                        </p>
                                    </Alert>
                                    <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground">
                                        Back to Login
                                    </Link>
                                </div>
                            ) : (
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={forgotPasswordLoading}>
                                        {forgotPasswordLoading ? "Sending..." : "Send reset link"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Back to login link */}
                    {!sent && (
                        <p className="text-center text-sm text-muted-foreground">
                            Remembered your password?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-foreground hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}


