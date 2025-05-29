import { ButtonHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "transition-colors duration-200 cursor-pointer",
        {
          "bg-black text-white hover:bg-[#FF7E33] hover:text-black":
            variant === "primary",
          "bg-white text-black border border-black hover:bg-gray-100":
            variant === "secondary",
          "bg-transparent border border-black text-black hover:bg-gray-100":
            variant === "outline",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
