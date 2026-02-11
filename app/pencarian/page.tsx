import { searchContent } from "@/lib/pb";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import Link from "next/link";
import { getAssetUrl } from "@/lib/cdn";
import { Calendar, ChevronRight, Search, FileText, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/number-utils";

export const metadata = {
    title: "Pencarian - BMT NU Lumajang",
    description: "Hasil pencarian produk dan berita BMT NU Lumajang",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";
    const results = await searchContent(query);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <ModernNavbar />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">
                            Hasil Pencarian
                        </h1>
                        <p className="text-slate-500">
                            Menampilkan hasil untuk keywoard <span className="font-bold text-emerald-700">"{query}"</span>
                        </p>
                    </header>

                    {results.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Tidak Ditemukan</h2>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Kami tidak dapat menemukan apa yang Anda cari. Coba gunakan kata kunci lain atau periksa ejaan Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {results.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                        {item.thumbnail ? (
                                            item.type === 'produk' && !item.thumbnail.startsWith('http') ? (
                                                // For products where thumbnail might be an icon name or filename
                                                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                                                    <ShoppingBag className="w-12 h-12" />
                                                </div>
                                            ) : (
                                                <Image
                                                    src={getAssetUrl(item, item.thumbnail)}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                                                {item.type === 'produk' ? (
                                                    <ShoppingBag className="w-12 h-12" />
                                                ) : (
                                                    <FileText className="w-12 h-12" />
                                                )}
                                            </div>
                                        )}

                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ${item.type === 'produk'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {item.type === 'produk' ? 'PRODUK' : 'BERITA'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 mb-4 line-clamp-2 text-sm">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center text-slate-400 text-xs">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(item.created)}
                                            </div>
                                            <span className="text-emerald-600 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                                                Detail <ChevronRight className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <ModernFooter />
        </div>
    );
}
