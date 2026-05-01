"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText, MessageSquare, ExternalLink, X, Compass, Loader2, FileSignature } from "lucide-react";
import { FormLapor } from "@/components/portal/form-lapor";
import { FormBansos } from "@/components/portal/form-bansos";
import { pb } from "@/lib/pb";
import { LayananDesa } from "@/types";

interface ModernPusatLayananProps {
    defaultServiceId?: string;
}

export function ModernPusatLayanan({ defaultServiceId }: ModernPusatLayananProps) {
    const [services, setServices] = useState<LayananDesa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLayanan = async () => {
            setLoading(true);
            try {
                const records = await pb.collection("layanan_desa").getFullList<LayananDesa>({
                    filter: "is_active = true && tipe != 'lapor' && tipe != 'bansos'",
                    sort: "urutan,created"
                });
                setServices(records);
            } catch (err) {
                console.error("Gagal memuat layanan", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLayanan();
    }, []);

    const getServiceIcon = (tipe: string) => {
        switch (tipe) {
            case 'lapor': return MessageSquare;
            case 'bansos': return Search;
            case 'link_eksternal': return ExternalLink;
            case 'panduan':
            case 'halaman_statis':
            default: return FileText;
        }
    };

    return (
        <section className="py-6 bg-white animate-in fade-in duration-500 min-h-[600px] relative rounded-xl shadow-sm border border-slate-200 mt-4">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-6 border-b border-slate-100">
                    <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
                        <FileSignature className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight uppercase leading-none">
                            Informasi Layanan & Syarat
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Panduan berkas dan persyaratan administrasi yang wajib dibawa ke kantor desa.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Memuat panduan layanan...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
                        <Compass className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Layanan</h3>
                        <p className="text-slate-500">Admin belum menambahkan item persyaratan layanan ke portal.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {services.map((srv, idx) => {
                            const Icon = getServiceIcon(srv.tipe);
                            
                            return (
                                <div key={srv.id} className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-snug pt-1">
                                            {srv.nama_layanan}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6 flex-grow">
                                        {srv.deskripsi}
                                    </p>
                                    
                                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 mt-auto">
                                        {srv.konten ? (
                                            <div 
                                                className="prose prose-sm prose-emerald max-w-none text-slate-700 leading-snug [&>div>strong]:text-emerald-800 [&>div>strong]:block [&>div>strong]:mb-2 [&>div>strong]:text-[13px] [&>div>ul]:pl-4 [&>div>ul>li]:mb-1 [&>div>ul>li]:text-xs"
                                                dangerouslySetInnerHTML={{
                                                    __html: srv.konten
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center py-2 text-slate-400 italic text-xs">
                                                Detail persyaratan belum diperbarui.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
