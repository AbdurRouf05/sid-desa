"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Calendar, CalendarDays, ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { getAssetUrl } from "@/lib/cdn";
import { formatDate } from "@/lib/number-utils";

interface NewsFeedProps {
    news?: any[];
    loading?: boolean;
    onViewDetail?: (slug: string) => void;
}

export function NewsFeed({ news = [], loading = false, onViewDetail }: NewsFeedProps) {
    const { getLabel } = useUiLabels();
    const [activeTab, setActiveTab] = useState('Semua');

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-desa-primary-dark font-heading">{getLabel('section_news_title', 'Kabar Desa Sumberanyar')}</h2>
                    <TactileButton variant="ghost" onClick={() => window.location.href = '/berita'}>Lihat Berita Lainnya</TactileButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        // Loading Skeleton
                        [1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                                <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                                <div className="h-6 w-full bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                            </div>
                        ))
                    ) : news.length > 0 ? (
                        news.map((item: any) => (
                            <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {item.thumbnail ? (
                                        <Image
                                            src={getAssetUrl(item, item.thumbnail)}
                                            alt={item.judul}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-desa-primary/10 flex items-center justify-center">
                                            <span className="text-desa-primary/30">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold text-desa-primary-dark">
                                        {item.kategori || "KABAR DESA"}
                                    </span>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {formatDate(item.created || item.updated)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-desa-primary transition-colors line-clamp-2 mb-2 font-heading">
                                        {onViewDetail ? (
                                            <button onClick={() => onViewDetail(item.slug)} className="text-left">
                                                {item.judul}
                                            </button>
                                        ) : (
                                            <Link href={`/berita/${item.slug}`}>
                                                {item.judul}
                                            </Link>
                                        )}
                                    </h3>
                                    <p
                                        className="text-sm text-slate-500 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: item.konten ? item.konten.replace(/<[^>]*>/g, '') : "" }}
                                    />
                                    
                                    {onViewDetail ? (
                                        <button onClick={() => onViewDetail(item.slug)} className="absolute inset-0 z-10">
                                            <span className="sr-only">Baca {item.judul}</span>
                                        </button>
                                    ) : (
                                        <Link href={`/berita/${item.slug}`} className="absolute inset-0 z-10">
                                            <span className="sr-only">Baca {item.judul}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Empty State
                        <div className="col-span-3 text-center py-10 text-slate-500">
                            <p>Belum ada kabar terbaru.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
