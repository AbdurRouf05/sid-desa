"use client";

import React, { useEffect, useState } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ShieldCheck, Calendar, Users, Building2, FileText, CheckCircle2 } from "lucide-react";
import { pb } from "@/lib/pb";
import { JsonLd } from "@/components/seo/json-ld";

export default function TentangKamiPage() {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const records = await pb.collection('profil_desa').getList(1, 1);
                if (records.items.length > 0) {
                    setConfig(records.items[0]);
                }
            } catch (e) {
                console.error("Error fetching site config", e);
            }
        };
        fetchConfig();
    }, []);

    // Defaults if loading / empty
    const assets = "10 M+";
    const members = config?.total_members || "3.500+";
    const branches = config?.total_branches || "5";
    const address = config?.address || "Jl. Raya Sumberanyar No. 1, Sumberanyar, Pasuruan";
    const phone = config?.phone_wa || "081234567890";
    const legalBH = config?.legal_bh || "PEMERINTAH DESA SUMBERANYAR";
    const nib = config?.nib || "1234567890";

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />
            <JsonLd
                type="AboutPage"
                data={{
                    name: "Tentang Kami - SID Sumberanyar",
                    description: "SID Sumberanyar adalah portal informasi dan layanan desa yang mandiri, transparan, dan akuntabel.",
                    mainEntity: {
                        "@type": "Organization",
                        name: "SID Sumberanyar",
                        foundingDate: "2020-08",
                        legalName: "Pemerintah Desa Sumberanyar",
                        logo: "https://sumberanyar.id/logo.png",
                        sameAs: [
                            "https://www.facebook.com/PemerintahDesaSumberanyar",
                            "https://www.instagram.com/pemerintahdesasumberanyar"
                        ]
                    }
                }}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-desa-primary to-desa-primary-dark text-white relative overflow-hidden">
                {/* Arabesque Pattern Overlay */}
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>

                {/* Decorative Bottom Arch */}
                <div className="absolute -bottom-16 left-0 right-0 h-16 bg-slate-50 rounded-t-[50%] scale-x-150"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight font-display">
                        Tentang Kami
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto font-light">
                        "Mudah, Murah, Berkah dengan cara Syariah"
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Identitas & Sejarah */}
                <section className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                            <Building2 className="w-4 h-4" />
                            <span>Pemerintahan Desa</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Pemerintah Desa Sumberanyar
                        </h2>

                        {/* History & Philosophy */}
                        <div className="prose prose-lg text-slate-600">
                            <p>
                                Desa Sumberanyar adalah desa yang berkomitmen untuk memberikan pelayanan terbaik bagi warga. Melalui inovasi Sistem Informasi Desa (SID), kami menghadirkan transparansi dan kemudahan akses informasi publik menuju tata kelola pemerintahan yang baik.
                            </p>
                            <p>
                                Dengan filosofi melayani sepenuhnya, kami terus berupaya meningkatkan kualitas infrastruktur, ekonomi, dan kesejahteraan masyarakat Desa Sumberanyar.
                            </p>
                        </div>

                        {/* Vision & Mission Box */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-emerald-800 mb-2">Visi Kami</h3>
                                <p className="text-sm text-emerald-900/80 italic">
                                    "Mewujudkan Desa Sumberanyar yang Mandiri, Sejahtera, dan Berbudaya berbasis Keunggulan Lokal."
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-emerald-800 mb-2">Misi Utama</h3>
                                <ul className="space-y-2 text-sm text-emerald-900/80">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>Meningkatkan kualitas pelayanan publik secara transparan.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>Pemberdayaan ekonomi masyarakat berbasis potensi desa.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>Meningkatkan kualitas infrastruktur desa.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>Melestarikan budaya dan nilai gotong royong warga.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            Informasi Legalitas
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Instansi</p>
                                    <p className="font-mono text-slate-700 font-medium break-all">
                                        {legalBH}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Kode Wilayah</p>

                                    <p className="text-slate-700 font-medium">{nib}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{assets}</h4>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Dana APBDes</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{members}</h4>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Warga Desa</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center text-center hover:-translate-y-1 transition-transform duration-300 sm:col-span-2">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="text-4xl font-bold text-slate-900 mb-1">{branches}</h4>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Wilayah Dusun</p>
                    </div>
                </div>


                {/* Location / Contact Snippet */}
                <section className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Lokasi Balai Desa</h3>
                        <p className="text-emerald-100 text-lg">
                            {address}
                        </p>
                    </div>
                    {/* Disclaimer: Button would go here, omitting for simplicity as per strict data reqs */}
                </section>

            </div >
        </main >
    );
}
