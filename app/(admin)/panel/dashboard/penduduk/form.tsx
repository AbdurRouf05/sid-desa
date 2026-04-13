"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, User, MapPin, Calendar, Briefcase, GraduationCap, CreditCard, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAssetUrl } from "@/lib/cdn";

const pendudukSchema = z.object({
    nik: z.string().length(16, "NIK harus 16 digit"),
    nama_lengkap: z.string().min(1, "Nama lengkap tidak boleh kosong"),
    tempat_lahir: z.string().optional(),
    tanggal_lahir: z.string().optional(),
    jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]).optional(),
    alamat: z.string().optional(),
    rt: z.string().max(3).optional(),
    rw: z.string().max(3).optional(),
    agama: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Khonghucu"]).optional(),
    status_kawin: z.enum(["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"]).optional(),
    pekerjaan: z.string().optional(),
    pendidikan: z.enum(["Tidak/Belum Sekolah", "SD", "SMP", "SMA", "D1", "D2", "D3", "S1", "S2", "S3"]).optional(),
    no_kk: z.string().optional(),
});

type PendudukInputs = z.infer<typeof pendudukSchema>;

export default function PendudukEditorPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = isEdit ? useParams() : null;
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<PendudukInputs>({
        resolver: zodResolver(pendudukSchema),
        defaultValues: {
            nik: "",
            nama_lengkap: "",
            jenis_kelamin: "Laki-laki",
            agama: "Islam",
            status_kawin: "Belum Kawin",
            pendidikan: "SMA",
            rt: "000",
            rw: "000"
        }
    });

    // Fetch data if edit
    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchPenduduk = async () => {
                try {
                    const record = await pb.collection('data_penduduk').getOne(params.id as string);
                    setValue("nik", record.nik);
                    setValue("nama_lengkap", record.nama_lengkap);
                    setValue("tempat_lahir", record.tempat_lahir);
                    if (record.tanggal_lahir) {
                        setValue("tanggal_lahir", new Date(record.tanggal_lahir).toISOString().split('T')[0]);
                    }
                    setValue("jenis_kelamin", record.jenis_kelamin);
                    setValue("alamat", record.alamat);
                    setValue("rt", record.rt);
                    setValue("rw", record.rw);
                    setValue("agama", record.agama || "Islam");
                    setValue("status_kawin", record.status_kawin || "Belum Kawin");
                    setValue("pekerjaan", record.pekerjaan);
                    setValue("pendidikan", record.pendidikan || "SMA");
                    setValue("no_kk", record.no_kk);

                    if (record.foto_ktp) {
                        setPreviewUrl(getAssetUrl(record, record.foto_ktp));
                    }
                } catch (e) {
                    console.error("Failed to load resident", e);
                    alert("Gagal memuat data penduduk");
                    router.push("/panel/dashboard/penduduk");
                }
            };
            fetchPenduduk();
        }
    }, [isEdit, params, setValue, router]);

    const onSubmit = async (data: PendudukInputs) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== "") formData.append(key, value);
            });

            // Handle File Upload
            const fileInput = (document.getElementById("ktp_input") as HTMLInputElement)?.files?.[0];
            if (fileInput) {
                formData.append("foto_ktp", fileInput);
            }

            if (isEdit && params?.id) {
                await pb.collection('data_penduduk').update(params.id as string, formData);
            } else {
                await pb.collection('data_penduduk').create(formData);
            }

            router.push("/panel/dashboard/penduduk");
            router.refresh();
        } catch (e) {
            console.error("Save failed", e);
            alert("Gagal menyimpan data penduduk. Cek validasi NIK (16 digit).");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <main className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Clean Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/penduduk"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Perbarui Warga" : "Tambah Warga Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Pastikan data kependudukan valid sesuai dengan dokumen resmi.
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
                        {isEdit ? "Simpan Perubahan" : "Simpan Data Warga"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Area - 8 Cols */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section: Identitas Utama */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identitas Utama</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIK (16 Digit)</label>
                                    <input
                                        {...register("nik")}
                                        maxLength={16}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                        placeholder="320..."
                                    />
                                    {errors.nik && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.nik.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. Kartu Keluarga</label>
                                    <input
                                        {...register("no_kk")}
                                        maxLength={16}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                        placeholder="320..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap (Sesuai KTP)</label>
                                    <input
                                        {...register("nama_lengkap")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all uppercase text-sm font-bold tracking-wide"
                                        placeholder="CONTOH: BUDI SANTOSO"
                                    />
                                    {errors.nama_lengkap && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.nama_lengkap.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Kelahiran & Gender */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Kelahiran & Gender</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tempat Lahir</label>
                                    <input
                                        {...register("tempat_lahir")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="Kota/Kab"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        {...register("tanggal_lahir")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis Kelamin</label>
                                    <select
                                        {...register("jenis_kelamin")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm appearance-none"
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Alamat */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Alamat & Domisili</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alamat Dusun/Jalan</label>
                                    <input
                                        {...register("alamat")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="Contoh: Dusun Krajan"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RT</label>
                                    <input
                                        {...register("rt")}
                                        placeholder="000"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm text-center font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RW</label>
                                    <input
                                        {...register("rw")}
                                        placeholder="000"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm text-center font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area - 4 Cols */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Section: Status & Pekerjaan */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Status Pekerjaan</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Agama</label>
                                    <select
                                        {...register("agama")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-sm appearance-none"
                                    >
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Budha">Budha</option>
                                        <option value="Khonghucu">Khonghucu</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Perkawinan</label>
                                    <select
                                        {...register("status_kawin")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-sm appearance-none"
                                    >
                                        <option value="Belum Kawin">Belum Kawin</option>
                                        <option value="Kawin">Kawin</option>
                                        <option value="Cerai Hidup">Cerai Hidup</option>
                                        <option value="Cerai Mati">Cerai Mati</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pekerjaan Utama</label>
                                    <input
                                        {...register("pekerjaan")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-sm"
                                        placeholder="Contoh: Petani"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Pendidikan */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Pendidikan</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pendidikan Terakhir</label>
                                <select
                                    {...register("pendidikan")}
                                    className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-sm appearance-none"
                                >
                                    <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                                    <option value="SD">SD</option>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                    <option value="D1">D1</option>
                                    <option value="D2">D2</option>
                                    <option value="D3">D3</option>
                                    <option value="S1">S1</option>
                                    <option value="S2">S2</option>
                                    <option value="S3">S3</option>
                                </select>
                            </div>
                        </div>

                        {/* Section: Foto KTP */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dokumen KTP</h3>
                            </div>

                            <div className="relative group cursor-pointer">
                                {previewUrl ? (
                                    <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        <img src={previewUrl} alt="Preview KTP" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                                            Ganti Foto
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-all">
                                        <User className="w-10 h-10 text-slate-300 mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload KTP</p>
                                    </div>
                                )}
                                <input
                                    id="ktp_input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
