"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { InventarisDesa, InventarisDesaSchema } from "@/lib/validations/aset";
import { 
    Save, Loader2, ArrowLeft, Package, Tag, Layers, 
    Calendar, CheckCircle2, ShieldCheck, Activity,
    Info, Receipt, Archive, PencilLine
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InventarisFormProps {
    initialData?: (InventarisDesa & { id: string }) | null;
}

export function InventarisForm({ initialData }: InventarisFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<InventarisDesa>({
        resolver: zodResolver(InventarisDesaSchema),
        defaultValues: {
            nama_barang: "",
            kategori: "Lainnya",
            kuantitas: 1,
            tahun_perolehan: new Date().getFullYear(),
            kondisi: "Baik",
        }
    });

    const namaBarang = watch("nama_barang");
    const kondisi = watch("kondisi");
    const kategoriValue = watch("kategori");

    useEffect(() => {
        if (initialData) {
            reset({
                nama_barang: initialData.nama_barang,
                kategori: initialData.kategori,
                kuantitas: initialData.kuantitas,
                tahun_perolehan: initialData.tahun_perolehan,
                kondisi: initialData.kondisi,
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: InventarisDesa) => {
        setIsSaving(true);
        try {
            if (initialData?.id) {
                await pb.collection("inventaris_desa").update(initialData.id, data);
            } else {
                await pb.collection("inventaris_desa").create(data);
            }
            router.push("/panel/dashboard/aset/inventaris");
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Integrated Header (Bansos Reference) */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/aset/inventaris"
                            className="p-2.5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {initialData ? "Registrasi Aset" : "Pencatatan Inventaris Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Identifikasi fisik, kategori, dan kondisi aset bergerak desa.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        Simpan Pencatatan
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Content Column (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Identitas Fisik */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Package className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas Fisik Aset</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Nama Barang / Nama Aset</label>
                                    <input
                                        {...register("nama_barang")}
                                        className="w-full h-12 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-tight"
                                        placeholder="CONTOH: LAPTOP KANTOR / TRAKTOR SAWAH"
                                    />
                                    {errors.nama_barang && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.nama_barang.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Klasifikasi / Kategori</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Bangunan", "Kendaraan", "Elektronik", "Mebel", "Lainnya"].map((k) => (
                                                <button
                                                    key={k}
                                                    type="button"
                                                    onClick={() => setValue("kategori", k as any)}
                                                    className={cn(
                                                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                                                        kategoriValue === k 
                                                            ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/10"
                                                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                                    )}
                                                >
                                                    {k}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.kategori && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.kategori.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tahun Perolehan / Pembelian</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register("tahun_perolehan", { valueAsNumber: true })}
                                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-sm font-mono font-black"
                                                placeholder="202X"
                                            />
                                            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Kondisi & Inventarisasi */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Kondisi & Status Operasional</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Kuantitas Stok (Unit)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">QTY</div>
                                        <input
                                            type="number"
                                            {...register("kuantitas", { valueAsNumber: true })}
                                            className="w-full h-12 pl-14 pr-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-sm font-mono font-black"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Kondisi Fisik Terkini</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Baik", "Rusak Ringan", "Rusak Berat"].map((k) => (
                                            <button
                                                key={k}
                                                type="button"
                                                onClick={() => setValue("kondisi", k as any)}
                                                className={cn(
                                                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 group",
                                                    kondisi === k 
                                                        ? k === "Baik" ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/10"
                                                          : k === "Rusak Ringan" ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-900/10"
                                                          : "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/10"
                                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                                )}
                                            >
                                                {kondisi === k && <CheckCircle2 className="w-3.5 h-3.5 inline mr-2" />}
                                                {k}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Summary Column (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Aset Card Preview */}
                        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-950/20 relative overflow-hidden group min-h-[300px] flex flex-col justify-between border border-white/5">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all duration-700" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/10 text-white rounded-xl">
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Validasi Pencatatan</h3>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Preview Nama Aset</p>
                                        <h4 className="text-xl font-black text-white leading-tight uppercase tracking-tight">{namaBarang || "BELUM ADA NAMA"}</h4>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        In Stock
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 p-5 bg-white/5 rounded-[1.5rem] border border-white/10 mt-8">
                                <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] leading-relaxed mb-3">
                                    Data aset ini akan masuk ke dalam neraca kekayaan desa dan wajib dilaporkan dalam LKPJ akhir tahun anggaran.
                                </p>
                                <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                    <Receipt className="w-3 h-3" /> Ledger Certified
                                </div>
                            </div>
                        </div>

                        {/* Hint Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Prosedur Labeling</h3>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                Setelah data disimpan, harap segera memberikan nomor inventaris pada fisik barang sesuai dengan urutan pendaftaran sistem.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
