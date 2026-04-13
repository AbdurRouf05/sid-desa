"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { TanahDesa, TanahDesaSchema } from "@/lib/validations/aset";
import { 
    Save, Loader2, ArrowLeft, MapPin, Maximize, 
    Target, ShieldCheck, Compass, Landmark,
    Info, Activity, Map, Search, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TanahDesaFormProps {
    initialData?: (TanahDesa & { id: string }) | null;
}

export function TanahDesaForm({ initialData }: TanahDesaFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TanahDesa>({
        resolver: zodResolver(TanahDesaSchema),
        defaultValues: {
            lokasi: "",
            luas_m2: 0,
            peruntukan: "",
            pemegang_hak: ""
        }
    });

    const lokasi = watch("lokasi");
    const luas = watch("luas_m2");

    useEffect(() => {
        if (initialData) {
            reset({
                lokasi: initialData.lokasi,
                luas_m2: initialData.luas_m2,
                peruntukan: initialData.peruntukan || "",
                pemegang_hak: initialData.pemegang_hak || ""
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: TanahDesa) => {
        setIsSaving(true);
        try {
            if (initialData?.id) {
                await pb.collection("tanah_desa").update(initialData.id, data);
            } else {
                await pb.collection("tanah_desa").create(data);
            }
            router.push("/panel/dashboard/aset/tanah");
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
                            href="/panel/dashboard/aset/tanah"
                            className="p-2.5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {initialData ? "Registrasi Lahan" : "Inisialisasi Aset Tanah"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Pendataan spasial & kepemilikan aset tanah kas desa (TKD).
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
                        Simpan Data Tanah
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Content Column (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Geospasial & Lokasi */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identifikasi & Geospasial</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Lokasi / Nama Bidang Tanah</label>
                                    <input
                                        {...register("lokasi")}
                                        className="w-full h-12 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-tight"
                                        placeholder="CONTOH: DUSUN KRAJAN / SAWAH BENGKOK BLOK A"
                                    />
                                    {errors.lokasi && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.lokasi.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Luas Bidang (m²)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register("luas_m2", { valueAsNumber: true })}
                                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-sm font-mono font-black placeholder:font-sans"
                                                placeholder="0"
                                            />
                                            <Maximize className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        </div>
                                        {errors.luas_m2 && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.luas_m2.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Peruntukan / Fungsi</label>
                                        <div className="relative">
                                            <input
                                                {...register("peruntukan")}
                                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-sm font-bold uppercase tracking-tight"
                                                placeholder="MISAL: TKD / FASILITAS UMUM / SEKOLAH"
                                            />
                                            <Target className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Administrasi & Hukum */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas Hukum & Kepemilikan</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pemegang Hak / Bukti Seri Sertifikat</label>
                                <textarea
                                    {...register("pemegang_hak")}
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-tight"
                                    placeholder="CONTOH: PEMERINTAH DESA / SERTIFIKAT HAK PAKAI NOMOR 001/2024"
                                />
                                {errors.pemegang_hak && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.pemegang_hak.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Summary Column (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Land Card Preview */}
                        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-950/20 relative overflow-hidden group min-h-[300px] flex flex-col justify-between border border-white/5">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all duration-700" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/10 text-white rounded-xl">
                                        <Compass className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Preview Land Summary</h3>
                                </div>

                                <div className="space-y-5 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Identitas Lahan</p>
                                        <h4 className="text-xl font-black text-white leading-tight uppercase tracking-tight truncate" title={lokasi}>{lokasi || "LOKASI NIHIL"}</h4>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Total Luas</p>
                                            <p className="text-xl font-black text-white font-mono">{luas?.toLocaleString('id-ID')} <span className="text-xs text-slate-500">m²</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 p-5 bg-white/5 rounded-[1.5rem] border border-white/10 mt-8">
                                <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] leading-relaxed mb-3">
                                    Data lahan ini bersifat tetap dan merupakan aset strategis desa yang dilindungi secara hukum oleh Negara.
                                </p>
                                <div className="flex items-center justify-between text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Landmark className="w-3 h-3" /> GIS Verified
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Hint Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Sertifikasi Aset</h3>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                Pastikan nomor sertifikat atau nomor girik diinput secara lengkap untuk mempermudah audit fisik lahan oleh tim BPN.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
