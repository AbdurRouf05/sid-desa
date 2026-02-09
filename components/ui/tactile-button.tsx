import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "tertiary" | "ghost";
    icon?: React.ReactNode;
    fullWidth?: boolean;
    as?: "button" | "a" | typeof Link;
    href?: string;
    target?: string;
}

export const TactileButton = React.forwardRef<any, TactileButtonProps>(
    ({ className, variant = "primary", icon, fullWidth, children, as: Component = "button", ...props }, ref) => {

        const baseStyles = "btn-tactile group relative inline-flex items-center justify-center rounded-xl text-base font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden glass-shine whitespace-nowrap";

        const variants = {
            primary: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-b-4 border-emerald-900 shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-emerald-600 hover:border-emerald-800",
            secondary: "bg-gradient-to-br from-yellow-300 to-yellow-400 text-emerald-950 border-b-4 border-yellow-600 shadow-sm hover:shadow-md hover:from-yellow-200 hover:to-yellow-300 hover:border-yellow-500",
            tertiary: "bg-slate-100 text-slate-600 border-b-4 border-slate-300 hover:bg-slate-200",
            ghost: "bg-transparent border-none shadow-none text-slate-600 hover:bg-slate-100/50 hover:text-emerald-700"
        };

        const content = (
            <>
                {/* Top Gloss Reflection */}
                <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-t-xl" />

                {icon && <span className="mr-2 relative z-10 flex items-center justify-center">{icon}</span>}
                <span className="relative z-10 flex items-center justify-center">{children}</span>
            </>
        );

        const combinedClassName = cn(
            baseStyles,
            variants[variant],
            "h-10 md:h-12 px-6 py-2",
            fullWidth ? "w-full flex" : "inline-flex",
            className
        );

        if (Component === "a" || typeof Component === "object") {
            const { type, ...linkProps } = props as any;
            return (
                <Component
                    ref={ref}
                    className={combinedClassName}
                    {...linkProps}
                >
                    {content}
                </Component>
            );
        }

        return (
            <button
                ref={ref}
                className={combinedClassName}
                {...props}
            >
                {content}
            </button>
        );
    }
);
TactileButton.displayName = "TactileButton";
