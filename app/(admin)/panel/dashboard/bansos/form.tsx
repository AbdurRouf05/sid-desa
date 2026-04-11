"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Save, ArrowLeft, Loader2, Users, FileText, Calendar, Plus, X, Settings, Trash2, ShieldCheck } from "lucide-react";
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

    const getJenisBadgeColor = (jenis: string) => {
        if (!jenis) return "bg-slate-50 text-slate-400 border-slate-100";
        const colors = [
            "bg-blue-50 text-blue-600 border-blue-100",
            "bg-emerald-50 text-emerald-600 border-emerald-100",
            "bg-amber-50 text-amber-600 border-amber-100",
            "bg-rose-50 text-rose-600 border-rose-100",
            "bg-indigo-50 text-indigo-600 border-indigo-100"
        ];
        // Hash string to pick a color
        let hash = 0;
        for (let i = 0; i < jenis.length; i++) hash = jenis.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

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
            
            // Always set loading to false after attempting to fetch
            setPageLoading(false);
        };

        fetchAll();
    }, [isEdit, recordId, setValue, router]);

    const handleAddCategory = async (nama: string) => {
        setCatLoading(true);
        try {
            const res = await pb.collection("kategori_bantuan").create({ nama });
            await fetchCategories();
            // Automatically select the newly created category
            setValue("jenis_bantuan", res.id);
        } catch (error: any) {
            console.error("Gagal menambah kategori:", error);
            alert(`Gagal menambah kategori: ${error.message}`);
        } finally {
            setCatLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Hapus kategori ini? Data penerima yang menggunakan kategori ini mungkin akan terganggu.")) return;
        setCatLoading(true);
        try {
            await pb.collection("kategori_bantuan").delete(id);
            await fetchCategories();
            if (watch("jenis_bantuan") === id) {
                setValue("jenis_bantuan", "");
            }
        } catch (error) {
            alert("Gagal menghapus kategori.");
        } finally {
            setCatLoading(false);
        }
    };

    const onSubmit = async (data: BansosData) => {
        setIsLoading(true);
        try {
            if (isEdit && params?.id) {
                await pb.collection("penerima_bansos").update(params.id, data);
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
        return <div className="p-8 text-center text-slate-500 flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Memuat form...</div>;
    }

    return (
        <main className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/panel/dashboard/bansos">
                        <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all active:scale-95 group">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
                            {isEdit ? "Edit Penerima Bansos" : "Registrasi Penerima Bansos"}
                        </h1>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {isEdit ? "Perbarui detail warga penerima manfaat" : "Pencatatan data warga penerima bantuan sosial"}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Section */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1: Data Diri */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Identitas Penerima</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NIK Warga <span className="text-rose-500">*</span></label>
                                    <input
                                        {...register("nik")}
                                        placeholder="16 Digit NIK Sesuai KTP"
                                        maxLength={16}
                                        className={cn(
                                            "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold tracking-tight font-mono",
                                            errors.nik ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                                        )}
                                    />
                                    {errors.nik && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nik.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                                    <input
                                        {...register("nama")}
                                        placeholder="Nama Lengkap Sesuai KTP"
                                        className={cn(
                                            "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold tracking-tight",
                                            errors.nama ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                                        )}
                                    />
                                    {errors.nama && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nama.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detail Bantuan */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Detail Bantuan</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jenis Bantuan <span className="text-rose-500">*</span></label>
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
                                                placeholder="Pilih atau ketik kategori baru..."
                                                className={errors.jenis_bantuan ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500"}
                                            />
                                        )}
                                    />
                                    {errors.jenis_bantuan && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.jenis_bantuan.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tahun Penerimaan <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            {...register("tahun_penerimaan")}
                                            className={cn(
                                                "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold",
                                                errors.tahun_penerimaan ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500"
                                            )}
                                        />
                                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    </div>
                                    {errors.tahun_penerimaan && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.tahun_penerimaan.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Simpan Data
                                    </>
                                )}
                            </button>
                            <Link href="/panel/dashboard/bansos" className="w-full">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-2.5 rounded-xl transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                                >
                                    Batal / Kembali
                                </button>
                            </Link>
                        </div>
                        
                        <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full transition-transform group-hover:scale-125" />
                            <div className="relative z-10 space-y-4">
                                <div className="p-2 bg-white/20 w-fit rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-wider">Verifikasi Data</h3>
                                <p className="text-[10px] text-blue-100 leading-relaxed font-bold uppercase tracking-tight">
                                    Pastikan NIK dan Nama telah sesuai dengan data kependudukan untuk menghindari duplikasi bantuan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </main>
    );
}

