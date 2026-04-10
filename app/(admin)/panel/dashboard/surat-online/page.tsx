"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { FileText, MapPin, Phone, Calendar, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/lib/number-utils";

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
        if (!confirm(`Ubah status menjadi ${status}?`)) return;
        try {
            await pb.collection('permohonan_surat_online').update(id, { status });
            fetchData();
        } catch (e) {
            alert("Gagal update status");
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm("Hapus permohonan ini permanen?")) return;
        try {
            await pb.collection('permohonan_surat_online').delete(id);
            setRequests(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Gagal menghapus permohonan");
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'Menunggu': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Menunggu</span>;
            case 'Diproses': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Diproses</span>;
            case 'Selesai': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
            case 'Ditolak': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max">Ditolak</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase w-max">{status}</span>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat data...</div>;

    return (
        <main>
            <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Permohonan Surat Online</h1>
                    <p className="text-slate-500 mt-1">Daftar permohonan surat dari warga rantau.</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Belum ada permohonan</h3>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
                                    <th className="p-4 font-bold">Tanggal</th>
                                    <th className="p-4 font-bold">Pemohon & NIK</th>
                                    <th className="p-4 font-bold">Jenis Surat</th>
                                    <th className="p-4 font-bold">Kontak & Alamat Rantau</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {requests.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-500">
                                            {formatDate(item.created, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{item.nama}</div>
                                            <div className="text-slate-500 font-mono text-xs">{item.nik}</div>
                                        </td>
                                        <td className="p-4 font-semibold text-emerald-700">
                                            {item.jenis_surat}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-slate-700">
                                                <Phone className="w-3 h-3 text-slate-400" /> {item.no_wa}
                                            </div>
                                            <div className="flex items-start gap-1 text-slate-500 text-xs mt-1 max-w-xs">
                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" /> 
                                                <span className="line-clamp-2" title={item.alamat_rantau}>{item.alamat_rantau}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {statusBadge(item.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {item.status === 'Menunggu' && (
                                                    <button onClick={() => updateStatus(item.id, 'Diproses')} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                                        Proses
                                                    </button>
                                                )}
                                                {item.status === 'Diproses' && (
                                                    <button onClick={() => updateStatus(item.id, 'Selesai')} className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                                                        Selesai
                                                    </button>
                                                )}
                                                <button onClick={() => deleteRequest(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
}
