"use client";

import React, { useState } from "react";
import { 
    FileSignature, 
    ShieldAlert, 
    MapPin, 
    UserCircle2, 
    Users, 
    BarChart3, 
    HandCoins, 
    Phone, 
    BookOpen,
    ChevronDown,
    Building2,
    History,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
    className?: string;
}

export function DashboardSidebar({ activeView, onNavigate, className }: DashboardSidebarProps) {
    const [accordionOpen, setAccordionOpen] = useState<'profil' | 'desa-cantik' | null>(null);

    const quickLinks = [
        { id: "identitas", label: "Berita & Profil", icon: <BookOpen className="w-6 h-6" />, isWide: true },
        { id: "aparatur", label: "Perangkat Desa", icon: <Users className="w-6 h-6" /> },
        { id: "apbdes", label: "Transparansi", icon: <BarChart3 className="w-6 h-6" /> },
        { id: "layanan-terpadu", label: "Informasi Layanan", icon: <FileSignature className="w-6 h-6" /> },
        { id: "peta", label: "Peta Desa", icon: <MapPin className="w-6 h-6" /> },
        { id: "pengaduan", label: "Ruang Lapor", icon: <MessageSquare className="w-6 h-6" /> },
        { id: "cek-bansos", label: "Cek Bansos", icon: <HandCoins className="w-6 h-6" /> },
    ];

    const toggleAccordion = (section: 'profil' | 'desa-cantik') => {
        setAccordionOpen(prev => prev === section ? null : section);
    };

    return (
        <aside className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden">
            <div className="overflow-y-auto custom-scrollbar flex-1 pb-4">
                {/* 1. Hero Identity Banner */}
            <div className="relative w-full h-48 sm:h-56 shrink-0">
                <img 
                    src="/desa/image copy 3.png" 
                    alt="Desa Sumberanyar" 
                    className="w-full h-full object-cover absolute inset-0"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4">
                    {/* Real Logo */}
                    <div className="w-16 h-16 mb-2 drop-shadow-2xl">
                        <img src="/logo3-removebg-preview.png" alt="Logo Desa" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-xl font-bold text-white text-center leading-tight">DESA SUMBERANYAR</h2>
                    <p className="text-xs font-medium text-emerald-100 mt-1">Rowokangkung, Lumajang</p>
                </div>
            </div>

            {/* Navigasi Utama */}
            <div className="p-4">
                <p className="text-xs font-bold text-slate-400 mb-3 px-1 uppercase tracking-widest">Akses Cepat</p>
                <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => onNavigate(link.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-3 group relative overflow-hidden",
                                link.isWide ? "col-span-2 h-[100px] bg-gradient-to-br from-[#15803d] to-[#0f5c2c] border-none shadow-md" : "h-[100px] bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md",
                                (activeView === link.id || 
                                 (link.id === "apbdes" && activeView === "transparansi-detail") ||
                                 (link.id === "identitas" && (activeView === "berita" || activeView === "berita-detail"))) && !link.isWide
                                    ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-emerald-100" 
                                    : ""
                            )}
                        >
                            <div className={cn(
                                "transition-transform group-hover:scale-110",
                                link.isWide ? "text-emerald-400" : 
                                ((activeView === link.id || 
                                 (link.id === "apbdes" && activeView === "transparansi-detail") ||
                                 (link.id === "identitas" && (activeView === "berita" || activeView === "berita-detail"))) ? "text-emerald-600" : "text-slate-600")
                            )}>
                                {link.icon}
                            </div>
                            <span className={cn(
                                "text-xs font-bold tracking-wide text-center leading-tight z-10",
                                link.isWide ? "text-white" : 
                                ((activeView === link.id || 
                                 (link.id === "apbdes" && activeView === "transparansi-detail") ||
                                 (link.id === "identitas" && (activeView === "berita" || activeView === "berita-detail"))) ? "text-emerald-700" : "text-slate-700")
                            )}>
                                {link.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Info Section */}
            <div className="px-4 pb-3 space-y-2">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">🕐 Jam Layanan</p>
                    <p className="text-xs text-emerald-800 font-medium">Senin - Jumat: 08:00 - 15:00 WIB</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Istirahat: 12:00 - 13:00</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">📞 Kontak Desa</p>
                    <p className="text-xs text-slate-700 font-medium">Kantor: (0334) 123-456</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">WA Admin: 0812-3456-7890</p>
                </div>
            </div>
            </div>


            
        </aside>
    );
}
