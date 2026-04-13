"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Save, ArrowLeft, Loader2, Users, FileText, X, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";
import { MutasiSchema, MutasiData } from "@/lib/validations/mutasi";
import { cn } from "@/lib/utils";
import { MutasiPenduduk } from "@/types";

export default function MutasiFormPage({ isEdit = false, params }: { isEdit?: boolean, params?: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [currentRecord, setCurrentRecord] = useState<MutasiPenduduk | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MutasiData>({
        resolver: zodResolver(MutasiSchema) as any,
        defaultValues: {
            jenis_mutasi: "Lahir",
            tanggal_mutasi: new Date().toISOString().split('T')[0],
        }
    });

    const watchJenisMutasi = watch("jenis_mutasi");

    useEffect(() => {
        const fetchRecord = async () => {
            if (isEdit && params?.id) {
                try {
                    const record = await pb.collection("mutasi_penduduk").getOne<MutasiPenduduk>(params.id);
                    setCurrentRecord(record);
                    setValue("nik", record.nik || "");
                    setValue("nama_lengkap", record.nama_lengkap);
                    setValue("jenis_mutasi", record.jenis_mutasi);
                    setValue("tanggal_mutasi", record.tanggal_mutasi.split(' ')[0]);
                    setValue("keterangan", record.keterangan || "");
                    if (record.dokumen_bukti) {
                        setExistingFile(pb.files.getUrl(record, record.dokumen_bukti));
                    }
                } catch (error) {
                    console.error("Error fetching record:", error);
                    alert("Data tidak ditemukan.");
                    router.push("/panel/dashboard/mutasi");
                } finally {
                    setPageLoading(false);
                }
            }
        };

        fetchRecord();
    }, [isEdit, params?.id, setValue, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const onSubmit = async (data: MutasiData) => {
        setIsLoading(true);
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append("nama_lengkap", data.nama_lengkap);
                formData.append("jenis_mutasi", data.jenis_mutasi);
                formData.append("tanggal_mutasi", new Date(data.tanggal_mutasi).toISOString());
                if (data.nik && data.nik.trim()) formData.append("nik", data.nik.trim());
                if (data.keterangan && data.keterangan.trim()) formData.append("keterangan", data.keterangan.trim());
                formData.append("dokumen_bukti", selectedFile);

                if (isEdit && params?.id) {
                    await pb.collection("mutasi_penduduk").update(params.id, formData);
                } else {
                    await pb.collection("mutasi_penduduk").create(formData);
                }
            } else {
                const payload: Record<string, any> = {
                    nama_lengkap: data.nama_lengkap,
                    jenis_mutasi: data.jenis_mutasi,
                    tanggal_mutasi: new Date(data.tanggal_mutasi).toISOString(),
                };
                if (data.nik && data.nik.trim()) payload.nik = data.nik.trim();
                if (data.keterangan && data.keterangan.trim()) payload.keterangan = data.keterangan.trim();

                if (isEdit && params?.id) {
                    await pb.collection("mutasi_penduduk").update(params.id, payload);
                } else {
                    await pb.collection("mutasi_penduduk").create(payload);
                }
            }
            router.push("/panel/dashboard/mutasi");
        } catch (error: any) {
            console.error("Error saving mutasi:", JSON.stringify(error?.response));
            const detail = error?.response?.data
                ? Object.entries(error.response.data).map(([k, v]: any) => `${k}: ${v?.message}`).join(', ')
                : error.message;
            alert(`Gagal menyimpan data: ${detail}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getDokumenSubtext = () => {
        switch (watchJenisMutasi) {
            case "Lahir": return "Surat Keterangan Lahir / Buku KIA";
            case "Mati": return "Surat Kematian / Pengantar RT";
            case "Datang": return "KTP Daerah Asal / Surat Pindah";
            case "Pergi": return "Surat Keterangan Pindah WNI (SKPWNI)";
            default: return "Dokumen Pendukung Lainnya";
        }
    };

    if (pageLoading) {
        return (
            <div className="p-8 flex justify-center items-center gap-2 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Memuat formulir...</span>
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
                            href="/panel/dashboard/mutasi"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Perbarui Mutasi" : "Catat Mutasi Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {isEdit ? "Perbarui detail riwayat mutasi penduduk." : "Pencatatan warga lahir, mati, datang, atau pergi."}
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
                        {isEdit ? "Simpan Perubahan" : "Simpan Pencatatan"}
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Section: Jenis Mutasi */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Jenis Mutasi</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {["Lahir", "Mati", "Datang", "Pergi"].map((jns) => (
                                <label 
                                    key={jns} 
                                    className={cn(
                                        "cursor-pointer flex items-center justify-center py-3 border-2 rounded-xl text-sm font-bold transition-all",
                                        watchJenisMutasi === jns 
                                            ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                            : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/30"
                                    )}
                                >
                                    <input type="radio" value={jns} {...register("jenis_mutasi")} className="sr-only" />
                                    {jns}
                                </label>
                            ))}
                        </div>
                        {errors.jenis_mutasi && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight mt-2">{errors.jenis_mutasi.message}</p>}
                    </div>

                    {/* Section: Data Warga */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Data Warga</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Lengkap */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Nama Lengkap <span className="text-red-400">*</span>
                                </label>
                                <input
                                    {...register("nama_lengkap")}
                                    placeholder="Nama lengkap warga"
                                    className={cn(
                                        "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-wide",
                                        errors.nama_lengkap ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"
                                    )}
                                />
                                {errors.nama_lengkap && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.nama_lengkap.message}</p>}
                                {watchJenisMutasi === "Lahir" && <p className="text-[10px] text-slate-400">Untuk bayi: isi "BAYI NYONYA [NAMA IBU]"</p>}
                            </div>

                            {/* NIK */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    NIK (16 Digit) {watchJenisMutasi !== "Lahir" && <span className="text-red-400">*</span>}
                                </label>
                                <input
                                    {...register("nik")}
                                    placeholder="320..."
                                    maxLength={16}
                                    className={cn(
                                        "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all font-mono text-sm",
                                        errors.nik ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"
                                    )}
                                />
                                {errors.nik && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.nik.message}</p>}
                                {watchJenisMutasi === "Lahir" && <p className="text-[10px] text-slate-400">Kosongkan jika belum diterbitkan NIK.</p>}
                            </div>

                            {/* Tanggal Kejadian */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Tanggal Kejadian <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register("tanggal_mutasi")}
                                    className={cn(
                                        "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all text-sm",
                                        errors.tanggal_mutasi ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"
                                    )}
                                />
                                {errors.tanggal_mutasi && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.tanggal_mutasi.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Keterangan & Dokumen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Keterangan */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Keterangan</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detail Tambahan</label>
                                <textarea
                                    {...register("keterangan")}
                                    rows={4}
                                    placeholder="cth: Pindah ke RT 01 RW 02, Meninggal karena sakit, dll."
                                    className={cn(
                                        "w-full px-5 py-3 bg-slate-50/50 border rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all resize-none text-sm",
                                        errors.keterangan ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-emerald-500"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Dokumen Bukti */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dokumen Bukti</h3>
                            </div>

                            <div className="relative group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title="Pilih file dokumen"
                                />
                                
                                {selectedFile ? (
                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 relative z-20">
                                        <FileText className="w-5 h-5 shrink-0" />
                                        <span className="text-sm truncate flex-1 font-medium">{selectedFile.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={removeFile}
                                            className="p-1 hover:bg-emerald-200 rounded-md shrink-0 text-emerald-700 transition-colors z-30 relative"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-all pointer-events-none">
                                        <FileText className="w-10 h-10 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klik untuk Upload</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{getDokumenSubtext()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Existing file indicator */}
                            {isEdit && existingFile && !selectedFile && (
                                <div className="mt-3 text-sm flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                                    <span className="text-blue-700 flex items-center gap-2 text-xs font-bold">
                                        <FileText className="w-4 h-4" /> File tersimpan
                                    </span>
                                    <a href={existingFile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold text-[10px] uppercase tracking-widest">
                                        Lihat
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
