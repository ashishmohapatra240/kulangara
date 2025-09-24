"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ALLOWED_ROLES = ["ADMIN", "DELIVERY_PARTNER"];

export default function AdminRegisterPage() {
  const { register, isLoading, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "ADMIN",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await register(formData);
    // After registration, check if user is allowed
    setTimeout(() => {
      if (user && ALLOWED_ROLES.includes(user.role)) {
        router.replace("/admin");
      } else {
        setError("You are not authorized to access the admin panel.");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Toaster position="top-right" />
      {/* Image container - hidden on mobile */}
      <div className="hidden lg:block w-1/2 h-screen bg-black">
        <Image
          src="/images/coming-soon.jpg"
          alt="Admin Registration background"
          className="w-full h-full object-cover opacity-70"
          height={1000}
          width={1000}
        />
      </div>

      {/* Form container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <div className="max-w-lg w-full">
          <div className="border-2 border-black p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black tracking-tight mb-4">
                ADMIN REGISTRATION
              </h2>
              <p className="text-sm font-medium text-gray-600 tracking-wide">
                REGISTER AS ADMIN OR DELIVERY PARTNER
              </p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-black mb-3 tracking-widest">
                      FIRST NAME
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                      placeholder="FIRST NAME"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-black mb-3 tracking-widest">
                      LAST NAME
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                      placeholder="LAST NAME"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
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
                    placeholder="EMAIL ADDRESS"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-black mb-3 tracking-widest">
                    PHONE NUMBER
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                    placeholder="PHONE NUMBER"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-bold text-black mb-3 tracking-widest">
                    ROLE
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full px-4 py-4 border-2 border-black text-black font-medium focus:outline-none"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    {ALLOWED_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-black mb-3 tracking-widest">
                    PASSWORD
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-4 border-2 border-black placeholder:text-gray-500 text-black font-medium focus:outline-none"
                    placeholder="PASSWORD"
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
                  {isLoading ? "CREATING ACCOUNT..." : "CREATE ADMIN ACCOUNT"}
                </Button>
              </div>
            </form>
            <div className="text-center mt-8">
              <a href="/admin/login" className="text-black font-bold tracking-widest border-b-2 border-black hover:bg-black hover:text-white transition-colors px-2 py-1">
                ALREADY HAVE AN ADMIN ACCOUNT? SIGN IN
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
