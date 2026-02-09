"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShieldCheck } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-5 pointer-events-none"></div>

            <div className="text-center space-y-8 relative z-10 px-4">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50">
                    <ShieldCheck className="w-12 h-12 text-red-600" />
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-display">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-slate-500 text-lg max-w-md mx-auto">
                        Halaman yang Anda cari di area Admin Panel tidak tersedia atau Anda tidak memiliki akses.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/panel/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/10"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>

                <div className="mt-12 text-xs text-slate-400 font-mono">
                    ERROR_CODE: 404_ADMIN_NOT_FOUND
                </div>
            </div>
        </div>
    );
}
