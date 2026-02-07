import React from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { User, ChevronLeft, Share2, Search } from "lucide-react";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { pb } from "@/lib/pb";
import { getAssetUrl } from "@/lib/cdn";

type Props = {
    params: Promise<{ slug: string }>
}

async function getNewsItem(slug: string) {
    try {
        const record = await pb.collection('news').getFirstListItem(`slug="${slug}"`, {
            expand: 'author',
            filter: 'published = true'
        });
        return record;
    } catch (e) {
        return null;
    }
}

async function getRecentNews() {
    try {
        const result = await pb.collection('news').getList(1, 4, {
            sort: '-created',
            filter: 'published = true'
        });
        return result.items;
    } catch (e) {
        // Fallback for missing index/field, just like in Home Page
        if ((e as any).status === 400) {
            try {
                const result = await pb.collection('news').getList(1, 4, {
                    filter: 'published = true'
                });
                return result.items;
            } catch (fallbackError) {
                return [];
            }
        }
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const record = await getNewsItem(slug);
    if (!record) return { title: 'Berita Tidak Ditemukan' };

    const excerpt = record.content.replace(/<[^>]*>?/gm, '').substring(0, 160);
    const seoTitle = record.seo_title || `${record.title} - Berita BMT NU Lumajang`;
    const seoDesc = record.seo_desc || excerpt;

    return {
        title: seoTitle,
        description: seoDesc,
        openGraph: {
            images: record.thumbnail ? [getAssetUrl(record, record.thumbnail)] : []
        }
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params;
    const record = await getNewsItem(slug);

    if (!record) {
        notFound();
    }

    const recentNews = await getRecentNews();

    // Prepare JSON-LD Schema
    const newsSchema = {
        headline: record.title,
        image: record.thumbnail ? [pb.files.getURL(record, record.thumbnail)] : [],
        datePublished: record.created,
        dateModified: record.updated,
        articleBody: record.content.replace(/<[^>]*>?/gm, ''), // Strip HTML for schema body
        author: [{
            "@type": "Organization", // or Person if we had author field
            name: "BMT NU Lumajang",
            url: "https://bmtnu-lumajang.id"
        }]
    };

    const thumbnail = record.thumbnail
        ? getAssetUrl(record, record.thumbnail)
        : "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070";

    const dateStr = new Date(record.created).toLocaleDateString("id-ID", {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />
            <JsonLd type="NewsArticle" data={newsSchema} />

            {/* Breadcrumb / Back */}
            <div className="pt-24 pb-8 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/berita" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-gold-400 font-bold uppercase tracking-wider mb-3">
                        <span>{record.category}</span>
                        <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                        <span>{dateStr}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold leading-tight max-w-4xl">
                        {record.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                            <img src={thumbnail} alt={record.title} className="w-full h-auto object-cover" />
                        </div>

                        {/* Author Meta (Mobile Visible) */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Admin</p>
                                    <p className="text-xs text-slate-500">Penulis</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors">
                                <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Bagikan</span>
                            </button>
                        </div>

                        {/* HTML Content Render */}
                        <div
                            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-emerald-950 prose-a:text-emerald-600 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: record.content }}
                        />
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Related Box */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="font-bold text-lg text-slate-900 mb-4 border-b pb-2">Berita Terbaru</h3>
                            <div className="space-y-4">
                                {recentNews.map((item: any) => (
                                    <Link key={item.id} href={`/berita/${item.slug}`} className="group flex gap-4">
                                        <div className="w-20 h-20 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden relative">
                                            {item.thumbnail ? (
                                                <img
                                                    src={pb.files.getURL(item, item.thumbnail)}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                                    <Search className="w-6 h-6 text-emerald-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 mb-1">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-slate-400">
                                                {new Date(item.created).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">Kategori</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Berita", "Edukasi", "Promo"].map(tag => (
                                        <Link href={`/berita?cat=${tag}`} key={tag} className="px-3 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 text-xs font-bold rounded-full transition-colors">
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <ModernFooter />
        </main>
    );
}
