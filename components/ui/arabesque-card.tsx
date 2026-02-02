import React from "react";
import { cn } from "@/lib/utils";

interface ArabesqueCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "simple" | "gold-border" | "interactive";
    title?: string;
    icon?: React.ReactNode;
    headerAction?: React.ReactNode;
}

export function ArabesqueCard({
    className,
    variant = "gold-border", // Default to gold border as per requirement 
    title,
    icon,
    headerAction,
    children,
    ...props
}: ArabesqueCardProps) {

    const baseStyles = "w-full bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 border border-slate-100/50";

    const variants = {
        simple: "border-gray-100",
        "gold-border": "border-b-4 border-yellow-400",
        interactive: "border-b-4 border-transparent hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/10 cursor-pointer transform hover:-translate-y-1"
    };

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props}>
            {(title || icon) && (
                <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        {icon && <span className="text-emerald-700 bg-emerald-50 p-2 rounded-lg">{icon}</span>}
                        {title && <h3 className="font-bold text-lg md:text-xl text-emerald-950 tracking-tight">{title}</h3>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className={cn("p-4 md:p-6", (title || icon) ? "pt-4" : "")}>
                {children}
            </div>
        </div>
    );
}
