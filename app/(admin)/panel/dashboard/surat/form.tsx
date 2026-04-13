"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Save, ArrowLeft, Loader2, FileText, X, Users, Search, PieChart, Info, ShieldCheck, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { SuratKeluarSchema, SuratKeluarData } from "@/lib/validations/surat";
import { cn } from "@/lib/utils";
import { SuratKeluar } from "@/types";

export default function SuratFormPage({ isEdit = false, recordId }: { isEdit?: boolean, recordId?: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [currentRecord, setCurrentRecord] = useState<SuratKeluar | null>(null);

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
            setPageLoading(false);
        };

        fetchRecord();
    }, [isEdit, recordId, setValue, router]);

    const onSubmit = async (data: SuratKeluarData) => {
        setIsLoading(true);
        try {
            // Check if recordId is valid for update
            if (isEdit && recordId) {
                await pb.collection("surat_keluar").update(recordId, {
                    ...data,
                    tanggal_dibuat: new Date(data.tanggal_dibuat).toISOString()
                });
            } else {
                await pb.collection("surat_keluar").create({
                    ...data,
                    tanggal_dibuat: new Date(data.tanggal_dibuat).toISOString()
                });
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
                {/* Clean Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/surat"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Agenda Surat" : "Register Surat Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Pencatatan nomor registrasi surat keluar ke buku agenda desa.
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
                        Simpan Agenda
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section 1: Identitas Pemohon */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas Pemohon</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIK Pemohon</label>
                                    <input
                                        {...register("nik_pemohon")}
                                        placeholder="16 Digit NIK"
                                        maxLength={16}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold"
                                    />
                                    {errors.nik_pemohon && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nik_pemohon.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap</label>
                                    <input
                                        {...register("nama_pemohon")}
                                        placeholder="Nama Sesuai KTP"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-wide"
                                    />
                                    {errors.nama_pemohon && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nama_pemohon.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detail Register */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Detail Register Agenda</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nomor Agenda</label>
                                    <input
                                        {...register("nomor_agenda")}
                                        placeholder="cth: 472.11/045/..."
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm font-black uppercase tracking-tight"
                                    />
                                    {errors.nomor_agenda && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nomor_agenda.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal Pembuatan</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            {...register("tanggal_dibuat")}
                                            className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold"
                                        />
                                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    </div>
                                    {errors.tanggal_dibuat && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.tanggal_dibuat.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Classification Card */}
                        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl shadow-emerald-950/20 space-y-6 relative overflow-hidden group border border-white/5">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full transition-transform group-hover:scale-110" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 text-white rounded-xl">
                                        <PieChart className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Klasifikasi Surat</h3>
                                </div>
                                
                                <div className="space-y-2">
                                    <select 
                                        {...register("jenis_surat")}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl appearance-none focus:outline-none focus:bg-white focus:text-slate-900 transition-all text-sm font-black shadow-inner outline-none"
                                    >
                                        {["Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Surat Kuasa", "Keterangan Berkelakuan Baik", "Keterangan Penghasilan Orang Tua", "Lainnya"].map((jns) => (
                                            <option key={jns} value={jns} className="text-slate-900">{jns}</option>
                                        ))}
                                    </select>
                                    {errors.jenis_surat && <p className="text-rose-300 text-[10px] font-bold uppercase">{errors.jenis_surat.message}</p>}
                                </div>
                                
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                    Pastikan klasifikasi surat sesuai dengan isi dokumen yang diregistrasikan.
                                </p>
                            </div>
                        </div>

                        {/* Hint Card */}
                        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125" />
                            <div className="relative z-10 space-y-4">
                                <div className="p-2 bg-white/20 w-fit rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Verifikasi Agenda</h3>
                                <p className="text-[10px] text-emerald-100 leading-relaxed font-bold uppercase tracking-tight">
                                    Nomor agenda harus berurutan sesuai buku pendaftaran surat di kantor desa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
