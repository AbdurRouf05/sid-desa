"use client";

import React from "react";
import { Users, ShieldAlert, HeartHandshake, Baby, Tent, HandMetal } from "lucide-react";

export function ModernKelembagaan() {
    const lembaga = [
        {
            id: 1,
            nama: "Badan Permusyawaratan Desa (BPD)",
            singkatan: "BPD",
            desc: "Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa.",
            icon: Users,
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            id: 2,
            nama: "Lembaga Pemberdayaan Masyarakat Desa",
            singkatan: "LPMD",
            desc: "Wadah partisipasi masyarakat dalam perencanaan dan pelaksanaan pembangunan desa.",
            icon: HandMetal,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            id: 3,
            nama: "Pemberdayaan Kesejahteraan Keluarga",
            singkatan: "PKK",
            desc: "Gerakan nasional dalam pembangunan masyarakat yang tumbuh dari bawah, dengan wanita sebagai motor penggeraknya.",
            icon: Baby,
            color: "bg-pink-50 text-pink-600 border-pink-100"
        },
        {
            id: 4,
            nama: "Karang Taruna",
            singkatan: "KT",
            desc: "Wadah pengembangan generasi muda nonpartisan yang tumbuh atas dasar kesadaran.",
            icon: HeartHandshake,
            color: "bg-orange-50 text-orange-600 border-orange-100"
        },
        {
            id: 5,
            nama: "Perlindungan Masyarakat (LINMAS)",
            singkatan: "LINMAS",
            desc: "Satuan tugas untuk memelihara keamanan, ketentraman dan ketertiban masyarakat.",
            icon: ShieldAlert,
            color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        },
        {
            id: 6,
            nama: "Badan Usaha Milik Desa",
            singkatan: "BUMDes",
            desc: "Badan usaha yang modal dan kegiatannya untuk kemakmuran masyarakat desa.",
            icon: Tent,
            color: "bg-amber-50 text-amber-600 border-amber-100"
        }
    ];

    return (
        <div className="animate-in fade-in duration-500 pb-12 p-6 md:p-8">
            <div className="mb-8 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-8 h-8 text-emerald-600" /> Lembaga Desa
                </h2>
                <p className="text-slate-500 mt-2">Daftar lembaga desa yang ada di Desa Sumberanyar yang bekerja sama dan bermitra dengan Pemerintah Desa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lembaga.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border mb-5 ${item.color}`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg line-clamp-2 min-h-[56px] leading-tight mb-2">
                                {item.nama}
                            </h3>
                            <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md mb-3">
                                {item.singkatan}
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center text-slate-500">
                <p>Data profil tiap kelembagaan dan susunan pengurus dapat diperbarui melalui Control Panel Desa.</p>
            </div>
        </div>
    );
}
