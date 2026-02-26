"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { SectionHeading } from "@/components/ui/section-heading";
import { Save, ArrowLeft, Loader2, FileText, X } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import Link from "next/link";
import { SuratKeluarSchema, SuratKeluarData } from "@/lib/validations/surat";
import { cn } from "@/lib/utils";
import { SuratKeluar } from "@/types";

export default function SuratFormPage({ isEdit = false, params }: { isEdit?: boolean, params?: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [currentRecord, setCurrentRecord] = useState<SuratKeluar | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SuratKeluarData>({
        resolver: zodResolver(SuratKeluarSchema) as any,
        defaultValues: {
            jenis_surat: "Pengantar",
            tanggal_dibuat: new Date().toISOString().split('T')[0],
        }
    });

    const watchJenisSurat = watch("jenis_surat");

    useEffect(() => {
        const fetchRecord = async () => {
            if (isEdit && params?.id) {
                try {
                    const record = await pb.collection("surat_keluar").getOne<SuratKeluar>(params.id);
                    setCurrentRecord(record);
                    setValue("nomor_agenda", record.nomor_agenda);
                    setValue("nik_pemohon", record.nik_pemohon);
                    setValue("nama_pemohon", record.nama_pemohon);
                    setValue("jenis_surat", record.jenis_surat);
                    setValue("tanggal_dibuat", record.tanggal_dibuat.split(' ')[0]);
                    
                    // The backend does not have keterangan in the JSON schema, but we added it to our zod. Lets ignore if it errors, or let the request pass.
                    
                    if (record.file_pdf) {
                        setExistingFile(pb.files.getUrl(record, record.file_pdf));
                    }
                } catch (error) {
                    console.error("Error fetching record:", error);
                    alert("Data tidak ditemukan.");
                    router.push("/panel/dashboard/surat");
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
            
            if (selectedFile) {
                formData.append("file_pdf", selectedFile);
            }

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
        <main className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/panel/dashboard/surat">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                </Link>
                <SectionHeading 
                    title={isEdit ? "Edit Register Surat" : "Register Surat Baru"} 
                    subtitle={isEdit ? "Perbarui detail registrasi surat keluar." : "Catat permohonan surat baru ke dalam buku agenda desa."} 
                />
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Grid Top */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 md:col-span-2">
                             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Klasifikasi Surat <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                                        {["Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Lainnya"].map((jns) => (
                                            <label 
                                                key={jns} 
                                                className={cn(
                                                    "cursor-pointer flex items-center justify-center py-2 px-1 border-2 rounded-xl text-xs font-bold transition-all text-center",
                                                    watchJenisSurat === jns 
                                                        ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200"
                                                )}
                                            >
                                                <input type="radio" value={jns} {...register("jenis_surat")} className="sr-only" />
                                                {jns}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.jenis_surat && <p className="text-red-500 text-xs mt-1">{errors.jenis_surat.message}</p>}
                                </div>
                             </div>
                        </div>

                        {/* Nomor Agenda */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Nomor Agenda / Registrasi Surat <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("nomor_agenda")}
                                placeholder="cth: 472.11/045/436.9.15/2026"
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono text-sm",
                                    errors.nomor_agenda ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nomor_agenda && <p className="text-red-500 text-xs">{errors.nomor_agenda.message}</p>}
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Tanggal Pembuatan <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                {...register("tanggal_dibuat")}
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.tanggal_dibuat ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.tanggal_dibuat && <p className="text-red-500 text-xs">{errors.tanggal_dibuat.message}</p>}
                        </div>


                        {/* NIK */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                NIK Pemohon <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("nik_pemohon")}
                                placeholder="16 digit NIK"
                                maxLength={16}
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nik_pemohon ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nik_pemohon && <p className="text-red-500 text-xs">{errors.nik_pemohon.message}</p>}
                            <p className="text-slate-400 text-xs">Pastikan 16 digit sesuai identitas.</p>
                        </div>

                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Nama Pemohon <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("nama_pemohon")}
                                placeholder="Nama lengkap warga"
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nama_pemohon ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nama_pemohon && <p className="text-red-500 text-xs">{errors.nama_pemohon.message}</p>}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6"></div>

                    {/* Arsip Dokumen */}
                    <div className="grid grid-cols-1 gap-6">

                        {/* Dokumen Arsip */}
                        <div className="space-y-2 md:w-1/2">
                            <label className="text-sm font-bold text-slate-700">Lampirkan Arsip Digital <span className="text-slate-400 font-normal">(Opsional)</span></label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 relative group min-h-[120px]">
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title="Pilih file dokumen"
                                />
                                
                                {selectedFile ? (
                                    <div className="flex flex-col items-center relative z-20 w-full">
                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 w-full max-w-[250px]">
                                            <FileText className="w-5 h-5 shrink-0" />
                                            <span className="text-xs truncate flex-1 font-medium">{selectedFile.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={removeFile}
                                                className="p-1 hover:bg-emerald-200 rounded-md shrink-0 text-emerald-700 transition-colors z-30 relative"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center pointer-events-none">
                                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                                        <p className="text-sm font-medium text-slate-600">Klik / Tarik File Surat Jadi</p>
                                        <p className="text-xs text-slate-400 mt-1">Hanya File Ext .PDF (Maks 5MB)</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Tampilkan file yang sudah ada jika mode edit */}
                            {isEdit && existingFile && !selectedFile && (
                                <div className="mt-2 text-sm flex items-center justify-between bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                                    <span className="text-blue-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> File tersimpan saat ini
                                    </span>
                                    <a href={existingFile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium text-xs">
                                        Unduh File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <Link href="/panel/dashboard/surat">
                            <TactileButton variant="secondary" type="button" disabled={isLoading}>
                                Batal
                            </TactileButton>
                        </Link>
                        <TactileButton variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Pencatatan
                                </>
                            )}
                        </TactileButton>
                    </div>
                </form>
            </div>
        </main>
    );
}
