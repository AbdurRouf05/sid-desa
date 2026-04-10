"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernHeroProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
}

export function ModernHero({ 
    title = "Sistem Informasi Desa Sumberanyar", 
    subtitle = "Mewujudkan Tata Kelola Pemerintahan yang Transparan, Inovatif, dan Berorientasi pada Pelayanan Publik.",
    imageUrl = "https://images.unsplash.com/photo-1596404746653-cb30b7d7b1df?q=80&w=2070" 
}: ModernHeroProps) {
    return (
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax effect (CSS only via scale/position) */}
            <div className="absolute inset-0 w-full h-full">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                {/* Gradient Overlay Focuses on Center/Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40"></div>
                
                {/* Green tint for "Nature/Desa" feel */}
                <div className="absolute inset-0 bg-desa-primary/20 mix-blend-multiply"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col items-center text-center mt-16 md:mt-0">
                
                {/* Badge Highlight */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-sm font-semibold tracking-wide">Desa Digital Mandiri</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    {title}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-100 max-w-2xl font-medium mb-10 opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                    <Link href="#portal-layanan">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-desa-primary hover:bg-desa-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-desa-primary/40">
                            Masuk Portal Layanan
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <Link href="/transparansi">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105">
                            Lihat Transparansi
                        </button>
                    </Link>
                </div>
            </div>

            {/* Decorative bottom curve (Optional based on design preference) */}
            <div className="absolute bottom-0 w-full h-16 md:h-24 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
        </section>
    );
}
