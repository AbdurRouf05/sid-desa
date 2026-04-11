"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { SectionHeading } from "@/components/ui/section-heading";
import { Save, ArrowLeft, Loader2, FileText, X, Users, Search, PieChart } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import Link from "next/link";
import { SuratKeluarSchema, SuratKeluarData } from "@/lib/validations/surat";
import { cn } from "@/lib/utils";
import { SuratKeluar } from "@/types";

export default function SuratFormPage({ isEdit = false, recordId }: { isEdit?: boolean, recordId?: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    // Removed file states
    const [currentRecord, setCurrentRecord] = useState<SuratKeluar | null>(null);
    const [lastAgenda, setLastAgenda] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SuratKeluarData>({
        resolver: zodResolver(SuratKeluarSchema) as any,
        defaultValues: {
            jenis_surat: "Pengantar",
            tanggal_dibuat: new Date().toISOString().split('T')[0],
        }
    });

    useEffect(() => {
        const fetchRecord = async () => {
            if (isEdit && recordId) {
                try {
                    const record = await pb.collection("surat_keluar").getOne<SuratKeluar>(recordId);
                    setCurrentRecord(record);
                    setValue("nomor_agenda", record.nomor_agenda);
                    setValue("nik_pemohon", record.nik_pemohon);
                    setValue("nama_pemohon", record.nama_pemohon);
                    setValue("jenis_surat", record.jenis_surat);
                    setValue("tanggal_dibuat", record.tanggal_dibuat.split(' ')[0]);
                } catch (error) {
                    console.error("Error fetching record:", error);
                    alert("Data tidak ditemukan.");
                    router.push("/panel/dashboard/surat");
                }
            }
            // Always set loading to false after attempted fetch
            setPageLoading(false);
        };

        fetchRecord();
    }, [isEdit, recordId, setValue, router]);

    const onSubmit = async (data: SuratKeluarData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            
            formData.append("nomor_agenda", data.nomor_agenda);
            formData.append("nik_pemohon", data.nik_pemohon);
            formData.append("nama_pemohon", data.nama_pemohon);
            formData.append("jenis_surat", data.jenis_surat);
            formData.append("tanggal_dibuat", new Date(data.tanggal_dibuat).toISOString()); 
            
            if (data.keterangan) formData.append("keterangan", data.keterangan);
            if (isEdit && params?.id) {
                await pb.collection("surat_keluar").update(params.id, formData);
            } else {
                await pb.collection("surat_keluar").create(formData);
            }
            router.push("/panel/dashboard/surat");
        } catch (error: any) {
            console.error("Error saving surat", error);
            alert(`Gagal menyimpan data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="p-8 text-center text-slate-500 flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Memuat form...</div>;
    }

    return (
        <main className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/panel/dashboard/surat">
                        <button className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl shadow-sm transition-all active:scale-95 group">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
                            {isEdit ? "Edit Register Surat" : "Register Surat Baru"}
                        </h1>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {isEdit ? "Perbarui detail registrasi surat keluar" : "Pencatatan surat keluar ke buku agenda desa"}
                        </p>
                    </div>
                </div>
                
                {!isEdit && (
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm shadow-emerald-100/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sistem Siap Catat</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Info Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1: Identitas Pemohon */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Identitas Pemohon</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NIK Pemohon <span className="text-rose-500">*</span></label>
                                    <input
                                        {...register("nik_pemohon")}
                                        placeholder="16 Digit NIK Sesuai KTP"
                                        maxLength={16}
                                        className={cn(
                                            "w-full px-6 py-4 bg-slate-50/50 border rounded-[1.25rem] focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold tracking-tight",
                                            errors.nik_pemohon ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                                        )}
                                    />
                                    {errors.nik_pemohon && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nik_pemohon.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                                    <input
                                        {...register("nama_pemohon")}
                                        placeholder="Nama Lengkap Sesuai KTP"
                                        className={cn(
                                            "w-full px-6 py-4 bg-slate-50/50 border rounded-[1.25rem] focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold tracking-tight",
                                            errors.nama_pemohon ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                                        )}
                                    />
                                    {errors.nama_pemohon && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nama_pemohon.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detail Surat */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Detail Registrasi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Agenda <span className="text-rose-500">*</span></label>
                                    <input
                                        {...register("nomor_agenda")}
                                        placeholder="cth: 472.11/045/..."
                                        className={cn(
                                            "w-full px-6 py-4 bg-slate-50/50 border rounded-[1.25rem] focus:outline-none focus:ring-4 focus:bg-white transition-all font-mono text-sm font-black uppercase tracking-tight",
                                            errors.nomor_agenda ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500"
                                        )}
                                    />
                                    {errors.nomor_agenda && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.nomor_agenda.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tanggal Pembuatan <span className="text-rose-500">*</span></label>
                                    <input
                                        type="date"
                                        {...register("tanggal_dibuat")}
                                        className={cn(
                                            "w-full px-6 py-4 bg-slate-50/50 border rounded-[1.25rem] focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm font-bold",
                                            errors.tanggal_dibuat ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500"
                                        )}
                                    />
                                    {errors.tanggal_dibuat && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.tanggal_dibuat.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Classification Card */}
                        <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl shadow-slate-900/10 space-y-6 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full transition-transform group-hover:scale-110" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] block">Klasifikasi Surat</label>
                                </div>
                                
                                <div className="relative">
                                    <select 
                                        {...register("jenis_surat")}
                                        className={cn(
                                            "w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl appearance-none focus:outline-none focus:bg-white focus:text-slate-900 transition-all text-sm font-black shadow-inner",
                                            errors.jenis_surat ? "border-rose-400" : ""
                                        )}
                                    >
                                        <option value="" disabled className="text-slate-900">Pilih Jenis Surat...</option>
                                        {["Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Surat Kuasa", "Keterangan Berkelakuan Baik", "Keterangan Penghasilan Orang Tua", "Lainnya"].map((jns) => (
                                            <option key={jns} value={jns} className="text-slate-900">{jns}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                {errors.jenis_surat && <p className="text-rose-300 text-[10px] font-bold uppercase">{errors.jenis_surat.message}</p>}
                                
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                    Harap pastikan klasifikasi surat sesuai dengan isi dokumen yang diregistrasikan.
                                </p>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black py-5 rounded-[1.25rem] shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Simpan Agenda
                                    </>
                                )}
                            </button>
                            <Link href="/panel/dashboard/surat" className="w-full">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-black py-4 rounded-[1.25rem] transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                                >
                                    Batal / Kembali
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
