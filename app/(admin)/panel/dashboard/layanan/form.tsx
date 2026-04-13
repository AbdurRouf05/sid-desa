"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, HelpCircle, Plus, Trash2, ListChecks, Info, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { LayananDesa } from "@/types";
import { cn } from "@/lib/utils";

const LayananSchema = z.object({
    nama_layanan: z.string().min(3, "Nama layanan minimal 3 karakter"),
    deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
    konten: z.string().optional(),
    icon: z.string().optional(),
    tipe: z.enum(['panduan', 'lapor', 'bansos', 'link_eksternal', 'halaman_statis']),
    aksi_url: z.string().optional(),
    is_active: z.boolean().default(true),
    urutan: z.coerce.number().default(0),
});

type LayananData = z.infer<typeof LayananSchema>;

export default function LayananFormPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LayananData>({
        resolver: zodResolver(LayananSchema) as any,
        defaultValues: {
            nama_layanan: "",
            deskripsi: "",
            konten: "",
            icon: "FileSignature",
            tipe: "panduan",
            aksi_url: "",
            is_active: true,
            urutan: 0,
        }
    });

    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchData = async () => {
                try {
                    const record = await pb.collection("layanan_desa").getOne<LayananDesa>(params.id as string);
                    setValue("nama_layanan", record.nama_layanan);
                    setValue("deskripsi", record.deskripsi);
                    setValue("konten", record.konten || "");
                    setValue("icon", record.icon || "FileSignature");
                    setValue("tipe", record.tipe);
                    setValue("is_active", record.is_active !== false);
                    setValue("urutan", record.urutan || 0);

                    // Parse HTML requirements to array
                    if (record.konten) {
                        const items = Array.from(record.konten.matchAll(/<li>(.*?)<\/li>/g), m => {
                            return m[1].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
                        });
                        setRequirements(items);
                    }
                } catch (e) {
                    console.error("Gagal memuat data Layanan", e);
                    alert("Gagal memuat data");
                    router.push("/panel/dashboard/layanan");
                }
            };
            fetchData();
        }
    }, [isEdit, params, setValue, router]);

    const addRequirement = () => {
        if (newItem.trim()) {
            setRequirements([...requirements, newItem.trim()]);
            setNewItem("");
        }
    };

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: LayananData) => {
        setIsLoading(true);
        try {
            const htmlContent = `<div><strong>Berkas yang wajib dibawa:</strong><ul class="mt-2 list-disc pl-5 space-y-1">${requirements.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
            const finalData = { ...data, konten: htmlContent };

            if (isEdit && params?.id) {
                await pb.collection("layanan_desa").update(params.id as string, finalData);
            } else {
                await pb.collection("layanan_desa").create(finalData);
            }
            router.push("/panel/dashboard/layanan");
        } catch (e) {
            console.error("Gagal menyimpan data Layanan", e);
            alert("Gagal menyimpan data Layanan. Silakan periksa isian Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/layanan"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Informasi Syarat" : "Panduan Syarat Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Atur katalog persyaratan layanan yang akan tampil di portal publik.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        Simpan Panduan
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-8">
                            {/* Nama Layanan */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Nama Surat / Layanan
                                </label>
                                <input
                                    {...register("nama_layanan")}
                                    className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-wide"
                                    placeholder="Contoh: Surat Pengantar KTP"
                                />
                                {errors.nama_layanan && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nama_layanan.message}</p>}
                            </div>

                            {/* Penjelasan Singkat */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Penjelasan Singkat
                                </label>
                                <input
                                    {...register("deskripsi")}
                                    className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="Contoh: Syarat utama untuk pengurusan KTP di kantor desa."
                                />
                                {errors.deskripsi && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.deskripsi.message}</p>}
                            </div>

                            {/* Requirements Editor */}
                            <div className="pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                        <ListChecks className="w-4 h-4 text-emerald-600" />
                                        Berkas Persyaratan (Daftar Poin)
                                    </label>
                                    <span className="text-[9px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-slate-200">
                                        Wajib Dibawa
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {requirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-2 group animate-in slide-in-from-left-2 duration-300">
                                            <div className="flex-1 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-between group-hover:bg-white group-hover:border-slate-200 transition-all">
                                                <span>{req}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeRequirement(idx)}
                                                    className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                        className="flex-1 px-5 py-3 bg-slate-50/30 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold"
                                        placeholder="Tulis syarat baru (Cth: Fotokopi KK)..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addRequirement}
                                        className="px-5 py-3 bg-emerald-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Status & Order */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Pengaturan Tampilan</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        {...register("urutan")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono font-bold text-sm"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer group hover:bg-emerald-50 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            {...register("is_active")} 
                                            className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300" 
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                                                {watch("is_active") ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                                                Status Publik
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tampilkan Layanan di Beranda</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Hint Card */}
                        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-xl shadow-emerald-500/20 relative overflow-hidden group border border-white/10">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125" />
                            <div className="relative z-10 space-y-4">
                                <div className="p-2 bg-white/20 w-fit rounded-lg">
                                    <HelpCircle className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-wider">Mendukung Panduan Saja</h3>
                                <p className="text-[10px] text-emerald-100 leading-relaxed font-bold uppercase tracking-tight">
                                    Saat ini input hanya mendukung kategori panduan persyaratan. Warga akan melihat daftar poin berkas yang Anda tambahkan di atas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
