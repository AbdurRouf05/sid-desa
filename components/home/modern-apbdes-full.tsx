"use client";

import React, { useState, useEffect } from "react";
import { CircleDollarSign, ArrowLeft, Download, FileText } from "lucide-react";
import { pb } from "@/lib/pb";
import { cn } from "@/lib/utils";
import { ApbdesRealisasi } from "@/types";

interface ProgressItemProps {
    label: string;
    realized: number;
    budget: number;
    colorBase: "emerald" | "blue" | "amber";
}

function ProgressItem({ label, realized, budget, colorBase }: ProgressItemProps) {
    const percentage = budget > 0 ? Math.min((realized / budget) * 100, 100) : 0;
    const formattedRealized = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(realized);
    const formattedBudget = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(budget);

    // Dynamic colors based on the base color
    const bgColors = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        amber: "bg-amber-500"
    };

    return (
        <div className="mb-4 last:mb-0">
            <h4 className="font-bold text-slate-800 text-sm mb-2">{label}</h4>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1 border-b border-slate-100 pb-1">
                <div className="w-1/2 text-center border-r border-slate-100">Anggaran</div>
                <div className="w-1/2 text-center">Realisasi</div>
            </div>
            <div className="flex justify-between text-sm font-semibold mb-2">
                <div className="w-1/2 text-center text-slate-600 truncate px-1" title={formattedBudget}>{formattedBudget}</div>
                <div className="w-1/2 text-center text-slate-800 truncate px-1" title={formattedRealized}>{formattedRealized}</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${bgColors[colorBase]}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="text-right text-xs font-bold text-slate-500">
                {percentage.toFixed(2)}%
            </div>
        </div>
    );
}

interface ApbdesFullProps {
    onBack: () => void;
}

export function ModernApbdesFull({ onBack }: ApbdesFullProps) {
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    
    const [summary, setSummary] = useState<Record<string, { budget: number; realized: number; items: ApbdesRealisasi[] }>>({});

    useEffect(() => {
        const fetchApbdes = async () => {
            setLoading(true);
            try {
                const currentYear = new Date().getFullYear();
                const records = await pb.collection('apbdes_realisasi').getFullList<ApbdesRealisasi>({
                    filter: `tahun_anggaran >= ${currentYear - 1}`,
                    sort: 'kategori,nama_bidang'
                });
                
                if (records.length > 0) {
                    const targetYear = records[0].tahun_anggaran;
                    setYear(targetYear);

                    const currentRecords = records.filter(r => r.tahun_anggaran === targetYear);
                    const grouped: Record<string, { budget: number; realized: number; items: ApbdesRealisasi[] }> = {};

                    currentRecords.forEach(r => {
                        const cat = r.kategori;
                        if (!grouped[cat]) {
                            grouped[cat] = { budget: 0, realized: 0, items: [] };
                        }
                        grouped[cat].budget += r.anggaran;
                        grouped[cat].realized += r.realisasi;
                        grouped[cat].items.push(r);
                    });

                    setSummary(grouped);
                }
            } catch (err) {
                console.error("Gagal memuat APBDes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApbdes();
    }, []);

    const categories = Object.keys(summary);

    return (
        <div className="bg-slate-50 min-h-screen pb-10 animate-in fade-in duration-500 rounded-3xl overflow-hidden mt-2 border border-slate-200">
            {/* Compact Header */}
            <div className="bg-emerald-600 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hidden md:block"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-white font-black text-base md:text-lg uppercase tracking-tight flex items-center gap-2">
                            <CircleDollarSign className="w-5 h-5" />
                            Transparansi Sumber Dana {year}
                        </h2>
                    </div>
                </div>
                <button 
                    onClick={onBack}
                    className="md:hidden px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20"
                >
                    Kembali
                </button>
            </div>

            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Efficient Info Header */}
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-emerald-700 font-black uppercase tracking-widest text-[10px] mb-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Akuntabilitas Publik
                    </div>
                    <p className="text-slate-500 text-xs">Monitoring real-time penerimaan dan penggunaan dana desa secara partisipatif.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50 max-w-lg mx-auto transform transition-all hover:scale-[1.02]">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
                            <CircleDollarSign className="w-12 h-12 text-slate-200 -rotate-3" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">Data Belum Tersedia</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">Belum ada rincian realisasi anggaran yang tercatat di sistem untuk tahun ini.</p>
                        <button onClick={onBack} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95 shadow-lg shadow-slate-200"> Kembali Ke Beranda </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((catName) => (
                            <div key={catName} className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                                <div className={cn(
                                    "border-b-2 py-6 px-8 text-center relative overflow-hidden",
                                    catName.includes("ADD") ? "bg-blue-600 border-blue-700" :
                                    catName.includes("DD") ? "bg-emerald-600 border-emerald-700" :
                                    "bg-amber-600 border-amber-700"
                                )}>
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay flex items-center justify-center">
                                         <CircleDollarSign className="w-32 h-32 scale-150" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-wider text-sm md:text-base text-white relative z-10 shrink-0">
                                        {catName}
                                    </h3>
                                </div>
                                <div className="p-8 flex-1 bg-gradient-to-b from-white to-slate-50/50">
                                    <div className="mb-10 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500 transition-all group-hover:shadow-md">
                                        <ProgressItem 
                                            label="Total Akumulasi" 
                                            budget={summary[catName].budget} 
                                            realized={summary[catName].realized} 
                                            colorBase={catName.includes("DD") ? "emerald" : catName.includes("ADD") ? "blue" : "amber"} 
                                        />
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Rincian Per Bidang</span>
                                            <div className="h-px bg-slate-100 flex-1"></div>
                                        </div>
                                        {summary[catName].items.map((item) => (
                                            <div key={item.id} className="group/item">
                                                <ProgressItem 
                                                    label={item.nama_bidang} 
                                                    budget={item.anggaran} 
                                                    realized={item.realisasi} 
                                                    colorBase={catName.includes("DD") ? "emerald" : catName.includes("ADD") ? "blue" : "amber"} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Footer Info */}
            <div className="px-4 md:px-10 mt-12 max-w-7xl mx-auto">
                <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-slate-800">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-base md:text-lg uppercase tracking-tight">Akses Dokumen Fisik</h4>
                            <p className="text-slate-400 text-xs md:text-sm font-medium">Salinan resmi LPJ APBDes (Siskeudes) tersedia secara fisik di Kantor Kepala Desa.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end shrink-0">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Status Keaktifan</span>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Terverifikasi Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
