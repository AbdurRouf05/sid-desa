"use client";

import React, { useState, useEffect } from "react";
import { CircleDollarSign, TrendingUp, HandCoins, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";

interface ProgressBarProps {
    label: string;
    realized: number;
    budget: number;
    colorClass: string;
}

interface ApbdesProps {
    onViewDetails?: () => void;
}

function ProgressBar({ label, realized, budget, colorClass }: ProgressBarProps) {
    // Prevent division by zero
    const percentage = budget > 0 ? Math.min(Math.round((realized / budget) * 100), 100) : 0;
    const formattedRealized = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(realized);
    const formattedBudget = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(budget);

    return (
        <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-end">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="text-sm font-bold text-slate-800">{percentage}%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Realisasi: {formattedRealized}</span>
                <span>Anggaran: {formattedBudget}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

export function ModernApbdes({ onViewDetails }: ApbdesProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        year: new Date().getFullYear(),
        sources: [] as { label: string; realized: number; budget: number; color: string }[]
    });

    const getColor = (category: string) => {
        if (category.includes("ADD")) return "bg-gradient-to-r from-blue-400 to-blue-600";
        if (category.includes("DD")) return "bg-gradient-to-r from-emerald-400 to-emerald-600";
        if (category.includes("BHP")) return "bg-gradient-to-r from-amber-400 to-amber-600";
        return "bg-gradient-to-r from-indigo-400 to-indigo-600";
    };

    useEffect(() => {
        const fetchApbdes = async () => {
            try {
                // Fetch all apbdes for recent year
                const currentYear = new Date().getFullYear();
                const records = await pb.collection('apbdes_realisasi').getFullList({
                    filter: `tahun_anggaran >= ${currentYear - 1}` // attempt to get current or last year
                });
                
                if (records.length > 0) {
                    const targetYear = records[0].tahun_anggaran; // use the year we found
                    const grouped: Record<string, { realized: number; budget: number }> = {};

                    records.filter(r => r.tahun_anggaran === targetYear).forEach(r => {
                        const cat = r.kategori;
                        if (!grouped[cat]) grouped[cat] = { realized: 0, budget: 0 };
                        grouped[cat].realized += (r.realisasi || 0);
                        grouped[cat].budget += (r.anggaran || 0);
                    });

                    const sourceList = Object.entries(grouped).map(([label, values]) => ({
                        label,
                        ...values,
                        color: getColor(label)
                    }));

                    setData({
                        year: targetYear,
                        sources: sourceList
                    });
                }
            } catch (err) {
                console.error("Failed to load apbdes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApbdes();
    }, []);

    const isEmpty = !loading && data.sources.length === 0;

    return (
        <section id="apbdesa" className="py-2 md:py-4 bg-white relative overflow-hidden w-full h-full flex flex-col rounded-xl">
            <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-2">
                            <CircleDollarSign className="w-3 h-3" /> Transparansi
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase">Dana Transparansi Desa</h2>
                        <p className="text-slate-500 text-[10px] md:text-xs font-medium">Realisasi Anggaran Tahun {data.year}.</p>
                    </div>
                    <button 
                        onClick={onViewDetails} 
                        className="flex items-center gap-2 text-emerald-600 font-black hover:text-white transition-all bg-emerald-50 hover:bg-emerald-600 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm"
                    >
                        Laporan Lengkap <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {isEmpty ? (
                    <div className="flex-1 flex items-center justify-center py-8">
                        <div className="text-center max-w-sm">
                            <h3 className="text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Data Belum Tersedia</h3>
                            <p className="text-slate-400 text-[10px]">Data sedang diproses oleh admin desa.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {data.sources.map((source, idx) => (
                            <div key={idx} className="group bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)] xl:w-[calc(25%-1rem)] min-w-[280px]">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                        source.label.includes("ADD") ? "bg-blue-500 text-white" :
                                        source.label.includes("DD") ? "bg-emerald-500 text-white" :
                                        "bg-amber-500 text-white"
                                    )}>
                                        <HandCoins className="w-4 h-4" />
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                        (source.realized / source.budget) >= 1 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {(source.realized / source.budget) >= 1 ? "Selesai" : "Berjalan"}
                                    </div>
                                </div>
                                
                                <h3 className="text-xs font-black text-slate-800 mb-4 h-8 overflow-hidden line-clamp-2 uppercase tracking-wide leading-tight">
                                    {source.label}
                                </h3>
                                
                                <ProgressBar 
                                    label="Progres Realisasi" 
                                    realized={source.realized} 
                                    budget={source.budget} 
                                    colorClass={source.color} 
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
