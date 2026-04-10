"use client";

import React from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArrowLeft, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PetaDesaPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-green-800 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/pelayanan" className="inline-flex items-center text-green-200 hover:text-white gap-1 mb-6 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Pelayanan
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Peta Wilayah Desa
                    </h1>
                    <p className="text-lg text-green-100 max-w-2xl font-light leading-relaxed">
                        Lihat peta interaktif wilayah Desa Sumberanyar beserta batas-batas dusun dan lokasi fasilitas umum.
                    </p>
                </div>
            </section>

            {/* Peta Iframe */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">Peta Interaktif</h2>
                                    <p className="text-sm text-slate-500">Desa Sumberanyar, Kec. Rowokangkung, Kab. Lumajang</p>
                                </div>
                            </div>
                            <a
                                href="https://www.google.com/maps/place/Sumberanyar,+Rowokangkung,+Lumajang+Regency,+East+Java"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium gap-1 transition-colors"
                            >
                                Buka di Google Maps <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                        <div className="aspect-[16/9] md:aspect-[21/9]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15813.123456789!2d113.25!3d-8.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1234567890%3A0x1234567890abcdef!2sSumberanyar%2C+Rowokangkung%2C+Lumajang!5e0!3m2!1sid!2sid!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Desa Sumberanyar"
                            />
                        </div>
                    </div>

                    {/* Link Dispenduk */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a
                            href="https://dispenduk.pasuruankab.go.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4 group"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                <ExternalLink className="w-7 h-7 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Dispenduk Capil Kab. Lumajang</h3>
                                <p className="text-sm text-slate-500">Dinas Kependudukan & Pencatatan Sipil</p>
                            </div>
                        </a>
                        <a
                            href="https://prodeskel.pmd.kemendagri.go.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4 group"
                        >
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                                <ExternalLink className="w-7 h-7 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Prodeskel Kemendagri</h3>
                                <p className="text-sm text-slate-500">Profil Desa & Kelurahan Nasional</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
