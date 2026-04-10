"use client";

import React, { useState } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { pb } from "@/lib/pb";
import { PenerimaBansos } from "@/types";
import { cn } from "@/lib/utils";
import {
    Search, ArrowLeft, Loader2, ShieldCheck, AlertCircle, UserCheck, Info
} from "lucide-react";
import Link from "next/link";

function maskNik(nik: string): string {
    if (!nik || nik.length < 6) return "******";
    return nik.substring(0, 4) + "********" + nik.substring(12);
}

export default function CekBansosPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PenerimaBansos[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length < 3) {
            setErrorMsg("Masukkan minimal 3 karakter untuk mencari.");
            return;
        }
        setLoading(true);
        setErrorMsg("");
        setSearched(true);
        try {
            // Search by NIK or Nama
            const isNik = /^\d+$/.test(query.trim());
            let filter = "";
            
            // Validasi keamanan tambahan untuk NIK & Enumeration Delay
            if (isNik) {
                if (query.trim().length !== 16) {
                    setErrorMsg("NIK harus persis 16 digit angka.");
                    setLoading(false);
                    return;
                }
                filter = `nik ~ "${query.trim()}"`;
                // Artificial delay to prevent brute-force NIK scanning
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                filter = `nama ~ "${query.trim()}"`;
                // Shorter delay for name search
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            const records = await pb.collection("penerima_bansos").getList<PenerimaBansos>(1, 20, {
                filter,
                sort: "-tahun_penerimaan",
            });
            setResults(records.items);
        } catch (error: any) {
            console.error("Search error:", error);
            setErrorMsg("Terjadi kesalahan saat mencari data. Silakan coba lagi.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const getJenisBadgeColor = (jenis: string) => {
        switch (jenis) {
            case "PKH": return "bg-blue-100 text-blue-800 border-blue-200";
            case "BPNT": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "BLT DD": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-amber-700 via-orange-800 to-red-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/pelayanan" className="inline-flex items-center text-amber-200 hover:text-white gap-1 mb-6 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Pelayanan
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Cek Penerima Bantuan Sosial
                    </h1>
                    <p className="text-lg text-amber-100 max-w-2xl font-light leading-relaxed">
                        Periksa apakah Anda atau keluarga terdata sebagai penerima bantuan sosial di Desa Sumberanyar.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Privacy notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-4 items-start">
                        <ShieldCheck className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 space-y-1">
                            <p className="font-bold">Privasi Data Terjaga</p>
                            <p className="text-amber-700">
                                Data NIK yang ditampilkan telah disamarkan (masking) untuk melindungi privasi warga.
                                Hanya 4 digit awal dan 4 digit akhir NIK yang ditampilkan.
                            </p>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Masukkan NIK atau Nama Warga..."
                                    className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm flex-shrink-0"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                Cari Data
                            </button>
                        </form>

                        {errorMsg && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700">{errorMsg}</p>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {searched && !loading && (
                        <div className="space-y-4">
                            {results.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Info className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h3>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        Tidak ada data penerima Bantuan Sosial yang cocok dengan pencarian &quot;{query}&quot;. 
                                        Pastikan ejaan nama atau NIK sudah benar.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Ditemukan <span className="text-slate-900 font-bold">{results.length}</span> data penerima
                                    </p>
                                    {results.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <UserCheck className="w-6 h-6 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-lg">{item.nama}</h3>
                                                        <p className="text-sm text-slate-500 font-mono mt-0.5">
                                                            NIK: {maskNik(item.nik)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0",
                                                    getJenisBadgeColor(item.jenis_bantuan)
                                                )}>
                                                    {item.jenis_bantuan}
                                                </span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-sm text-slate-500">
                                                    Tahun Penerimaan: <span className="font-bold text-slate-700">{item.tahun_penerimaan}</span>
                                                </span>
                                                <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                                    Terverifikasi
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
