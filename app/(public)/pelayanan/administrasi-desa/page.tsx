"use client";

import React from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArrowLeft, Users, Building2, Heart, Shield, BookOpen, Landmark } from "lucide-react";
import Link from "next/link";

const lembagaList = [
    {
        icon: Landmark,
        name: "Badan Permusyawaratan Desa (BPD)",
        description: "Lembaga yang berfungsi menetapkan Peraturan Desa bersama Kepala Desa, menampung dan menyalurkan aspirasi masyarakat.",
        color: "bg-blue-100 text-blue-700",
    },
    {
        icon: Heart,
        name: "Pemberdayaan Kesejahteraan Keluarga (PKK)",
        description: "Gerakan untuk pemberdayaan keluarga melalui 10 Program Pokok PKK di bidang kesehatan, pendidikan, dan ekonomi keluarga.",
        color: "bg-pink-100 text-pink-700",
    },
    {
        icon: Shield,
        name: "Lembaga Pemberdayaan Masyarakat Desa (LPMD)",
        description: "Wadah partisipasi masyarakat dalam perencanaan, pelaksanaan, dan pengendalian pembangunan desa.",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        icon: Users,
        name: "Karang Taruna",
        description: "Organisasi sosial kepemudaan yang berperan dalam memberdayakan potensi generasi muda desa.",
        color: "bg-orange-100 text-orange-700",
    },
    {
        icon: BookOpen,
        name: "Majelis Ta'lim & Lembaga Keagamaan",
        description: "Lembaga keagamaan yang mengkoordinasikan kegiatan keagamaan, pendidikan Al-Qur'an, dan peringatan hari besar Islam.",
        color: "bg-indigo-100 text-indigo-700",
    },
    {
        icon: Building2,
        name: "Badan Usaha Milik Desa (BUMDes)",
        description: "Badan usaha desa yang mengelola potensi ekonomi lokal untuk meningkatkan pendapatan dan kesejahteraan warga.",
        color: "bg-amber-100 text-amber-700",
    },
];

const rtRwData = [
    { dusun: "Krajan", rw: "01", rtList: ["01", "02", "03", "04", "05"] },
    { dusun: "Nangger", rw: "02", rtList: ["01", "02", "03", "04"] },
    { dusun: "Tengah", rw: "03", rtList: ["01", "02", "03"] },
    { dusun: "Jer Lau'", rw: "04", rtList: ["01", "02", "03", "04"] },
    { dusun: "Gunung", rw: "05", rtList: ["01", "02", "03"] },
];

export default function AdministrasiDesaPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/pelayanan" className="inline-flex items-center text-slate-300 hover:text-white gap-1 mb-6 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Pelayanan
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        Administrasi Desa
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                        Informasi kelembagaan, data wilayah RT/RW, dan organisasi kemasyarakatan Desa Sumberanyar.
                    </p>
                </div>
            </section>

            {/* Kelembagaan Desa */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Kelembagaan</span>
                        <h2 className="text-3xl font-bold text-slate-900">Lembaga Kemasyarakatan Desa</h2>
                        <p className="text-slate-600 mt-3 max-w-lg mx-auto">Organisasi dan lembaga yang turut serta dalam pembangunan Desa Sumberanyar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lembagaList.map((lembaga) => (
                            <div key={lembaga.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className={`w-14 h-14 rounded-xl ${lembaga.color} flex items-center justify-center mb-4`}>
                                    <lembaga.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{lembaga.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{lembaga.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Data RT/RW */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Data Wilayah</span>
                        <h2 className="text-3xl font-bold text-slate-900">Pembagian Wilayah RT / RW</h2>
                        <p className="text-slate-600 mt-3 max-w-lg mx-auto">Pembagian wilayah administrasi berdasarkan dusun, RW, dan RT.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-200">
                                    <th className="p-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Dusun</th>
                                    <th className="p-4 font-bold text-slate-600 uppercase text-xs tracking-wider">RW</th>
                                    <th className="p-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Daftar RT</th>
                                    <th className="p-4 font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Jumlah RT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rtRwData.map((row) => (
                                    <tr key={row.dusun} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{row.dusun}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">
                                                RW {row.rw}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {row.rtList.map((rt) => (
                                                    <span key={rt} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                                                        RT {rt}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-slate-900">{row.rtList.length}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                                    <td colSpan={3} className="p-4 font-bold text-emerald-800">Total Seluruh RT</td>
                                    <td className="p-4 text-center font-bold text-emerald-800 text-lg">
                                        {rtRwData.reduce((acc, row) => acc + row.rtList.length, 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
