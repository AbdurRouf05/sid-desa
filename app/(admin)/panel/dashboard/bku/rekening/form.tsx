"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { RekeningKasForm as RekeningKasFormType, RekeningKasSchema } from "@/lib/validations/bku";
import { 
    Save, ArrowLeft, Loader2, Wallet, 
    Landmark, LayoutGrid, CheckCircle2, 
    Activity, Info, Calculator, ShieldCheck,
    History, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RekeningKasFormProps {
    id?: string;
}

export function RekeningKasForm({ id }: RekeningKasFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RekeningKasFormType>({
        resolver: zodResolver(RekeningKasSchema),
        defaultValues: {
            jenis: "Tunai",
            nama_rekening: "",
        },
    });

    const watchJenis = watch("jenis");
    const watchNama = watch("nama_rekening");

    useEffect(() => {
        if (id) {
            const fetchRecord = async () => {
                try {
                    const record = await pb.collection("rekening_kas").getOne<RekeningKasFormType>(id);
                    setValue("nama_rekening", record.nama_rekening);
                    setValue("jenis", record.jenis);
                } catch (error) {
                    router.push("/panel/dashboard/bku/rekening");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecord();
        }
    }, [id, setValue, router]);

    const onSubmit = async (data: RekeningKasFormType) => {
        setIsSaving(true);
        try {
            if (id) {
                await pb.collection("rekening_kas").update(id, data);
            } else {
                await pb.collection("rekening_kas").create(data);
            }
            router.push("/panel/dashboard/bku/rekening");
            router.refresh();
        } catch (error: any) {
            alert("Gagal menyimpan data rekening.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                    <Activity className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">System Recovery...</p>
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* 1. Integrated Premium Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-4">
                    <div className="flex items-center gap-5">
                        <Link
                            href="/panel/dashboard/bku/rekening"
                            className="p-3.5 bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-md">Master Data</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Module v2</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">
                                {id ? "Edit Rekening" : "Registrasi Dompet"}
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">
                                Kelola dompet/laci utama untuk pencatatan Buku Kas Umum (BKU)
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        Simpan Perubahan
                    </button>
                </div>

                {/* 2. Asymmetric Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Main Form Column (8) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Section: Tipe Rekening */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md relative overflow-hidden group">
                            {/* Decorative Watermark */}
                            <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                                <LayoutGrid className="w-48 h-48 -rotate-12 text-emerald-900" />
                            </div>

                            <div className="relative z-10 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                                            <Calculator className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Klasifikasi Aset Desa</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {[
                                            { val: 'Tunai', label: 'Kas Tunai Desa', desc: 'Arus dana fisik yang dikelola bendahara.', icon: Wallet, color: 'emerald' },
                                            { val: 'Bank', label: 'Rekening Bank', desc: 'Saldo tersimpan di rekening resmi desa.', icon: Landmark, color: 'blue' },
                                        ].map((type) => (
                                            <label key={type.val} className={cn(
                                                "flex flex-col p-6 border-2 rounded-[2.2rem] cursor-pointer transition-all duration-500 relative group overflow-hidden active:scale-95",
                                                watchJenis === type.val 
                                                    ? "border-emerald-500 bg-emerald-50/50 shadow-xl shadow-emerald-900/5 ring-8 ring-emerald-500/5" 
                                                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                                            )}>
                                                <input type="radio" value={type.val} className="sr-only" {...register("jenis")} />
                                                <div className="flex items-center justify-between mb-5">
                                                    <div className={cn(
                                                        "p-3.5 rounded-2xl transition-all duration-500",
                                                        watchJenis === type.val ? "bg-emerald-600 text-white rotate-6 scale-110" : "bg-white text-slate-400 shadow-sm border border-slate-100"
                                                    )}>
                                                        <type.icon className="w-6 h-6" />
                                                    </div>
                                                    {watchJenis === type.val && (
                                                        <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg animate-in zoom-in-50">
                                                            Aktif
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "text-[12px] font-black uppercase tracking-widest mb-1 transition-colors",
                                                    watchJenis === type.val ? "text-emerald-900" : "text-slate-500"
                                                )}>{type.label}</span>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed pr-6">{type.desc}</p>
                                                
                                                {watchJenis === type.val && (
                                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-200/30">
                                                        <CheckCircle2 className="w-full h-full" />
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 ml-1">Identitas Rekening / Dompet</label>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full",
                                            watchNama.length < 3 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                                        )}>
                                            {watchNama.length} / 50 UNIT
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <CreditCard className={cn("w-5 h-5 transition-colors duration-500", watchNama.length > 0 ? "text-emerald-600" : "text-slate-300")} />
                                        </div>
                                        <input 
                                            {...register("nama_rekening")} 
                                            maxLength={50}
                                            placeholder={watchJenis === 'Tunai' ? "MISAL: KAS TUNAI BENDAHARA DESA" : "MISAL: BANK JATIM (REK. KAS DESA)"}
                                            className="w-full h-16 pl-16 pr-8 rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-600 focus:ring-0 transition-all outline-none font-black text-slate-800 tracking-tight text-sm uppercase placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                    {errors.nama_rekening && (
                                        <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-in slide-in-from-top-2">
                                            <Info className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-tight">{errors.nama_rekening.message}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Awareness Card */}
                        <div className="bg-emerald-50/50 p-6 rounded-[2.2rem] border border-dashed border-emerald-200 flex flex-col md:flex-row items-center gap-8 group hover:bg-emerald-100/30 hover:border-emerald-400 transition-all duration-300">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-emerald-100">
                                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="space-y-1.5 text-center md:text-left">
                                <h4 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">Validasi Integritas Sistem</h4>
                                <p className="text-[10px] text-emerald-700 font-bold leading-relaxed max-w-lg opacity-80">
                                    Rekening ini akan menjadi referensi utama pada modul **Buku Kas Umum**. Pastikan nama rekening deskriptif untuk transparansi audit.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column (4) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 1. Status Summary Card (Modern Green Theme) */}
                        <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-950 text-white p-8 rounded-[2.8rem] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group border border-white/5">
                            {/* Decorative Elements */}
                            <div className="absolute -right-10 -top-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-400/30 transition-all duration-700" />
                            <div className="absolute left-0 bottom-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl backdrop-blur-md border border-white/5">
                                        <Activity className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">Sistem Info</h3>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Integration</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-1">Kondisi Entri</p>
                                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-pulse" />
                                            <p className="text-xs font-black uppercase tracking-widest">{id ? "Mode Koreksi" : "Master Baru"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-1">Live Pratinjau</p>
                                        <div className="p-5 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 space-y-4 backdrop-blur-md">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Label Rekening</p>
                                                <p className="text-[12px] font-black uppercase tracking-tight text-emerald-400 leading-tight">
                                                    {watchNama || "..."}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pb-1">
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Klasifikasi</p>
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-white flex items-center gap-2">
                                                        {watchJenis === 'Tunai' ? <Wallet className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                                                        {watchJenis}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Versi</p>
                                                    <p className="text-[10px] font-mono text-slate-400">2.0.4</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Security Encrypted</span>
                                    </div>
                                    <History className="w-4 h-4 text-emerald-800" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Strategy Card (Soft Emerald) */}
                        <div className="bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/10 space-y-4 relative overflow-hidden group">
                            {/* Decorative Icon */}
                            <Info className="absolute -right-6 -bottom-6 w-24 h-24 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
                            
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="w-4 h-px bg-white/30" />
                                Tips Digital
                            </h4>
                            <p className="text-[12px] font-bold text-emerald-50 leading-relaxed italic pr-6 pb-2">
                                "Penyebutan kode bank atau cabang pada nama rekening sangat membantu audit transparansi desa di masa depan."
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
