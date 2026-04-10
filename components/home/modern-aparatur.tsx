"use client";

import React from "react";
import { Users, Clock } from "lucide-react";

interface ModernAparaturProps {
    dynamicStaff?: any[] | null;
}

export function ModernAparatur({ dynamicStaff }: ModernAparaturProps) {
    // Fallback static staff
    const staff = dynamicStaff || [
        { name: "Budi Santoso", role: "Kepala Desa", status: "Di Kantor", img: "https://api.dicebear.com/7.x/initials/svg?seed=Budi+Santoso&backgroundColor=059669" },
        { name: "Siti Rahma", role: "Sekretaris Desa", status: "Di Luar", img: "https://api.dicebear.com/7.x/initials/svg?seed=Siti+Rahma&backgroundColor=059669" },
        { name: "Agus Riyanto", role: "Kaur Umum", status: "Di Kantor", img: "https://api.dicebear.com/7.x/initials/svg?seed=Agus+Riyanto&backgroundColor=059669" },
        { name: "Dewi Lestari", role: "Kaur Keuangan", status: "Di Kantor", img: "https://api.dicebear.com/7.x/initials/svg?seed=Dewi+Lestari&backgroundColor=059669" }
    ];

    return (
        <section id="aparatur" className="py-6 bg-white animate-in fade-in duration-500">
            <div className="container mx-auto px-4 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                    <div className="flex-shrink-0 text-slate-700">
                        <Users className="w-10 h-10" />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-desa-primary tracking-tight uppercase leading-none">
                            Perangkat Desa
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Susunan organisasi pemerintahan Desa Sumberanyar</p>
                    </div>
                </div>

                {/* Grid Kartu Pegawai */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {staff.map((person, i) => (
                        <div key={i} className="relative bg-white border-2 border-desa-primary rounded-sm group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            
                            {/* Accent Circle (Yellow Dot) */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#F6D002] rounded-full z-20 shadow-sm border-[4px] border-white group-hover:scale-110 transition-transform"></div>

                            {/* Top Curve (Green Header Background inside card) */}
                            <div className="absolute top-0 left-0 right-0 h-[60%] overflow-hidden z-0">
                                <div className="absolute -bottom-8 -left-8 right-0 h-[150%] bg-desa-primary-light rounded-bl-[100%] rounded-br-[40%] origin-top-left shadow-inner"></div>
                            </div>

                            {/* Profile Image Area */}
                            <div className="relative z-10 pt-8 pb-4 flex flex-col items-center">
                                <div className="w-36 h-36 rounded-full bg-white p-[6px] shadow-sm relative">
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                        <img 
                                            src={person.img}
                                            alt={person.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Content */}
                            <div className="relative z-10 bg-white pt-2 pb-6 px-4 text-center border-t border-desa-primary/10">
                                <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-wide leading-snug">{person.name}</h3>
                                <p className="text-[13px] font-bold text-slate-600 mb-4">{person.role}</p>
                                
                                {/* Social Media Icons */}
                                <div className="flex items-center justify-center gap-3 text-slate-400 mb-2">
                                    {person.sosmed_fb && (
                                        <a href={person.sosmed_fb} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors shadow-sm cursor-pointer">
                                            <span className="font-serif text-sm font-bold italic">f</span>
                                        </a>
                                    )}
                                    {person.sosmed_ig && (
                                        <a href={person.sosmed_ig} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors shadow-sm cursor-pointer">
                                            <span className="font-sans text-sm font-bold">ig</span>
                                        </a>
                                    )}
                                    {person.sosmed_wa && (
                                        <a href={person.sosmed_wa} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors shadow-sm cursor-pointer">
                                            <span className="font-sans text-sm font-bold">wa</span>
                                        </a>
                                    )}
                                    {person.sosmed_x && (
                                        <a href={person.sosmed_x} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-sm cursor-pointer">
                                            <span className="font-sans text-sm font-bold">X</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
