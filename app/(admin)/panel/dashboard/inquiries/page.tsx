"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle2, Clock, Archive, MapPin } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { formatDate } from "@/lib/number-utils";
import { PengaduanWarga } from "@/types";

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
        if (!confirm(`Ubah status menjadi ${status}?`)) return;
        try {
            await pb.collection('pengaduan_warga').update(id, { status });
            fetchInquiries(); // Refresh
        } catch (e) {
            alert("Gagal update status");
        }
    };

    const deleteInquiry = async (id: string) => {
        if (!confirm("Hapus pengaduan ini permanen?")) return;
        try {
            await pb.collection('pengaduan_warga').delete(id);
            setInquiries(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Gagal menghapus pengaduan");
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'Baru': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Baru</span>;
            case 'Diproses': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Diproses</span>;
            case 'Selesai': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-max"><Archive className="w-3 h-3" /> Arsip</span>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat pengaduan...</div>;

    return (
        <main className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pengaduan Warga</h1>
                    <p className="text-slate-500 mt-1">Daftar pengaduan, laporan, dan pesan dari warga.</p>
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Belum ada pengaduan masuk</h3>
                    <p className="text-slate-500">Pengaduan dari formulir laporan warga akan muncul di sini.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 text-sm">
                    {inquiries.map((item) => {
                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:gap-6">
                                {/* Header / Meta (Identitas & Tanggal) */}
                                <div className="w-full md:w-56 shrink-0">
                                    <div className="flex justify-between items-start md:block">
                                        <p className="font-bold text-slate-900 text-base mb-2 select-all line-clamp-1 truncate" title={item.nama_pelapor}>{item.nama_pelapor}</p>
                                        <div className="md:hidden">
                                            {statusBadge(item.status)}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate" title={item.tempat_tinggal}>{item.tempat_tinggal || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{formatDate(item.created, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Laporan */}
                                <div className="flex-1 flex flex-col min-w-0 text-slate-700">
                                    <div className="hidden md:block mb-2">
                                        {statusBadge(item.status)}
                                    </div>
                                    <p className="leading-relaxed whitespace-pre-wrap">{item.isi_laporan}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="md:w-32 flex flex-row md:flex-col items-center md:items-end justify-start md:justify-start gap-2 shrink-0 md:border-l md:border-slate-100 md:pl-4 pt-2 md:pt-0">
                                    {item.status === 'Baru' && (
                                        <button 
                                            onClick={() => updateStatus(item.id, 'Diproses')}
                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors border border-blue-200"
                                        >
                                            Proses
                                        </button>
                                    )}
                                    {item.status === 'Diproses' && (
                                        <button 
                                            onClick={() => updateStatus(item.id, 'Selesai')}
                                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                                        >
                                            Selesai
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteInquiry(item.id)}
                                        className="w-full flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors border border-rose-200"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
