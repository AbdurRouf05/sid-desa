import React from "react";
import { cn } from "@/lib/utils";

interface ArabesqueCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "simple" | "gold-border" | "interactive";
    cardColor?: "white" | "emerald" | "blue" | "gold";
    title?: string;
    icon?: React.ReactNode;
    headerAction?: React.ReactNode;
    featureImage?: React.ReactNode;
}

export function ArabesqueCard({
    className,
    variant = "gold-border",
    cardColor = "white",
    title,
    icon,
    headerAction,
    featureImage,
    children,
    ...props
}: ArabesqueCardProps) {

    const baseStyles = "w-full bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 border border-slate-100/50";

    const colorVariants = {
        white: "bg-white border-slate-200",
        emerald: "bg-white border-slate-200 border-t-2 border-t-emerald-500/20",
        blue: "bg-white border-slate-200 border-t-2 border-t-blue-500/20",
        gold: "bg-white border-slate-200 border-t-2 border-t-amber-500/20"
    };

    const variants = {
        simple: "",
        "gold-border": "border-b-4 border-yellow-400",
        interactive: "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
    };

    return (
        <div className={cn(baseStyles, colorVariants[cardColor], variants[variant], className)} {...props}>
            {(title || icon) && (
                <div className={cn(
                    "p-4 md:p-6 border-b flex items-center justify-between bg-gradient-to-b from-slate-50/50 to-white border-slate-100"
                )}>
                    <div className="flex items-center gap-4">
                        {icon && (
                            <span className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-xl shadow-sm border bg-white relative",
                                cardColor === "emerald" ? "text-emerald-600 border-emerald-100" :
                                    cardColor === "blue" ? "text-blue-600 border-blue-100" :
                                        cardColor === "gold" ? "text-amber-600 border-amber-100" :
                                            "text-emerald-700 border-slate-100"
                            )}>
                                {icon}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                                    cardColor === "emerald" ? "bg-emerald-500" :
                                        cardColor === "blue" ? "bg-blue-500" :
                                            cardColor === "gold" ? "bg-amber-500" : "bg-slate-300"
                                )} />
                            </span>
                        )}
                        {title && <h3 className="font-bold text-lg md:text-xl text-emerald-950 tracking-tight leading-tight">{title}</h3>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className={cn("p-4 md:p-6", (title || icon) ? "pt-4" : "")}>
                <div className="relative">
                    {children}
                </div>
                {featureImage && (
                    <div className="mt-6 -mx-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-100 group-hover:shadow-md transition-shadow duration-500">
                        {featureImage}
                    </div>
                )}
            </div>
        </div>
    );
}
