"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { SectionHeading } from "@/components/ui/section-heading";
import { Save, ArrowLeft, Loader2, Users, FileText, X } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
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
                    setValue("tanggal_mutasi", record.tanggal_mutasi.split(' ')[0]); // Convert Pocketbase date to input date
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
        // If they want to remove existing file, we might need an API call or marking it for removal, but keeping it simple for now
    };

    const onSubmit = async (data: MutasiData) => {
        setIsLoading(true);
        try {
            // Debug: check auth status
            console.log("Auth valid:", pb.authStore.isValid, "Token:", pb.authStore.token ? "present" : "missing");
            
            // Build payload — use FormData only when a file is attached
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
                // JSON payload (no file) — more reliable with PocketBase
                const payload: Record<string, any> = {
                    nama_lengkap: data.nama_lengkap,
                    jenis_mutasi: data.jenis_mutasi,
                    tanggal_mutasi: new Date(data.tanggal_mutasi).toISOString(),
                };
                if (data.nik && data.nik.trim()) payload.nik = data.nik.trim();
                if (data.keterangan && data.keterangan.trim()) payload.keterangan = data.keterangan.trim();

                console.log("Sending payload:", JSON.stringify(payload));

                if (isEdit && params?.id) {
                    await pb.collection("mutasi_penduduk").update(params.id, payload);
                } else {
                    await pb.collection("mutasi_penduduk").create(payload);
                }
            }
            router.push("/panel/dashboard/mutasi");
        } catch (error: any) {
            console.error("Error saving mutasi — full response:", JSON.stringify(error?.response));
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
        return <div className="p-8 text-center text-slate-500 flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Memuat form...</div>;
    }

    return (
        <main className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/panel/dashboard/mutasi">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                </Link>
                <SectionHeading 
                    title={isEdit ? "Edit Catatan Mutasi" : "Catat Mutasi Baru"} 
                    subtitle={isEdit ? "Perbarui detail riwayat mutasi penduduk." : "Tambahkan pencatatan warga lahir, mati, datang, atau pergi."} 
                />
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Grid Top */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 md:col-span-2">
                             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Mutasi <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {["Lahir", "Mati", "Datang", "Pergi"].map((jns) => (
                                            <label 
                                                key={jns} 
                                                className={cn(
                                                    "cursor-pointer flex items-center justify-center py-3 border-2 rounded-xl text-sm font-bold transition-all",
                                                    watchJenisMutasi === jns 
                                                        ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200"
                                                )}
                                            >
                                                <input type="radio" value={jns} {...register("jenis_mutasi")} className="sr-only" />
                                                {jns}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.jenis_mutasi && <p className="text-red-500 text-xs mt-1">{errors.jenis_mutasi.message}</p>}
                                </div>
                             </div>
                        </div>

                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("nama_lengkap")}
                                placeholder="Nama lengkap warga"
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nama_lengkap ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap.message}</p>}
                            {watchJenisMutasi === "Lahir" && <p className="text-slate-400 text-xs">Untuk bayi yang belum punya nama, isi dengan "BAYI NYONYA [NAMA IBU]"</p>}
                        </div>

                        {/* NIK */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Nomor Induk Kependudukan (NIK)
                                {watchJenisMutasi !== "Lahir" && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                {...register("nik")}
                                placeholder="16 digit NIK"
                                maxLength={16}
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nik ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nik && <p className="text-red-500 text-xs">{errors.nik.message}</p>}
                            {watchJenisMutasi === "Lahir" ? (
                                <p className="text-slate-400 text-xs">Kosongkan jika bayi baru lahir dan belum diterbitkan NIK.</p>
                            ) : (
                                <p className="text-slate-400 text-xs">Wajib diisi 16 digit sesuai identitas resmi.</p>
                            )}
                        </div>
                        
                        {/* Tanggal */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Tanggal Kejadian <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                {...register("tanggal_mutasi")}
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.tanggal_mutasi ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.tanggal_mutasi && <p className="text-red-500 text-xs">{errors.tanggal_mutasi.message}</p>}
                        </div>

                    </div>

                    <div className="border-t border-slate-100 pt-6"></div>

                    {/* Keterangan & Dokumen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Keterangan */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Keterangan Tambahan</label>
                            <textarea
                                {...register("keterangan")}
                                rows={4}
                                placeholder="Detail tambahan... cth: Pindah ke alamat RT 01 RW 02, Meninggal karena sakit, dll."
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none",
                                    errors.keterangan ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.keterangan && <p className="text-red-500 text-xs">{errors.keterangan.message}</p>}
                        </div>

                        {/* Dokumen Bukti */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Lampirkan Dokumen Bukti <span className="text-slate-400 font-normal">(Opsional)</span></label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 relative group min-h-[120px]">
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf"
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
                                        <p className="text-sm font-medium text-slate-600">Klik / Tarik File Bukti</p>
                                        <p className="text-xs text-emerald-600/70 mt-1 font-medium bg-emerald-50 px-2 py-1 rounded inline-block">
                                            Opsional: Image/PDF maks 5MB ({getDokumenSubtext()})
                                        </p>
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
                                        Lihat File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <Link href="/panel/dashboard/mutasi">
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
