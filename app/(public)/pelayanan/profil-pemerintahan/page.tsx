"use client";

import React, { useEffect, useState } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { pb } from "@/lib/pb";
import { ArrowLeft, Users, UserCircle, Building2, Loader2, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";

export default function ProfilPemerintahanPage() {
    const [config, setConfig] = useState<any>(null);
    const [perangkat, setPerangkat] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [configRes, perangkatRes] = await Promise.all([
                    pb.collection('profil_desa').getList(1, 1),
                    pb.collection('perangkat_desa').getFullList({
                        filter: 'is_aktif = true',
                        sort: 'created',
                    }),
                ]);
                if (configRes.items.length > 0) setConfig(configRes.items[0]);
                setPerangkat(perangkatRes);
            } catch (e) {
                console.error("Error fetching data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const visi = config?.visi || "Mewujudkan Desa Sumberanyar yang mandiri, sejahtera, dan berkeadilan.";
    const misi = config?.misi || [
        "Meningkatkan kualitas pelayanan publik",
        "Membangun infrastruktur desa yang modern",
        "Meningkatkan kesejahteraan masyarakat melalui program-program ekonomi kerakyatan",
        "Mewujudkan tata kelola pemerintahan desa yang transparan dan akuntabel",
    ];

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-cyan-800 via-sky-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/pelayanan" className="inline-flex items-center text-cyan-200 hover:text-white gap-1 mb-6 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Pelayanan
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Profil Pemerintahan Desa
                    </h1>
                    <p className="text-lg text-cyan-100 max-w-2xl font-light leading-relaxed">
                        Struktur organisasi, visi & misi, serta daftar perangkat desa yang bertugas melayani masyarakat.
                    </p>
                </div>
            </section>

            {/* Visi Misi */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Visi */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Visi</h2>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-4">
                                &ldquo;{visi}&rdquo;
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-blue-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Misi</h2>
                            </div>
                            <ol className="space-y-3">
                                {(Array.isArray(misi) ? misi : [misi]).map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="text-slate-600 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perangkat Desa */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Aparatur Desa</span>
                        <h2 className="text-3xl font-bold text-slate-900">Perangkat Pemerintah Desa</h2>
                        <p className="text-slate-600 mt-3 max-w-lg mx-auto">Daftar pejabat dan perangkat desa yang aktif bertugas melayani masyarakat.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : perangkat.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>Data perangkat desa belum tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {perangkat.map((p) => (
                                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden flex items-center justify-center border-2 border-slate-200">
                                            {p.foto ? (
                                                <img src={pb.files.getURL(p, p.foto)} alt={p.nama} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircle className="w-12 h-12 text-slate-300" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">{p.nama}</h3>
                                        <p className="text-sm text-emerald-600 font-semibold mt-1">{p.jabatan}</p>
                                        {p.nip && (
                                            <p className="text-xs text-slate-400 font-mono mt-2">NIP: {p.nip}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
