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
            primary: "bg-gradient-to-br from-desa-primary to-desa-primary-dark text-white border-b-4 border-desa-primary-dark/80 shadow-md hover:shadow-lg hover:from-desa-primary-light hover:to-desa-primary",
            secondary: "bg-gradient-to-br from-desa-accent to-desa-accent-dark text-white border-b-4 border-desa-accent-dark/80 shadow-sm hover:shadow-md hover:from-desa-accent-light hover:to-desa-accent",
            tertiary: "bg-slate-100 text-slate-600 border-b-4 border-slate-300 hover:bg-slate-200",
            ghost: "bg-transparent border-none shadow-none text-slate-600 hover:bg-slate-100/50 hover:text-desa-primary"
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
