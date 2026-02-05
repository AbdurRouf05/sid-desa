"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Pesan Terkirim!</h3>
                <p className="text-emerald-700 mb-6">
                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda via WhatsApp/Email.
                </p>
                <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => setIsSuccess(false)}
                >
                    Kirim Pesan Lain
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: Abdullah"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor WhatsApp</label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="0812..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (Opsional)</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="email@contoh.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pesan / Pertanyaan</label>
                <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Tuliskan pertanyaan Anda mengenai produk atau layanan BMT NU..."
                ></textarea>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim...
                    </>
                ) : (
                    <>
                        Kirim Pesan <Send className="w-4 h-4 ml-2" />
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-slate-400 mt-4">
                Data Anda aman dan hanya digunakan untuk keperluan komunikasi layanan.
            </p>
        </form>
    );
}
