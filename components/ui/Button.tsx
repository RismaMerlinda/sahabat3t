import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: "primary" | "outline" | "danger";
}

export function Button({
    children,
    className,
    isLoading,
    variant = "primary",
    disabled,
    type = "button",
    ...props
}: ButtonProps) {
    const baseStyles =
        "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary:
            "bg-primary text-white hover:bg-primary-hover disabled:opacity-50",
        outline:
            "border border-primary text-primary hover:bg-secondary-bg",
        danger:
            "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            type={type}
            disabled={isLoading || disabled}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
        </button>
    );
}
