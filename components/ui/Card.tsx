import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-neutral-card rounded-xl shadow-lg border border-secondary-border p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
