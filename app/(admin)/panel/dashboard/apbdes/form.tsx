"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, HelpCircle } from "lucide-react";
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
            kategori: "Pendapatan",
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
        <main className="max-w-3xl mx-auto pb-20">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-8 px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/apbdes"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Data APBDes" : "Input APBDes Baru"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Lengkapi data anggaran dan realisasi administrasi desa.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Simpan Data
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tahun Anggaran</label>
                            <input
                                type="number"
                                {...register("tahun_anggaran")}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                            {errors.tahun_anggaran && <p className="text-sm text-red-500 mt-1">{errors.tahun_anggaran.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700">Kategori Utama</label>
                                <div className="relative group inline-block ml-2 cursor-help">
                                    <HelpCircle className="w-4 h-4 text-slate-400" />
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none">
                                        Pilih Kategori Utama (Pendapatan / Belanja / Pembiayaan). Total anggaran akan dijumlahkan berdasarkan kategori ini.
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                            <select
                                {...register("kategori")}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            >
                                <option value="Pendapatan">Pendapatan</option>
                                <option value="Belanja">Belanja</option>
                                <option value="Pembiayaan">Pembiayaan</option>
                            </select>
                            {errors.kategori && <p className="text-sm text-red-500 mt-1">{errors.kategori.message}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700">Sub Kategori / Rincian Bidang</label>
                            <div className="relative group inline-block ml-2 cursor-help">
                                <HelpCircle className="w-4 h-4 text-slate-400" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none">
                                    Format Detail (mirip Ngembal Kulon). Contoh untuk Pendapatan: "Bagi Hasil Pajak", "Alokasi Dana Desa". Contoh untuk Belanja: "Bidang Penyelenggaran Pemerintahan", "Bidang Pembangunan".
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
                                </div>
                            </div>
                        </div>
                        <input
                            {...register("nama_bidang")}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Contoh (Pendapatan): Alokasi Dana Desa | Contoh (Belanja): Bidang Pembangunan"
                        />
                        {errors.nama_bidang && <p className="text-sm text-red-500 mt-1">{errors.nama_bidang.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Target Anggaran (Rp)</label>
                            <input
                                type="number"
                                {...register("anggaran")}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                                placeholder="0"
                            />
                            {errors.anggaran && <p className="text-sm text-red-500 mt-1">{errors.anggaran.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Realisasi (Rp)</label>
                            <input
                                type="number"
                                {...register("realisasi")}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                                placeholder="0"
                            />
                            {errors.realisasi && <p className="text-sm text-red-500 mt-1">{errors.realisasi.message}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
