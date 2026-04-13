"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { FileText, MapPin, Phone, Calendar, CheckCircle2, Clock, Trash2, Edit, AlertCircle, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/number-utils";
import { cn } from "@/lib/utils";

interface SuratOnline {
    id: string;
    nama: string;
    nik: string;
    jenis_surat: string;
    alamat_rantau: string;
    no_wa: string;
    status: string;
    created: string;
}

export default function SuratOnlineAdminPage() {
    const [requests, setRequests] = useState<SuratOnline[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const records = await pb.collection('permohonan_surat_online').getList<SuratOnline>(1, 50, {
                sort: '-created',
            });
            setRequests(records.items);
        } catch (e) {
            console.error("Error loading permohonan surat online", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        if (!confirm(`Ubah status permohonan menjadi "${status}"?`)) return;
        try {
            await pb.collection('permohonan_surat_online').update(id, { status });
            fetchData();
        } catch (e) {
            alert("Gagal memperbarui status permohonan.");
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm("Hapus permohonan ini secara permanen? Tindakan ini tidak dapat dibatalkan.")) return;
        try {
            await pb.collection('permohonan_surat_online').delete(id);
            setRequests(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Gagal menghapus permohonan.");
        }
    };

    const statusBadge = (status: string) => {
        const styles = {
            'Menunggu': 'bg-blue-50 text-blue-600 border-blue-100',
            'Diproses': 'bg-amber-50 text-amber-600 border-amber-100',
            'Selesai': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Ditolak': 'bg-red-50 text-red-600 border-red-100',
        };
        const icon = status === 'Menunggu' ? <Clock className="w-3 h-3" /> : 
                     status === 'Diproses' ? <Clock className="w-3 h-3" /> :
                     status === 'Selesai' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />;
        
        const style = styles[status as keyof typeof styles] || 'bg-slate-50 text-slate-500 border-slate-100';

        return (
            <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                style
            )}>
                {icon} {status}
            </span>
        );
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Permohonan Surat Online</h1>
                    <p className="text-sm text-slate-500 mt-1">Daftar permohonan surat administrasi dari warga di perantauan.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu & Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identitas Pemohon</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis Layanan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kontak & Alamat</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Sinkronisasi data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-200">
                                            <FileText className="w-12 h-12" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum ada permohonan aktif.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                {formatDate(item.created, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {statusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 border-l border-slate-50">
                                            <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{item.nama}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tight">NIK {item.nik}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                {item.jenis_surat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Phone className="w-3 h-3 text-slate-400" /> WhatsApp: {item.no_wa}
                                            </div>
                                            <div className="flex items-start gap-2 text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed font-bold uppercase tracking-tight">
                                                <MapPin className="w-3 h-3 text-slate-300 shrink-0 mt-0.5" /> 
                                                <span className="line-clamp-2" title={item.alamat_rantau}>{item.alamat_rantau}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex justify-end gap-2 items-center">
                                                {item.status === 'Menunggu' && (
                                                    <button 
                                                        onClick={() => updateStatus(item.id, 'Diproses')} 
                                                        className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all active:scale-95 shadow-sm shadow-emerald-200"
                                                    >
                                                        Proses
                                                    </button>
                                                )}
                                                {item.status === 'Diproses' && (
                                                    <button 
                                                        onClick={() => updateStatus(item.id, 'Selesai')} 
                                                        className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all active:scale-95 shadow-sm shadow-emerald-200"
                                                    >
                                                        Selesai
                                                    </button>
                                                )}
                                                <div className="flex gap-1 border-l border-slate-100 pl-2 ml-2">
                                                    <button 
                                                        onClick={() => deleteRequest(item.id)} 
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" 
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
