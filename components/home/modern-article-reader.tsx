"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, User, Share2, AlertCircle, ChevronRight, Hash } from "lucide-react";
import { pb } from "@/lib/pb";
import { News } from "@/types";
import { ModernFooter } from "@/components/layout/modern-footer";

interface ArticleReaderProps {
    slug: string;
    onBack: () => void;
}

export function ModernArticleReader({ slug, onBack }: ArticleReaderProps) {
    const [article, setArticle] = useState<News | null>(null);
    const [latestNews, setLatestNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Fetch current article
                const records = await pb.collection('berita_desa').getList<News>(1, 1, {
                    filter: `slug = "${slug}"`
                });
                
                if (records.items.length > 0) {
                    setArticle(records.items[0]);
                }

                // Fetch latest news for sidebar
                const latest = await pb.collection('berita_desa').getList<News>(1, 5, {
                    filter: `slug != "${slug}" && is_published = true`,
                    sort: '-created'
                });
                setLatestNews(latest.items);

            } catch (err) {
                console.error("Gagal memuat artikel", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchArticle();
    }, [slug]);

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setScrollProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
            }
        };
        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    if (loading) {
        return (
            <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center py-32 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="mt-6 text-emerald-800 font-bold uppercase tracking-widest text-xs">Memuat narasi...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-10 flex flex-col items-center justify-center text-center text-slate-800">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Kabar Tidak Ditemukan</h3>
                <p className="text-slate-500 max-w-sm mb-8 font-medium">Link artikel mungkin sudah kedaluwarsa atau telah dihapus oleh pengurus desa.</p>
                <button 
                    onClick={onBack}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-100 active:scale-95"
                >
                    KEMBALI KE BERANDA
                </button>
            </div>
        );
    }

    const processedContent = (article.konten || "")
        .replace(/<img /g, '<img class="max-w-full h-auto rounded-2xl my-8 shadow-md border border-slate-100" ')
        .replace(/<table /g, '<div class="overflow-x-auto my-8 border border-slate-100 rounded-xl"><table class="min-w-full divide-y border-collapse" ')
        .replace(/<\/table>/g, '</table></div>');

    const imageUrl = article.thumbnail ? pb.files.getURL(article, article.thumbnail) : null;

    const categories = [
        "Berita Utama", "Edukasi & Literasi", "Pengumuman Desa", "Kegiatan Warga", "Layanan Publik"
    ];

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col animate-in fade-in duration-500">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-slate-100/50 z-[100]">
                <div 
                    className="h-full bg-emerald-600 transition-all duration-150" 
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Title Section (Green Branding) */}
            <header className="bg-gradient-to-r from-[#15803d] to-[#14532d] text-white relative overflow-hidden">
                {/* Subtle decorative pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-10 md:pt-12 md:pb-14 relative z-10">
                    <button 
                        onClick={onBack}
                        className="group flex items-center gap-2 text-emerald-100/80 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all mb-6 bg-white/10 hover:bg-white/20 w-fit px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali ke Berita</span>
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em]">
                            {article.kategori}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        <span className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                            {new Date(article.created).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.2] tracking-tight max-w-4xl drop-shadow-sm">
                        {article.judul}
                    </h1>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12 flex-1 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left: Article Column */}
                    <div className="lg:col-span-8">
                        {/* Featured Image */}
                        {imageUrl && (
                            <div className="mb-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                                <img 
                                    src={imageUrl} 
                                    alt={article.judul}
                                    className="w-full aspect-video object-cover"
                                />
                            </div>
                        )}

                        {/* Author Short Meta */}
                        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-200">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Penulis</span>
                                <span className="font-bold text-slate-800 text-sm">Administrator Desa</span>
                            </div>
                        </div>

                        {/* Article Text */}
                        <article 
                            className="prose prose-slate prose-emerald lg:prose-xl max-w-none text-slate-700 
                                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-800
                                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                                prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                        />
                    </div>

                    {/* Right: Sidebar Column */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Latest News Sidebar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                                Berita Terbaru
                            </h3>
                            <div className="space-y-6">
                                {latestNews.map((news) => (
                                    <button 
                                        key={news.id} 
                                        className="flex gap-4 group text-left w-full"
                                        onClick={() => {
                                            // Handle internal nav
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            // Logic to change slug would go here if we had a router 
                                            // but since we are in a dashboard state, we'll let the parent handle it
                                            // or just re-fetch if we are in this component.
                                        }}
                                    >
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                            {news.thumbnail ? (
                                                <img 
                                                    src={pb.files.getURL(news, news.thumbnail, { thumb: '100x100' })} 
                                                    alt={news.judul} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col py-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                {new Date(news.created).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {news.judul}
                                            </h4>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories Sidebar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                                Kategori
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button 
                                        key={cat}
                                        className="px-3 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl text-xs font-bold text-slate-500 hover:text-emerald-700 transition-all flex items-center gap-1.5"
                                    >
                                        <Hash className="w-3 h-3 opacity-50" />
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Full Site Footer */}
            <ModernFooter />
        </div>
    );
}
