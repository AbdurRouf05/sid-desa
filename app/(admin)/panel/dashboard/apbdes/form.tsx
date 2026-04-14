"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, HelpCircle, Calendar, Tag, CreditCard, Activity } from "lucide-react";
import Link from "next/link";
import { ApbdesData, ApbdesSchema } from "@/lib/validations/apbdes";
import { ApbdesRealisasi } from "@/types";

export default function ApbdesFormPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = isEdit ? useParams() : null;
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ApbdesData>({
        resolver: zodResolver(ApbdesSchema) as any,
        defaultValues: {
            tahun_anggaran: new Date().getFullYear(),
            kategori: "Alokasi Dana Desa (ADD)",
            nama_bidang: "",
            anggaran: 0,
            realisasi: 0,
        }
    });

    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchData = async () => {
                try {
                    const record = await pb.collection("apbdes_realisasi").getOne<ApbdesRealisasi>(params.id as string);
                    setValue("tahun_anggaran", record.tahun_anggaran);
                    setValue("kategori", record.kategori);
                    setValue("nama_bidang", record.nama_bidang);
                    setValue("anggaran", record.anggaran);
                    setValue("realisasi", record.realisasi);
                } catch (e) {
                    console.error("Gagal memuat data APBDes", e);
                    alert("Gagal memuat data");
                    router.push("/panel/dashboard/apbdes");
                }
            };
            fetchData();
        }
    }, [isEdit, params, setValue, router]);

    const onSubmit = async (data: ApbdesData) => {
        setIsLoading(true);
        try {
            if (isEdit && params?.id) {
                await pb.collection("apbdes_realisasi").update(params.id as string, data);
            } else {
                await pb.collection("apbdes_realisasi").create(data);
            }
            router.push("/panel/dashboard/apbdes");
        } catch (e) {
            console.error("Gagal menyimpan data APBDes", e);
            alert("Gagal menyimpan data APBDes. Silakan periksa isian Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Clean Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/apbdes"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Perbarui Anggaran" : "Input Anggaran Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Kelola transparansi anggaran berdasarkan sumber dana desa.
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
                        Simpan Anggaran
                    </button>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Tahun Anggaran */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <Calendar className="w-3 h-3" /> Tahun Anggaran
                            </label>
                            <input
                                type="number"
                                {...register("tahun_anggaran")}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold"
                            />
                            {errors.tahun_anggaran && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.tahun_anggaran.message}</p>}
                        </div>

                        {/* Sumber Dana */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <Tag className="w-3 h-3" /> Sumber Dana
                                </label>
                                <div className="relative group cursor-help">
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                                    <div className="absolute right-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 p-3 bg-emerald-800 text-white text-[10px] leading-relaxed rounded-xl shadow-xl z-50 pointer-events-none font-medium">
                                        Pilih asal sumber dana anggaran.
                                    </div>
                                </div>
                            </div>
                            <select
                                {...register("kategori")}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none"
                            >
                                <option value="Alokasi Dana Desa (ADD)">ALOKASI DANA DESA (ADD)</option>
                                <option value="Dana Desa (DD)">DANA DESA (DD)</option>
                                <option value="BHP/BHR">BHP / BHR</option>
                                <option value="Bunga Bank">BUNGA BANK</option>
                            </select>
                            {errors.kategori && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.kategori.message}</p>}
                        </div>


                        {/* Nama Bidang */}
                        <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <CreditCard className="w-3 h-3" /> Sub Kategori / Rincian Bidang
                                </label>
                                <div className="relative group cursor-help">
                                    <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                                    <div className="absolute right-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-72 p-4 bg-emerald-800 text-white text-[10px] leading-relaxed rounded-xl shadow-xl z-50 pointer-events-none font-medium">
                                        Contoh Pendapatan: "Bagi Hasil Pajak", "ADD".<br/>Contoh Belanja: "Penyelenggaran Pemerintahan", "Pembangunan".
                                    </div>
                                </div>
                            </div>
                            <input
                                {...register("nama_bidang")}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold placeholder:font-normal"
                                placeholder="Contoh: Bidang Penyelenggaran Pemerintahan Desa"
                            />
                            {errors.nama_bidang && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.nama_bidang.message}</p>}
                        </div>

                        {/* Anggaran */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Target Anggaran (Rp)
                            </label>
                            <input
                                type="number"
                                {...register("anggaran")}
                                className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold"
                                placeholder="0"
                            />
                            {errors.anggaran && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.anggaran.message}</p>}
                        </div>

                        {/* Realisasi */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <Activity className="w-3 h-3" /> Realisasi (Rp)
                            </label>
                            <input
                                type="number"
                                {...register("realisasi")}
                                className="w-full px-5 py-3 bg-emerald-50/20 border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold text-emerald-700"
                                placeholder="0"
                            />
                            {errors.realisasi && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.realisasi.message}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
