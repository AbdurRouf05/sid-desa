"use client";

import React from "react";
import Link from "next/link";
import { FileSignature, Search, ShieldAlert, CircleDollarSign, Map, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickHubProps {
    onActionClick: (actionType: string) => void;
}

export function ModernQuickHub({ onActionClick }: QuickHubProps) {
    const hubItems = [
        {
            title: "Pengajuan Surat",
            desc: "Buat surat pengantar online tanpa antre",
            icon: <FileSignature className="w-8 h-8 text-emerald-600" />,
            color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100",
            action: () => onActionClick('surat-online')
        },
        {
            title: "Cek Daftar Bansos",
            desc: "Periksa status penerimaan bantuan sosial",
            icon: <Search className="w-8 h-8 text-blue-600" />,
            color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
            action: () => onActionClick('cek-bansos')
        },
        {
            title: "Lapor & Pengaduan",
            desc: "Sampaikan laporan langsung ke desa",
            icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
            color: "bg-red-50 hover:bg-red-100 border-red-100",
            action: () => onActionClick('pengaduan')
        },
        {
            title: "Transparansi Dana",
            desc: "Lihat realisasi APBDesa secara real-time",
            icon: <CircleDollarSign className="w-8 h-8 text-amber-600" />,
            color: "bg-amber-50 hover:bg-amber-100 border-amber-100",
            type: "link",
            href: "#apbdesa"
        },
        {
            title: "Peta Digital Desa",
            desc: "Jelajahi batas dan potensi wilayah",
            icon: <Map className="w-8 h-8 text-indigo-600" />,
            color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
            type: "link",
            href: "/pelayanan/peta-desa"
        },
        {
            title: "Layanan Mandiri",
            desc: "Akses data penduduk personal",
            icon: <Users className="w-8 h-8 text-teal-600" />,
            color: "bg-teal-50 hover:bg-teal-100 border-teal-100",
            type: "link",
            href: "/login" 
        }
    ];

    return (
        <section id="portal-layanan" className="relative z-20 -mt-16 md:-mt-24 px-4 container mx-auto mb-20">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-8 lg:p-10 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Portal Akses Cepat</h2>
                    <p className="text-slate-500 mt-2">Pilih layanan yang Anda butuhkan untuk proses lebih cepat</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {hubItems.map((item, index) => {
                        const sharedClassName = cn(
                            "flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 text-left group",
                            "hover:shadow-lg hover:-translate-y-1",
                            item.color
                        );

                        const content = (
                            <>
                                <div className="bg-white p-3 rounded-xl shadow-sm mb-4 transition-transform group-hover:scale-110">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-sm font-medium text-slate-600">{item.desc}</p>
                            </>
                        );

                        if (item.type === 'link') {
                            return (
                                <Link key={index} href={item.href || "#"} className={sharedClassName}>
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <button type="button" key={index} onClick={item.action} className={sharedClassName}>
                                {content}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
