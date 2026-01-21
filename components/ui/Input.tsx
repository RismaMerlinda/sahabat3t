import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-semibold text-neutral-heading">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 rounded-lg border border-secondary-border bg-neutral-card text-neutral-body placeholder-neutral-placeholder focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                        error && "border-status-error focus:ring-status-error",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-sm text-status-error">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
