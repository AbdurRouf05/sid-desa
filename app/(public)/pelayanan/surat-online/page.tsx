"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { pb } from "@/lib/pb";
import { SuratOnlineSchema, SuratOnlineData } from "@/lib/validations/surat-online";
import { cn } from "@/lib/utils";
import {
    Send, ArrowLeft, Loader2, CheckCircle2, AlertCircle,
    FileText, MapPin, Phone, Info
} from "lucide-react";
import Link from "next/link";

const JENIS_SURAT_OPTIONS = [
    "Surat Pengantar",
    "SKTM",
    "Surat Domisili",
    "Keterangan Usaha",
    "Surat Kuasa",
    "Keterangan Berkelakuan Baik",
    "Keterangan Penghasilan Orang Tua",
    "Lainnya",
];

export default function SuratOnlinePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SuratOnlineData>({
        resolver: zodResolver(SuratOnlineSchema) as any,
    });

    const onSubmit = async (data: SuratOnlineData) => {
        setIsSubmitting(true);
        setErrorMsg("");
        try {
            await pb.collection("permohonan_surat_online").create({
                ...data,
                status: "Menunggu",
            });
            setIsSuccess(true);
            reset();
        } catch (error: any) {
            console.error("Submit error:", error);
            setErrorMsg(error?.message || "Gagal mengirim permohonan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/pelayanan" className="inline-flex items-center text-blue-200 hover:text-white gap-1 mb-6 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Pelayanan
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Permohonan Surat Online
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl font-light leading-relaxed">
                        Khusus untuk warga Desa Sumberanyar yang sedang berada di luar kota (rantau). Ajukan surat tanpa harus datang ke Balai Desa.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex gap-4 items-start">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 space-y-1">
                            <p className="font-bold">Catatan Penting:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>Layanan ini khusus untuk <strong>warga asli Desa Sumberanyar</strong> yang berdomisili di luar desa.</li>
                                <li>Pastikan NIK Anda terdaftar di data kependudukan desa.</li>
                                <li>Petugas desa akan menghubungi Anda melalui WhatsApp untuk konfirmasi.</li>
                                <li>Proses pembuatan surat membutuhkan waktu <strong>1-3 hari kerja</strong>.</li>
                            </ul>
                        </div>
                    </div>

                    {isSuccess ? (
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Permohonan Berhasil Dikirim!</h2>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                Terima kasih. Petugas akan meninjau permohonan Anda dan menghubungi melalui WhatsApp dalam 1-3 hari kerja.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                                >
                                    Ajukan Surat Lagi
                                </button>
                                <Link href="/pelayanan" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-700" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Formulir Permohonan</h2>
                                    <p className="text-sm text-slate-500">Isi lengkap semua kolom yang bertanda wajib (*)</p>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NIK */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">NIK (Sesuai KTP) <span className="text-red-500">*</span></label>
                                        <input
                                            {...register("nik")}
                                            placeholder="16 digit NIK"
                                            maxLength={16}
                                            className={cn(
                                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono text-sm",
                                                errors.nik ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                            )}
                                        />
                                        {errors.nik && <p className="text-red-500 text-xs">{errors.nik.message}</p>}
                                    </div>

                                    {/* Nama */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                                        <input
                                            {...register("nama")}
                                            placeholder="Sesuai KTP"
                                            className={cn(
                                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm",
                                                errors.nama ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                            )}
                                        />
                                        {errors.nama && <p className="text-red-500 text-xs">{errors.nama.message}</p>}
                                    </div>

                                    {/* Jenis Surat */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Jenis Surat yang Dibutuhkan <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                {...register("jenis_surat")}
                                                className={cn(
                                                    "w-full px-4 py-3 border rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 transition-all text-sm",
                                                    errors.jenis_surat ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                                )}
                                            >
                                                <option value="">Pilih Jenis Surat...</option>
                                                {JENIS_SURAT_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                        {errors.jenis_surat && <p className="text-red-500 text-xs">{errors.jenis_surat.message}</p>}
                                    </div>

                                    {/* Nomor WA */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> No. WhatsApp Aktif <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("no_wa")}
                                            placeholder="cth: 081234567890"
                                            maxLength={15}
                                            className={cn(
                                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono text-sm",
                                                errors.no_wa ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                            )}
                                        />
                                        {errors.no_wa && <p className="text-red-500 text-xs">{errors.no_wa.message}</p>}
                                    </div>
                                </div>

                                {/* Alamat Rantau */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Alamat Tempat Tinggal Saat Ini (Rantau) <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("alamat_rantau")}
                                        rows={3}
                                        placeholder="Masukkan alamat lengkap tempat tinggal Anda saat ini di perantauan..."
                                        className={cn(
                                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm resize-none",
                                            errors.alamat_rantau ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                                        )}
                                    />
                                    {errors.alamat_rantau && <p className="text-red-500 text-xs">{errors.alamat_rantau.message}</p>}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                                    <Link href="/pelayanan" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-center text-sm">
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Kirim Permohonan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
