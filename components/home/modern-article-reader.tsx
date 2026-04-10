"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, User, Share2, AlertCircle } from "lucide-react";
import { pb } from "@/lib/pb";
import { News } from "@/types";

interface ArticleReaderProps {
    slug: string;
    onBack: () => void;
}

export function ModernArticleReader({ slug, onBack }: ArticleReaderProps) {
    const [article, setArticle] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const records = await pb.collection('berita_desa').getList<News>(1, 1, {
                    filter: `slug = "${slug}"`
                });
                
                if (records.items.length > 0) {
                    setArticle(records.items[0]);
                }
            } catch (err) {
                console.error("Gagal memuat artikel", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="h-full bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center py-20 min-h-[400px]">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-700 font-medium">Memuat artikel...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="h-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Artikel Tidak Ditemukan</h3>
                <p className="text-slate-500 max-w-md mb-6">Artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
                <button 
                    onClick={onBack}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    // Process article content to make it safer for dangerouslySetInnerHTML
    // Remove inline styles that might break layout, ensure max-width
    const processedContent = article.content
        .replace(/<img /g, '<img class="max-w-full h-auto rounded-lg my-4 shadow-sm" ')
        .replace(/<table /g, '<div class="overflow-x-auto my-4"><table class="min-w-full divide-y border" ')
        .replace(/<\/table>/g, '</table></div>');

    const imageUrl = article.thumbnail ? pb.files.getURL(article, article.thumbnail) : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-screen pb-16 animate-in fade-in duration-300">
            {/* Header / Top Bar */}
            <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 font-medium transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-50"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Kembali</span>
                </button>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Bagikan">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Thumbnail Header */}
            {imageUrl && (
                <div className="w-full h-48 md:h-72 lg:h-96 relative bg-slate-100 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-3">
                            {article.category}
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                            {article.title}
                        </h1>
                    </div>
                </div>
            )}

            <div className="p-6 md:p-10 max-w-4xl mx-auto">
                {/* Meta without Image */}
                {!imageUrl && (
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-md mb-4 border border-emerald-200">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                            {article.title}
                        </h1>
                    </div>
                )}

                {/* Author Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-700">Admin Desa</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(article.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Main Content */}
                <article 
                    className="prose prose-slate prose-emerald lg:prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                />

            </div>
        </div>
    );
}
