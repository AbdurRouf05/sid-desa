"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, AlertTriangle, ShieldCheck, FileText, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { pb } from "@/lib/pb";

export function FormBansos() {
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'nik' | 'nama'>('nama');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'not-found' | 'error'>('idle');
    const [results, setResults] = useState<any[]>([]);
    
    // Public list state
    const [publicList, setPublicList] = useState<any[]>([]);
    const [publicLoading, setPublicLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10;

    // Load public list on mount and page change
    useEffect(() => {
        loadPublicList();
    }, [page]);

    const loadPublicList = async () => {
        setPublicLoading(true);
        try {
            const res = await pb.collection('penerima_bansos').getList(page, perPage, {
                sort: '-tahun_penerimaan,-created',
                expand: 'jenis_bantuan',
            });
            setPublicList(res.items);
            setTotalPages(res.totalPages);
        } catch (err) {
            console.error("Failed to load bansos list:", err);
        } finally {
            setPublicLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!query.trim()) return;

        // Validate NIK if in NIK mode
        if (searchMode === 'nik' && query.length !== 16) {
            alert("NIK harus terdiri dari 16 digit angka.");
            return;
        }

        setStatus('loading');
        
        try {
            let filter = '';
            if (searchMode === 'nik') {
                filter = `nik="${query}"`;
            } else {
                filter = `nama~"${query}"`;
            }

            const res = await pb.collection('penerima_bansos').getList(1, 50, { 
                filter,
                expand: 'jenis_bantuan',
            });
            
            if (res.items.length > 0) {
                setResults(res.items);
                setStatus('success');
            } else {
                setResults([]);
                setStatus('not-found');
            }
        } catch (error: any) {
            if (error.status === 404) {
               setStatus('not-found');
            } else {
               console.error("Search error:", error);
               setStatus('not-found'); 
            }
        }
    };

    const resetSearch = () => {
        setQuery('');
        setStatus('idle');
        setResults([]);
    };

    // Mask NIK for privacy: show first 6 and last 4
    const maskNik = (nik: string) => {
        if (!nik || nik.length < 16) return '****************';
        return nik.substring(0, 6) + '******' + nik.substring(12, 16);
    };

    return (
        <div className="p-4 md:p-6">
            
            <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800">
                <FileText className="w-6 h-6 shrink-0 text-blue-500 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold mb-1">Data Penerima Bantuan Sosial Desa</p>
                    <p>Cari berdasarkan <strong>Nama</strong> atau <strong>NIK</strong> untuk memeriksa status penerimaan bantuan.</p>
                </div>
            </div>

            {/* Search Mode Toggle */}
            <div className="flex gap-2 mb-3">
                <button 
                    onClick={() => { setSearchMode('nama'); resetSearch(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${searchMode === 'nama' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Cari Nama
                </button>
                <button 
                    onClick={() => { setSearchMode('nik'); resetSearch(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${searchMode === 'nik' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Cari NIK
                </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative mb-6">
                <input 
                    type="text" 
                    required
                    maxLength={searchMode === 'nik' ? 16 : 100}
                    value={query}
                    onChange={(e) => setQuery(searchMode === 'nik' ? e.target.value.replace(/\D/g, '') : e.target.value)}
                    placeholder={searchMode === 'nik' ? "Masukkan 16 Digit NIK..." : "Ketik nama penerima..."} 
                    className={`w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-slate-700 text-lg font-medium shadow-sm transition-all ${searchMode === 'nik' ? 'tracking-widest font-mono' : 'tracking-normal'}`} 
                />
                <button 
                    type="submit" 
                    disabled={status === 'loading' || !query.trim() || (searchMode === 'nik' && query.length < 16)}
                    className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 flex items-center gap-2 font-bold transition-colors disabled:opacity-50"
                >
                    {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5"/> Cari</>}
                </button>
            </form>

            {/* Search Results */}
            {status === 'success' && results.length > 0 && (
                <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" /> Hasil Pencarian ({results.length} ditemukan)
                        </h3>
                        <button onClick={resetSearch} className="text-xs text-slate-500 hover:text-red-500 font-bold">✕ Hapus</button>
                    </div>
                    <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50 border-b border-green-100">
                                    <th className="text-left px-4 py-3 font-bold text-green-800">Nama</th>
                                    <th className="text-left px-4 py-3 font-bold text-green-800 hidden sm:table-cell">Jenis Bantuan</th>
                                    <th className="text-center px-4 py-3 font-bold text-green-800">Tahun</th>
                                    <th className="text-center px-4 py-3 font-bold text-green-800 hidden md:table-cell">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, i) => (
                                    <tr key={item.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-green-50/50 transition-colors`}>
                                    <td className="px-4 py-3">
                                            <p className="font-bold text-slate-800">{item.nama}</p>
                                            <p className="text-xs text-slate-400 font-mono sm:hidden">{item.expand?.jenis_bantuan?.nama || item.jenis_bantuan || '-'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{item.expand?.jenis_bantuan?.nama || item.jenis_bantuan || '-'}</td>
                                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">{item.tahun_penerimaan}</td>
                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                                item.status_penyaluran === 'Sudah Disalurkan' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {item.status_penyaluran || 'Proses'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {status === 'not-found' && (
                <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 bg-amber-50 border border-amber-200 p-6 rounded-xl text-center mb-8">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-3">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-amber-800 text-lg mb-2">Data Tidak Ditemukan</h3>
                    <p className="text-amber-700 text-sm max-w-sm mx-auto">
                        {searchMode === 'nik' 
                            ? 'NIK yang Anda masukkan tidak terdaftar. Pastikan 16 digit NIK sudah benar.'
                            : `Nama "${query}" tidak ditemukan dalam daftar penerima bantuan sosial periode ini.`
                        }
                    </p>
                    <button onClick={resetSearch} className="mt-4 text-sm text-amber-600 font-bold hover:underline">Coba Lagi</button>
                </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Daftar Penerima Bansos
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Public List Table */}
            {publicLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Memuat data...
                </div>
            ) : publicList.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-3 font-bold text-slate-600 w-8">#</th>
                                <th className="text-left px-4 py-3 font-bold text-slate-600">Nama Penerima</th>
                                <th className="text-left px-4 py-3 font-bold text-slate-600 hidden sm:table-cell">Jenis Bantuan</th>
                                <th className="text-center px-4 py-3 font-bold text-slate-600">
                                    <span className="flex items-center justify-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tahun</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {publicList.map((item, i) => (
                                <tr key={item.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-blue-50/50 transition-colors`}>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{(page - 1) * perPage + i + 1}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-slate-800">{item.nama}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{item.expand?.jenis_bantuan?.nama || item.jenis_bantuan || '-'}</td>
                                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">{item.tahun_penerimaan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page <= 1}
                                className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Sebelumnya
                            </button>
                            <span className="text-xs font-bold text-slate-400">Halaman {page} dari {totalPages}</span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                                disabled={page >= totalPages}
                                className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Berikutnya <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Belum ada data penerima bansos.</p>
                    <p className="text-xs mt-1">Admin dapat menambahkan data melalui Control Panel.</p>
                </div>
            )}
        </div>
    );
}
