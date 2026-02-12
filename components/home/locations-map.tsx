"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import * as LucideIcons from "lucide-react";

interface LocationsMapProps {
    stats: {
        branches: string;
    };
    mapUrl: string;
    config?: {
        title?: string;
        description?: string;
        feature1_text?: string;
        feature1_icon?: string;
        feature2_text?: string;
        feature2_icon?: string;
    } | null;
}

// Helper component to render dynamic icon
const DynamicIcon = ({ name, className }: { name?: string; className?: string }) => {
    if (!name) return null;
    // Capitalize first letter just in case
    const iconName = (name.charAt(0).toUpperCase() + name.slice(1)) as keyof typeof LucideIcons;
    const Icon = LucideIcons[iconName] as React.ElementType;

    if (!Icon) return <LucideIcons.MapPin className={className} />; // Fallback
    return <Icon className={className} />;
};

export function LocationsMap({ stats, mapUrl, config }: LocationsMapProps) {
    // Defaults
    const title = config?.title || "Kami Hadir Lebih Dekat";
    const description = config?.description || `Dengan ${stats.branches} titik layanan yang tersebar di wilayah Lumajang, kami siap melayani kebutuhan transaksi keuangan Anda dengan keramahan dan profesionalisme.`;

    const feature1Text = config?.feature1_text || "Kantor Pusat & Cabang Strategis";
    const feature1Icon = config?.feature1_icon || "MapPin";

    const feature2Text = config?.feature2_text || "Layanan Senin - Sabtu (07.30 - 15.00)";
    const feature2Icon = config?.feature2_icon || "Clock";

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Jaringan Kantor</span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{title}</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed whitespace-pre-line">
                            {description}
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                                    <DynamicIcon name={feature1Icon} className="w-4 h-4" />
                                </div>
                                <span className="font-medium whitespace-pre-line">{feature1Text}</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                                    <DynamicIcon name={feature2Icon} className="w-4 h-4" />
                                </div>
                                <span className="font-medium whitespace-pre-line">{feature2Text}</span>
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
                                                <LucideIcons.MapPin className="w-5 h-5 text-red-500 animate-bounce" />
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
