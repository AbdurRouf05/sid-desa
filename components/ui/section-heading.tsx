import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    lightMode?: boolean; // For use on dark backgrounds
}

export function SectionHeading({
    title,
    subtitle,
    align = "center",
    lightMode = false,
    className,
    ...props
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "mb-10 md:mb-14",
                align === "center" && "text-center",
                align === "right" && "text-right",
                className
            )}
            {...props}
        >
            <h2
                className={cn(
                    "text-3xl md:text-4xl font-bold tracking-tight mb-3 inline-block relative",
                    lightMode ? "text-white" : "text-emerald-950"
                )}
            >
                {title}
                {/* Gold Accent Underline */}
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full"></span>
                {align === "center" && (
                    <span className="absolute -bottom-2 right-0 w-1/3 h-1 bg-gradient-to-l from-gold to-yellow-500 rounded-full"></span>
                )}
            </h2>
            {subtitle && (
                <p
                    className={cn(
                        "text-lg md:text-xl font-medium max-w-2xl mx-auto mt-4",
                        lightMode ? "text-emerald-100" : "text-slate-600"
                    )}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
