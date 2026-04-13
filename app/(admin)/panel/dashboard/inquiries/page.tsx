"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { MessageSquare, Calendar, Trash2, CheckCircle2, Clock, Archive, MapPin, User, Reply, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/number-utils";
import { PengaduanWarga } from "@/types";
import { cn } from "@/lib/utils";

export default function PengaduanAdminPage() {
    const [inquiries, setInquiries] = useState<PengaduanWarga[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const records = await pb.collection('pengaduan_warga').getList<PengaduanWarga>(1, 50, {
                sort: '-created',
            });
            setInquiries(records.items);
        } catch (e) {
            console.error("Error loading pengaduan", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const updateStatus = async (id: string, status: PengaduanWarga['status']) => {
        if (!confirm(`Ubah status pengaduan menjadi ${status}?`)) return;
        try {
            await pb.collection('pengaduan_warga').update(id, { status });
            fetchInquiries();
        } catch (e) {
            alert("Gagal memperbarui status.");
        }
    };

    const deleteInquiry = async (id: string) => {
        if (!confirm("Hapus laporan pengaduan ini permanen dari sistem?")) return;
        try {
            await pb.collection('pengaduan_warga').delete(id);
            setInquiries(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Gagal menghapus laporan.");
        }
    };

    const statusBadge = (status: string) => {
        const base = "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit";
        switch (status) {
            case 'Baru': 
                return <span className={cn(base, "bg-blue-50 text-blue-600 border-blue-100")}><Clock className="w-3 h-3" /> Baru</span>;
            case 'Diproses': 
                return <span className={cn(base, "bg-amber-50 text-amber-600 border-amber-100")}><ActivityIcon className="w-3 h-3" /> Diproses</span>;
            case 'Selesai': 
                return <span className={cn(base, "bg-emerald-50 text-emerald-600 border-emerald-100")}><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
            default: 
                return <span className={cn(base, "bg-slate-100 text-slate-400 border-slate-200")}><Archive className="w-3 h-3" /> Arsip</span>;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Pusat Pengaduan</h1>
                    <p className="text-sm text-slate-500 mt-1">Pantau aspirasi, laporan masalah, dan konsultasi dari warga desa.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Total {inquiries.length} Laporan
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                    <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi Laporan...</p>
                </div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Kotak pengaduan saat ini sedang kosong.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {inquiries.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row">
                            {/* Profile / Info Sidebar on Tablet/Desktop */}
                            <div className="lg:w-72 bg-slate-50/50 p-6 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm truncate" title={item.nama_pelapor}>
                                            {item.nama_pelapor}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">Pelapor</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-2">
                                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="truncate">{item.tempat_tinggal || "Alamat tidak disebut"}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                        <span>{formatDate(item.created, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 hidden lg:block">
                                    {statusBadge(item.status)}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col bg-white">
                                <div className="lg:hidden mb-6 flex justify-between items-center">
                                    {statusBadge(item.status)}
                                    <span className="text-[10px] font-black text-slate-300 font-mono">ID: {item.id.slice(0,6)}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-4">
                                        <Reply className="w-5 h-5 text-slate-200 shrink-0 mt-1 hidden sm:block" />
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {item.isi_laporan}
                                        </p>
                                    </div>
                                </div>

                                {/* Dynamic Action Buttons */}
                                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-end gap-2">
                                    {item.status === 'Baru' && (
                                        <button 
                                            onClick={() => updateStatus(item.id, 'Diproses')}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-emerald-900/5 flex items-center gap-2"
                                        >
                                            <ActivityIcon className="w-3.5 h-3.5" />
                                            Proses Laporan
                                        </button>
                                    )}
                                    {item.status === 'Diproses' && (
                                        <button 
                                            onClick={() => updateStatus(item.id, 'Selesai')}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-emerald-900/5 flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Tandai Selesai
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteInquiry(item.id)}
                                        className="px-4 py-2 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Info Hint */}
            <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <p className="text-xs text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
                    <span className="block mb-0.5">Penting:</span>
                    Laporan pengaduan bersifat rahasia. Pastikan tindak lanjut dilakukan secara profesional oleh perangkat desa yang berwenang.
                </p>
            </div>
        </div>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
}
