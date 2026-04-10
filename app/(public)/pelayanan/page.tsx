"use client";

import React from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { 
    FileText, Search, Send, MapPin, Users, Building2, 
    ClipboardList, Landmark, Phone, ArrowRight, Sparkles 
} from "lucide-react";

const services = [
    {
        icon: FileText,
        title: "Persuratan Desa",
        description: "Informasi syarat & prosedur pembuatan surat pengantar, SKTM, surat domisili, dan lainnya.",
        href: "/layanan",
        color: "from-emerald-500 to-teal-600",
        iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
        icon: Send,
        title: "Surat Online (Rantau)",
        description: "Ajukan permohonan surat dari luar kota tanpa harus datang ke Balai Desa.",
        href: "/pelayanan/surat-online",
        color: "from-blue-500 to-indigo-600",
        iconBg: "bg-blue-100 text-blue-700",
    },
    {
        icon: Search,
        title: "Cek Penerima Bansos",
        description: "Periksa status penerima Bantuan Sosial (PKH, BPNT, BLT DD) berdasarkan NIK atau nama.",
        href: "/pelayanan/cek-bansos",
        color: "from-amber-500 to-orange-600",
        iconBg: "bg-amber-100 text-amber-700",
    },
    {
        icon: ClipboardList,
        title: "Pengaduan Warga",
        description: "Salurkan aspirasi, kritik, dan saran untuk kemajuan Desa Sumberanyar.",
        href: "/pengaduan",
        color: "from-rose-500 to-pink-600",
        iconBg: "bg-rose-100 text-rose-700",
    },
    {
        icon: Landmark,
        title: "Laporan Keuangan",
        description: "Lihat transparansi keuangan APBDes dan realisasi anggaran pembangunan desa.",
        href: "/transparansi",
        color: "from-violet-500 to-purple-600",
        iconBg: "bg-violet-100 text-violet-700",
    },
    {
        icon: Users,
        title: "Profil Pemerintahan",
        description: "Struktur organisasi pemerintah desa, visi & misi, dan daftar perangkat desa.",
        href: "/pelayanan/profil-pemerintahan",
        color: "from-cyan-500 to-sky-600",
        iconBg: "bg-cyan-100 text-cyan-700",
    },
    {
        icon: Building2,
        title: "Administrasi Desa",
        description: "Informasi kelembagaan desa: BPD, PKK, LKMD, Karang Taruna, dan data RT/RW.",
        href: "/pelayanan/administrasi-desa",
        color: "from-slate-500 to-gray-700",
        iconBg: "bg-slate-100 text-slate-700",
    },
    {
        icon: MapPin,
        title: "Peta Desa",
        description: "Lihat peta wilayah desa secara interaktif beserta batas-batas dusun.",
        href: "/pelayanan/peta-desa",
        color: "from-green-500 to-emerald-600",
        iconBg: "bg-green-100 text-green-700",
    },
    {
        icon: Phone,
        title: "Kontak & Lokasi",
        description: "Informasi alamat Balai Desa, nomor telepon, jam buka, dan rute Google Maps.",
        href: "/kontak",
        color: "from-teal-500 to-cyan-600",
        iconBg: "bg-teal-100 text-teal-700",
    },
];

export default function PelayananPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-sm font-medium text-emerald-100">Portal Pelayanan Terpadu</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-display">
                        Pusat Pelayanan Desa
                    </h1>
                    <p className="text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
                        Akses seluruh layanan administrasi, informasi, dan fasilitas desa dalam satu portal terpadu.
                    </p>
                </div>
            </section>

            {/* Service Grid */}
            <section className="py-16 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <Link
                                key={service.title}
                                href={service.href}
                                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                {/* Top gradient bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <service.icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-emerald-700 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Selengkapnya
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Butuh Bantuan Lebih Lanjut?</h2>
                    <p className="text-emerald-100 max-w-2xl mx-auto mb-10">
                        Tim pelayanan kami siap menjawab pertanyaan Anda mengenai persyaratan administrasi atau pelaporan.
                    </p>
                    <Link href="/kontak" className="inline-flex items-center bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                        Hubungi Kami <Phone className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
