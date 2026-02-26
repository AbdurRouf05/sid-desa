"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { PengaduanSchema, PengaduanData } from "@/lib/validations/pengaduan";
import { cn } from "@/lib/utils";

export default function PengaduanPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PengaduanData>({
        resolver: zodResolver(PengaduanSchema) as any,
        defaultValues: {
            nama_pelapor: "",
            tempat_tinggal: "",
            isi_laporan: "",
            status: "Baru"
        }
    });

    const onSubmit = async (data: PengaduanData) => {
        setIsSubmitting(true);
        setErrorMsg("");
        
        try {
            // Karena akses publik mungkin tidak ada auth,
            // pastikan collection 'pengaduan_warga' create rule-nya diset ke "" (public)
            await pb.collection("pengaduan_warga").create(data);
            setIsSuccess(true);
            reset();
            
            // Auto hide success message
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);
            
        } catch (error: any) {
            console.error("Gagal mengirim pengaduan", error);
            setErrorMsg(error?.message || "Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi nanti.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <ModernNavbar />

            {/* Hero Section */}
            <div className="bg-desa-primary text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <SuspenseFallback>
                         <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Layanan Pengaduan Warga</h1>
                    </SuspenseFallback>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg leading-relaxed">
                        Sampaikan laporan, keluhan, atau aspirasi Anda secara langsung dan rahasia demi kemajuan Desa Sumberanyar.
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20 w-full">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Formulir Pengaduan</h2>
                        <p className="text-slate-500">Silakan isi detail laporan Anda dengan jelas dan dapat dipertanggungjawabkan.</p>
                    </div>

                    {isSuccess && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-emerald-800">Pengaduan Berhasil Terkirim!</h3>
                                <p className="text-emerald-700 text-sm mt-1">Terima kasih atas partisipasi Anda. Laporan Anda telah masuk ke sistem dan akan segera ditindaklanjuti oleh perangkat desa.</p>
                            </div>
                        </div>
                    )}
                    
                    {errorMsg && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-red-800">Gagal Mengirim Pengaduan</h3>
                                <p className="text-red-700 text-sm mt-1">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Nama Lengkap
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                {...register("nama_pelapor")}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nama_pelapor 
                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                                        : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                                placeholder="Masukkan nama lengkap Anda"
                            />
                            {errors.nama_pelapor && (
                                <p className="text-sm text-red-500 mt-1">{errors.nama_pelapor.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Tempat Tinggal / Alamat Lengkap
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                {...register("tempat_tinggal")}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.tempat_tinggal 
                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                                        : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                                placeholder="Contoh: RT 01 / RW 02, Dusun Krajan"
                            />
                            {errors.tempat_tinggal && (
                                <p className="text-sm text-red-500 mt-1">{errors.tempat_tinggal.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Isi Laporan / Pengaduan
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                {...register("isi_laporan")}
                                rows={6}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none",
                                    errors.isi_laporan 
                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                                        : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                                placeholder="Tuliskan secara detail apa yang ingin Anda sampaikan..."
                            />
                            {errors.isi_laporan && (
                                <p className="text-sm text-red-500 mt-1">{errors.isi_laporan.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Mengirim Laporan...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Kirim Pengaduan Sekarang
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4">
                                Data yang Anda sampaikan dijamin kerahasiaannya sesuai ketentuan undang-undang perlindungan saksi.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <ModernFooter />
        </main>
    );
}

function SuspenseFallback({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
