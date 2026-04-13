"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Save, ArrowLeft, Loader2, Users, FileText, Calendar, Plus, X, Settings, Trash2, ShieldCheck, Activity, Info } from "lucide-react";
import { BansosSchema, BansosData } from "@/lib/validations/bansos";
import { cn } from "@/lib/utils";
import { PenerimaBansos } from "@/types";
import Link from "next/link";
import { CreatableSelect } from "@/components/ui/creatable-select";

export default function BansosFormPage({ isEdit = false, recordId }: { isEdit?: boolean, recordId?: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [categories, setCategories] = useState<any[]>([]);
    const [catLoading, setCatLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<BansosData>({
        resolver: zodResolver(BansosSchema),
        defaultValues: {
            jenis_bantuan: "",
            tahun_penerimaan: new Date().getFullYear(),
        }
    });

    const fetchCategories = async () => {
        try {
            const records = await pb.collection("kategori_bantuan").getFullList({
                sort: "nama",
            });
            setCategories(records);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            await fetchCategories();
            
            if (isEdit && recordId) {
                try {
                    const record = await pb.collection("penerima_bansos").getOne<PenerimaBansos>(recordId);
                    setValue("nik", record.nik);
                    setValue("nama", record.nama);
                    setValue("jenis_bantuan", record.jenis_bantuan);
                    setValue("tahun_penerimaan", record.tahun_penerimaan);
                } catch (error) {
                    console.error("Error fetching record:", error);
                    alert("Data tidak ditemukan.");
                    router.push("/panel/dashboard/bansos");
                }
            }
            setPageLoading(false);
        };

        fetchAll();
    }, [isEdit, recordId, setValue, router]);

    const handleAddCategory = async (nama: string) => {
        setCatLoading(true);
        try {
            const res = await pb.collection("kategori_bantuan").create({ nama });
            await fetchCategories();
            setValue("jenis_bantuan", res.id);
        } catch (error: any) {
            console.error("Gagal menambah kategori:", error);
            alert(`Gagal menambah kategori: ${error.message}`);
        } finally {
            setCatLoading(false);
        }
    };

    const onSubmit = async (data: BansosData) => {
        setIsLoading(true);
        try {
            if (isEdit && recordId) {
                await pb.collection("penerima_bansos").update(recordId, data);
            } else {
                await pb.collection("penerima_bansos").create(data);
            }
            router.push("/panel/dashboard/bansos");
        } catch (error: any) {
            console.error("Error saving data", error);
            alert(`Gagal menyimpan data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const optionsFromDB = useMemo(() => {
        return categories.map(c => ({ id: c.id, nama: c.nama }));
    }, [categories]);

    if (pageLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Memuat formulir...</p>
            </div>
        );
    }

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 {/* Integrated Header */}
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/bansos"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Penerima Bansos" : "Registrasi Bansos"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Pengelolaan data warga yang terdaftar sebagai penerima manfaat bantuan sosial.
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
                        Simpan Data
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section 1: Identitas Penerima */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas Penerima</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIK Warga</label>
                                    <input
                                        {...register("nik")}
                                        placeholder="16 Digit NIK"
                                        maxLength={16}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold"
                                    />
                                    {errors.nik && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nik.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap</label>
                                    <input
                                        {...register("nama")}
                                        placeholder="Nama Sesuai KTP"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-wide"
                                    />
                                    {errors.nama && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nama.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detail Bantuan */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Detail Klasifikasi Bantuan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis Bantuan</label>
                                    <Controller
                                        name="jenis_bantuan"
                                        control={control}
                                        render={({ field }) => (
                                            <CreatableSelect
                                                options={optionsFromDB}
                                                value={field.value}
                                                onChange={field.onChange}
                                                onCreate={handleAddCategory}
                                                isLoading={catLoading}
                                                placeholder="Pilih atau Ketik Baru..."
                                            />
                                        )}
                                    />
                                    {errors.jenis_bantuan && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.jenis_bantuan.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun Penerimaan</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            {...register("tahun_penerimaan")}
                                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold"
                                        />
                                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    </div>
                                    {errors.tahun_penerimaan && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.tahun_penerimaan.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Status Summary Card */}
                        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-xl shadow-emerald-600/10 space-y-6 relative overflow-hidden group border border-white/10">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full transition-transform group-hover:scale-110" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 text-white rounded-xl">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Verifikasi Penerima</h3>
                                    </div>
                                    
                                    <p className="text-[10px] text-emerald-100/70 font-bold uppercase tracking-tight leading-relaxed">
                                        Data penerima harus diverifikasi berkala agar bantuan tersalurkan secara tepat sasaran ke warga yang benar-benar membutuhkan.
                                    </p>

                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-[9px] text-emerald-100/80 font-bold uppercase tracking-widest">
                                        <span className="text-white">Peringatan:</span> Duplikasi NIK tidak diizinkan dalam sistem.
                                    </div>
                                </div>
                        </div>

                        {/* Hint Info Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Info Kategori</h3>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                Anda dapat menambahkan kategori bantuan baru secara langsung melalui kotak pilihan "Jenis Bantuan" jika belum terdaftar.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
