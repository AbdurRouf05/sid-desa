"use client";

import React, { useState, useEffect } from "react";
import { CircleDollarSign, ArrowLeft, Download, FileText } from "lucide-react";
import { pb } from "@/lib/pb";
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
    
    const [summary, setSummary] = useState({
        pendapatan: { budget: 0, realized: 0 },
        belanja: { budget: 0, realized: 0 },
        pembiayaan: { budget: 0, realized: 0 },
    });

    const [pendapatanDetails, setPendapatanDetails] = useState<ApbdesRealisasi[]>([]);
    const [belanjaDetails, setBelanjaDetails] = useState<ApbdesRealisasi[]>([]);

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
                    
                    let pBud = 0, pReal = 0;
                    let bBud = 0, bReal = 0;
                    let mBud = 0, mReal = 0;

                    const pend: ApbdesRealisasi[] = [];
                    const bel: ApbdesRealisasi[] = [];

                    currentRecords.forEach(r => {
                        if (r.kategori === 'Pendapatan') {
                            pBud += r.anggaran;
                            pReal += r.realisasi;
                            pend.push(r);
                        } else if (r.kategori === 'Belanja') {
                            bBud += r.anggaran;
                            bReal += r.realisasi;
                            bel.push(r);
                        } else if (r.kategori === 'Pembiayaan') {
                            mBud += r.anggaran;
                            mReal += r.realisasi;
                        }
                    });

                    setSummary({
                        pendapatan: { budget: pBud, realized: pReal },
                        belanja: { budget: bBud, realized: bReal },
                        pembiayaan: { budget: mBud, realized: mReal }
                    });

                    setPendapatanDetails(pend);
                    setBelanjaDetails(bel);
                }
            } catch (err) {
                console.error("Gagal memuat APBDes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApbdes();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen pb-16 animate-in fade-in duration-500 rounded-3xl overflow-hidden mt-4 shadow-sm border border-slate-200">
            {/* Header Area */}
            <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 bg-emerald-700/50 hover:bg-emerald-700 text-white rounded-full transition-colors hidden md:block"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-white font-bold text-xl md:text-2xl flex items-center gap-2">
                            <CircleDollarSign className="w-6 h-6 outline-none" />
                            Laporan APBDes Lengkap
                        </h2>
                        <p className="text-emerald-100/80 text-sm md:text-base hidden sm:block">Transparansi Penyelenggaraan Anggaran Desa - Tahun {year}</p>
                    </div>
                </div>
                <button 
                    onClick={onBack}
                    className="md:hidden p-2 text-white/80 hover:text-white"
                >
                    <span className="text-sm font-bold">Kembali</span>
                </button>
            </div>

            <div className="p-4 md:p-8">
                {/* Central Title */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white text-emerald-800 font-black px-6 py-2 rounded-full border-2 border-emerald-500 uppercase tracking-widest text-sm md:text-lg mb-2 shadow-sm">
                        Transparansi Anggaran
                    </div>
                    <p className="text-slate-500">Menyajikan rincian pendapatan asli desa dan belanja desa secara akuntabel.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-emerald-700 font-medium">Memuat data transparansi...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kolom 1: Pelaksanaan */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 py-3 px-4 text-center">
                                <h3 className="font-black text-slate-800 uppercase tracking-tight">APBDes {year} Pelaksanaan</h3>
                            </div>
                            <div className="p-5 space-y-6">
                                <ProgressItem 
                                    label="Pendapatan" 
                                    budget={summary.pendapatan.budget} 
                                    realized={summary.pendapatan.realized} 
                                    colorBase="emerald" 
                                />
                                <ProgressItem 
                                    label="Belanja" 
                                    budget={summary.belanja.budget} 
                                    realized={summary.belanja.realized} 
                                    colorBase="blue" 
                                />
                                <ProgressItem 
                                    label="Pembiayaan" 
                                    budget={summary.pembiayaan.budget} 
                                    realized={summary.pembiayaan.realized} 
                                    colorBase="amber" 
                                />
                            </div>
                        </div>

                        {/* Kolom 2: Pendapatan */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-emerald-50 border-b border-emerald-100 py-3 px-4 text-center">
                                <h3 className="font-black text-emerald-800 uppercase tracking-tight flex justify-center items-center gap-2">
                                    <ArrowLeft className="w-4 h-4 rotate-45" /> APBDes {year} Pendapatan
                                </h3>
                            </div>
                            <div className="p-5 space-y-6">
                                {pendapatanDetails.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm py-10 italic">Belum ada rincian pendapatan dari admin.</p>
                                ) : (
                                    pendapatanDetails.map((item) => (
                                        <ProgressItem 
                                            key={item.id}
                                            label={item.nama_bidang} 
                                            budget={item.anggaran} 
                                            realized={item.realisasi} 
                                            colorBase="emerald" 
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Kolom 3: Pembelanjaan */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-blue-50 border-b border-blue-100 py-3 px-4 text-center">
                                <h3 className="font-black text-blue-800 uppercase tracking-tight flex justify-center items-center gap-2">
                                    APBDes {year} Pembelanjaan <ArrowLeft className="w-4 h-4 -rotate-135" />
                                </h3>
                            </div>
                            <div className="p-5 space-y-6">
                                {belanjaDetails.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm py-10 italic">Belum ada rincian belanja dari admin.</p>
                                ) : (
                                    belanjaDetails.map((item) => (
                                        <ProgressItem 
                                            key={item.id}
                                            label={item.nama_bidang} 
                                            budget={item.anggaran} 
                                            realized={item.realisasi} 
                                            colorBase="blue" 
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Download Info Footer */}
            <div className="px-8 mt-4">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="text-amber-500 w-6 h-6 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-900 text-sm">Download Dokumen Resmi (PDF)</h4>
                            <p className="text-amber-700 text-xs">LPJ Realisasi APBDes (Siskeudes) tersedia di Balai Desa atau Hubungi Admin.</p>
                        </div>
                    </div>
                    {/* Placeholder for future PDF download feature */}
                </div>
            </div>
        </div>
    );
}
