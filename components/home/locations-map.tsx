"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";

interface LocationsMapProps {
    stats: {
        branches: string;
    };
    mapUrl: string;
}

export function LocationsMap({ stats, mapUrl }: LocationsMapProps) {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Jaringan Kantor</span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Kami Hadir Lebih Dekat</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Dengan {stats.branches} titik layanan yang tersebar di wilayah Lumajang, kami siap melayani kebutuhan transaksi keuangan Anda dengan keramahan dan profesionalisme.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Kantor Pusat & Cabang Strategis</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Layanan Senin - Sabtu (07.30 - 15.00)</span>
                            </li>
                        </ul>

                        <TactileButton onClick={() => window.location.href = '/kontak'} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            Cari Kantor Terdekat <ArrowRight className="ml-2 w-4 h-4" />
                        </TactileButton>
                    </div>

                    <div className="relative">
                        <div className="bg-white p-2 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = '/kontak'}>
                                {mapUrl ? (
                                    <iframe
                                        src={mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full"
                                    ></iframe>
                                ) : (
                                    <>
                                        <Image
                                            src="https://images.pexels.com/photos/34528447/pexels-photo-34528447.jpeg"
                                            alt="Kantor BMT NU"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-emerald-950 shadow-lg flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-red-500 animate-bounce" />
                                                Lihat di Peta
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100/50 rounded-full blur-3xl opacity-50"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
