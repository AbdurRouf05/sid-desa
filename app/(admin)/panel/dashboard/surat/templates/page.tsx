"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    FileText,
    FileCode,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSuratTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const result = await pb.collection('surat_templates').getFullList({
                sort: '-created'
            });
            setTemplates(result);
        } catch (e: any) {
            console.error("Error fetching templates:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Yakin ingin menghapus template "${name}"?`)) return;
        try {
            await pb.collection('surat_templates').delete(id);
            fetchTemplates();
        } catch (e) {
            alert("Gagal menghapus template");
        }
    };

    return (
        <main className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Draf Template Surat</h1>
                    <p className="text-slate-500">Kelola format dan struktur surat pintar untuk layanan warga.</p>
                </div>
                <Link
                    href="/panel/dashboard/surat/templates/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Buat Template Baru
                </Link>
            </div>

            {/* List Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4"></div>
                            <div className="h-5 bg-slate-100 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                        </div>
                    ))
                ) : templates.length === 0 ? (
                    <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
                        <FileCode className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Template</h3>
                        <p className="text-slate-500 mb-6">Silakan buat template surat pertama desa Anda.</p>
                        <Link
                            href="/panel/dashboard/surat/templates/baru"
                            className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline"
                        >
                            <Plus className="w-4 h-4" /> Tambah Sekarang
                        </Link>
                    </div>
                ) : (
                    templates.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <Link
                                        href={`/panel/dashboard/surat/templates/${item.id}`}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        title="Edit Template"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id, item.nama_surat)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
                                <FileText className="w-6 h-6" />
                            </div>
                            
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                                {item.nama_surat}
                            </h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                    {item.kode_surat}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-400">
                                    {Object.keys(item.fields_config || {}).length} Variabel
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-[10px] text-slate-400">
                                    Dibuat: {new Date(item.created).toLocaleDateString('id-ID')}
                                </div>
                                <Link
                                    href={`/panel/dashboard/surat/templates/${item.id}`}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                    Buka Editor <Edit className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
