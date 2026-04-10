"use client";

import React from "react";
import { MessageSquareWarning, Phone, Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StickyActionBarProps {
    onReportClick: () => void;
}

export function StickyActionBar({ onReportClick }: StickyActionBarProps) {
    const pathname = usePathname();
    const isHome = pathname === "/" || pathname === "/v2" || pathname === "/home";

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-[90] bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 p-2">
            <div className="flex items-center justify-between gap-1">
                <Link href="/" className="flex-1">
                    <button className={cn("w-full flex-col items-center justify-center py-2 rounded-full transition-colors", isHome ? "text-desa-primary" : "text-slate-400 hover:text-slate-600")}>
                        <Home className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-[10px] font-bold">Beranda</span>
                    </button>
                </Link>
                
                <button className="flex-1 flex-col items-center justify-center py-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                    <Search className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-bold">Cari</span>
                </button>

                <div className="flex-1 flex justify-center -mt-8">
                    <button 
                        onClick={onReportClick}
                        className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-4 border-slate-50"
                    >
                        <MessageSquareWarning className="w-6 h-6" />
                    </button>
                </div>

                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex-1">
                    <button className="w-full flex-col items-center justify-center py-2 text-slate-400 hover:text-emerald-500 rounded-full transition-colors">
                        <Phone className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-[10px] font-bold">Kontak</span>
                    </button>
                </a>
            </div>
        </div>
    );
}
