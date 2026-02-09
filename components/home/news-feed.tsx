"use client";

import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { getAssetUrl } from "@/lib/cdn";
import { formatDate } from "@/lib/number-utils";

interface NewsFeedProps {
    news: any[];
    loading: boolean;
}

export function NewsFeed({ news, loading }: NewsFeedProps) {
    const { getLabel } = useUiLabels();

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-emerald-950">{getLabel('section_news_title', 'Berita dan Artikel')}</h2>
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
                            <div key={item.id} className="group cursor-pointer" onClick={() => window.location.href = `/berita/${item.slug}`}>
                                <div className="h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                                    {item.thumbnail ? (
                                        <Image
                                            src={getAssetUrl(item, item.thumbnail)}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                            <span className="text-emerald-300">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold text-emerald-800">
                                        {item.category || "BERITA"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {formatDate(item.created || item.updated)}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                                    {item.title}
                                </h3>
                                <p
                                    className="text-sm text-slate-500 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: item.content ? item.content.replace(/<[^>]*>/g, '') : "" }}
                                />
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
