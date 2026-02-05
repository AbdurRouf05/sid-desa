import React from "react";
import { cn } from "@/lib/utils";
import { Play, Instagram, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TactileButton } from "@/components/ui/tactile-button";

// --- Types ---
export interface BentoItemProps {
    className?: string;
    title: string;
    description?: string;
    type: "youtube" | "instagram" | "tiktok" | "link" | "image";
    url?: string;
    thumbnail?: string; // Image URL
    badge?: string;     // e.g. "VIRAL", "NEW"
}

// --- Components ---

export function BentoGrid({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]",
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoItem({
    className,
    title,
    description,
    type,
    url = "#",
    thumbnail,
    badge,
}: BentoItemProps) {
    // Determine icon based on type
    const getIcon = () => {
        switch (type) {
            case "youtube": return <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />;
            case "instagram": return <Instagram className="w-8 h-8 text-white" />;
            default: return <ExternalLink className="w-6 h-6 text-white" />;
        }
    };

    // Base background styling
    const bgStyle = thumbnail
        ? { backgroundImage: `url('${thumbnail}')` }
        : undefined;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block",
                className
            )}
        >
            {/* Background Image/Color */}
            <div
                className={cn(
                    "absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110",
                    !thumbnail && "bg-slate-100"
                )}
                style={bgStyle}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Badge */}
            {badge && (
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold tracking-wider rounded uppercase shadow-sm">
                        {badge}
                    </span>
                </div>
            )}

            {/* Center Icon (for Video types) */}
            {(type === "youtube" || type === "tiktok") && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/30">
                        {getIcon()}
                    </div>
                </div>
            )}

            {/* Top Right Icon (for Link/Insta types) */}
            {(type === "link" || type === "instagram") && (
                <div className="absolute top-4 right-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    {getIcon()}
                </div>
            )}

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full z-20">
                <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 line-clamp-2 group-hover:text-gold transition-colors">
                    {title}
                </h3>
                {description && (
                    <p className="text-white/80 text-xs md:text-sm line-clamp-2 font-medium">
                        {description}
                    </p>
                )}
            </div>
        </a>
    );
}
