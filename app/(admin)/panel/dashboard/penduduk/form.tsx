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
                if (value !== undefined) formData.append(key, value);
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
        <main className="max-w-5xl mx-auto pb-20 p-4 md:p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-4 md:-mx-8 px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/penduduk"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Data Penduduk" : "Tambah Penduduk Baru"}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-500 hidden md:block">
                                Isikan informasi kependudukan warga secara lengkap dan benar.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="hidden md:inline">{isEdit ? "Simpan Perubahan" : "Simpan Data"}</span>
                        <span className="md:hidden">{isEdit ? "Simpan" : "Tambah"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section: Identitas Utama */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-2">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Identitas Utama</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">NIK (Nomor Induk Kependudukan)</label>
                                    <input
                                        {...register("nik")}
                                        maxLength={16}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                                        placeholder="16 Digit NIK"
                                    />
                                    {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">No. KK (Kartu Keluarga)</label>
                                    <input
                                        {...register("no_kk")}
                                        maxLength={16}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                                        placeholder="16 Digit No. KK"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap (Sesuai KTP)</label>
                                    <input
                                        {...register("nama_lengkap")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all uppercase"
                                        placeholder="CONTOH: BUDI SANTOSO"
                                    />
                                    {errors.nama_lengkap && <p className="text-xs text-red-500 mt-1">{errors.nama_lengkap.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Kelahiran & Gender */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-2">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Kelahiran & Gender</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tempat Lahir</label>
                                    <input
                                        {...register("tempat_lahir")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        placeholder="Kota/Kab"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        {...register("tanggal_lahir")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Kelamin</label>
                                    <select
                                        {...register("jenis_kelamin")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Domisili */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Alamat & Domisili</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Dusun/Jalan</label>
                                    <textarea
                                        {...register("alamat")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none h-20"
                                        placeholder="Contoh: Dusun Krajan"
                                    />
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">RT</label>
                                        <input
                                            {...register("rt")}
                                            placeholder="000"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">RW</label>
                                        <input
                                            {...register("rw")}
                                            placeholder="000"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Additional Details */}
                    <div className="space-y-6">
                        {/* Section: Status Sosial */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Status & Pekerjaan</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Agama</label>
                                <select
                                    {...register("agama")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Budha">Budha</option>
                                    <option value="Khonghucu">Khonghucu</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Status Perkawinan</label>
                                <select
                                    {...register("status_kawin")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="Belum Kawin">Belum Kawin</option>
                                    <option value="Kawin">Kawin</option>
                                    <option value="Cerai Hidup">Cerai Hidup</option>
                                    <option value="Cerai Mati">Cerai Mati</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Pekerjaan</label>
                                <input
                                    {...register("pekerjaan")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="Contoh: Petani"
                                />
                            </div>
                        </div>

                        {/* Section: Pendidikan */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <GraduationCap className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Pendidikan</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Pendidikan Terakhir</label>
                                <select
                                    {...register("pendidikan")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
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
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Foto KTP / Identitas</h3>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group overflow-hidden">
                                {previewUrl ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-2">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                            Ganti Gambar
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-slate-400">
                                        <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Klik untuk upload foto KTP</p>
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
