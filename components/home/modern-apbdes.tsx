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
        pendapatan: { realized: 0, budget: 0 },
        belanja: { realized: 0, budget: 0 },
        pembiayaan: { realized: 0, budget: 0 }
    });

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
                    let pendRev = 0, pendBud = 0;
                    let belRev = 0, belBud = 0;
                    let pembRev = 0, pembBud = 0;

                    records.filter(r => r.tahun_anggaran === targetYear).forEach(r => {
                        const rlz = r.realisasi || 0;
                        const bdg = r.anggaran || 0;
                        if (r.kategori === 'Pendapatan') { pendRev += rlz; pendBud += bdg; }
                        else if (r.kategori === 'Belanja') { belRev += rlz; belBud += bdg; }
                        else if (r.kategori === 'Pembiayaan') { pembRev += rlz; pembBud += bdg; }
                    });

                    setData({
                        year: targetYear,
                        pendapatan: { realized: pendRev, budget: pendBud },
                        belanja: { realized: belRev, budget: belBud },
                        pembiayaan: { realized: pembRev, budget: pembBud }
                    });
                }
            } catch (err) {
                console.error("Failed to load apbdes", err);
                // Fallback softly handled by keeping zeroes
            } finally {
                setLoading(false);
            }
        };

        fetchApbdes();
    }, []);

    const isEmpty = !loading && data.pendapatan.budget === 0 && data.belanja.budget === 0 && data.pembiayaan.budget === 0;

    return (
        <section id="apbdesa" className="py-8 md:py-10 bg-transparent relative overflow-hidden w-full h-full flex flex-col">
             {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-3 md:mb-4">
                            <CircleDollarSign className="w-4 h-4" /> Transparansi
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Keterbukaan Anggaran (APBDesa)</h2>
                        <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">Realisasi Anggaran Pendapatan dan Belanja Desa Tahun {data.year}.</p>
                    </div>
                    <button onClick={onViewDetails} className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors mt-4 md:mt-0 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full text-sm">
                        Laporan Lengkap <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {isEmpty ? (
                    <div className="bg-white rounded-3xl p-12 shadow-xl shadow-slate-200/40 border border-slate-100 text-center col-span-full">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CircleDollarSign className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Data APBDes Belum Tersedia</h3>
                        <p className="text-slate-500 max-w-md mx-auto">Data realisasi anggaran tahun {data.year} sedang dalam proses input oleh petugas desa. Silakan periksa kembali nanti.</p>
                    </div>
                ) : (
                    <>
                    {/* Pendapatan */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <HandCoins className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Pendapatan Desa</h3>
                        <ProgressBar 
                            label="Total Pendapatan" 
                            realized={data.pendapatan.realized} 
                            budget={data.pendapatan.budget} 
                            colorClass="bg-gradient-to-r from-emerald-400 to-emerald-600" 
                        />
                         <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                            Terdiri dari PADes, Dana Desa (DD), ADD, dan Bagi Hasil Pajak.
                        </div>
                    </div>

                    {/* Belanja */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Belanja Desa</h3>
                        <ProgressBar 
                            label="Total Pembelanjaan" 
                            realized={data.belanja.realized} 
                            budget={data.belanja.budget} 
                            colorClass="bg-gradient-to-r from-blue-400 to-blue-600" 
                        />
                         <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                            Penyelenggaraan Pemerintahan, Pembangunan, dan Pemberdayaan.
                        </div>
                    </div>

                     {/* Pembiayaan */}
                     <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-violet-200 transition-colors">
                        <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                            <CircleDollarSign className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Pembiayaan Desa</h3>
                        <ProgressBar 
                            label="Penerimaan & Pengeluaran" 
                            realized={data.pembiayaan.realized} 
                            budget={data.pembiayaan.budget} 
                            colorClass="bg-gradient-to-r from-violet-400 to-violet-600" 
                        />
                         <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                            Sisa Lebih Perhitungan Anggaran (SiLPA) tahun sebelumnya.
                        </div>
                    </div>
                    </>
                )}

                <button onClick={onViewDetails} className="md:hidden w-full mt-8 flex justify-center items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-bold active:bg-slate-200 hover:bg-slate-200 transition-colors">
                    Lihat Laporan Lengkap <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
