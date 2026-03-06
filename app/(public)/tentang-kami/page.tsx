"use client";

import React, { useEffect, useState } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ShieldCheck, Calendar, Users, Building2, FileText, CheckCircle2, UserCircle, BarChart3 } from "lucide-react";
import { pb } from "@/lib/pb";
import { JsonLd } from "@/components/seo/json-ld";

export default function TentangKamiPage() {
    const [config, setConfig] = useState<any>(null);
    const [perangkatList, setPerangkatList] = useState<any[]>([]);
    const [perangkatLoading, setPerangkatLoading] = useState(true);
    const [demografi, setDemografi] = useState<any[]>([]);
    const [demografiLoading, setDemografiLoading] = useState(true);

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
        const fetchPerangkat = async () => {
            try {
                const records = await pb.collection('perangkat_desa').getFullList({
                    filter: 'is_aktif = true',
                    sort: 'created',
                });
                setPerangkatList(records);
            } catch (e) {
                console.error("Error fetching perangkat desa", e);
            } finally {
                setPerangkatLoading(false);
            }
        };
        fetchConfig();
        fetchPerangkat();
        // Fetch demografi
        (async () => {
            try {
                const records = await pb.collection('statistik_demografi').getFullList({ sort: 'kategori,label' });
                setDemografi(records);
            } catch (e) {
                console.error("Error fetching demografi", e);
            } finally {
                setDemografiLoading(false);
            }
        })();
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
                        Melayani dengan Amanah, Transparan, dan Profesional
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

                {/* Statistik Demografi */}
                <section id="demografi" className="scroll-mt-24">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                            <BarChart3 className="w-4 h-4" />
                            <span>Data Kependudukan</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Statistik Demografi Warga</h2>
                        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Ringkasan data kependudukan Desa Sumberanyar berdasarkan berbagai kategori.</p>
                    </div>

                    {demografiLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
                                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-4" />
                                    <div className="space-y-3">
                                        <div className="h-8 bg-slate-100 rounded" />
                                        <div className="h-8 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : demografi.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Data demografi belum tersedia.</p>
                        </div>
                    ) : (
                        <DemografiCharts data={demografi} />
                    )}
                </section>

                {/* Perangkat Desa / Struktur Organisasi */}
                <section id="perangkat" className="scroll-mt-24">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
                            <Users className="w-4 h-4" />
                            <span>Struktur Organisasi</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Perangkat Desa Sumberanyar</h2>
                        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Aparatur pemerintahan desa yang bertugas melayani kebutuhan administrasi dan kesejahteraan masyarakat.</p>
                    </div>

                    {perangkatLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4" />
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
                                </div>
                            ))}
                        </div>
                    ) : perangkatList.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                            <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Data perangkat desa belum tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {perangkatList.map((p) => (
                                <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center hover:-translate-y-1 transition-transform duration-300">
                                    {p.foto ? (
                                        <img
                                            src={pb.files.getURL(p, p.foto, { thumb: '120x120' })}
                                            alt={p.nama}
                                            className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-100"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-emerald-100 flex items-center justify-center">
                                            <UserCircle className="w-8 h-8 text-emerald-600" />
                                        </div>
                                    )}
                                    <h4 className="font-bold text-slate-900 text-sm">{p.nama}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{p.jabatan}</p>
                                    {p.nip && <p className="text-[10px] text-slate-400 mt-1 font-mono">NIP: {p.nip}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            <ModernFooter />
        </main>
    );
}

// -- Demografi Charts Component --
const CHART_COLORS: Record<string, string> = {
    "Jenis Kelamin": "from-blue-500 to-blue-600",
    "Kelompok Usia": "from-emerald-500 to-emerald-600",
    "Agama": "from-amber-500 to-amber-600",
    "Pendidikan": "from-purple-500 to-purple-600",
    "Pekerjaan": "from-rose-500 to-rose-600",
};

function DemografiCharts({ data }: { data: any[] }) {
    // Group by kategori
    const grouped: Record<string, any[]> = {};
    data.forEach(d => {
        if (!grouped[d.kategori]) grouped[d.kategori] = [];
        grouped[d.kategori].push(d);
    });

    const categories = Object.keys(grouped);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(kat => {
                const items = grouped[kat];
                const maxVal = Math.max(...items.map((i: any) => i.jumlah), 1);
                const total = items.reduce((sum: number, i: any) => sum + i.jumlah, 0);
                const colorClass = CHART_COLORS[kat] || "from-slate-500 to-slate-600";

                return (
                    <div key={kat} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800">{kat}</h3>
                            <span className="text-xs text-slate-400 font-medium">Total: {total.toLocaleString('id-ID')} jiwa</span>
                        </div>
                        <div className="space-y-3">
                            {items.map((item: any) => {
                                const pct = (item.jumlah / maxVal) * 100;
                                return (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-slate-600 font-medium">{item.label}</span>
                                            <span className="text-slate-900 font-bold">{item.jumlah.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
