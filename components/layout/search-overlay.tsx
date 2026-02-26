"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Newspaper, Package, SearchSlash, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pb } from "@/lib/pb";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ products: any[], news: any[] }>({ products: [], news: [] });
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on open & Fetch Logo
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";

            // Fetch Logo Secondary (White)
            pb.collection('profil_desa').getFirstListItem("").then(config => {
                if (config.logo_secondary) {
                    setLogoUrl(pb.files.getURL(config, config.logo_secondary));
                }
            }).catch(() => { });
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults({ products: [], news: [] });
        }
    }, [isOpen]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Search logic with debounce
    useEffect(() => {
        if (query.length < 2) {
            setResults({ products: [], news: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                // Escape double quotes for PocketBase filter
                const safeQuery = query.replace(/"/g, '\\"');

                const [productsRes, newsRes] = await Promise.all([
                    pb.collection('products').getList(1, 5, {
                        filter: `published = true && (name ~ "${safeQuery}" || description ~ "${safeQuery}")`,
                        sort: '-created'
                    }),
                    pb.collection('news').getList(1, 5, {
                        filter: `published = true && (title ~ "${safeQuery}" || content ~ "${safeQuery}")`,
                        sort: '-created'
                    })
                ]);

                setResults({
                    products: productsRes.items,
                    news: newsRes.items
                });
            } catch (e) {
                console.error("Search error:", e);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-emerald-950/95 backdrop-blur-xl flex flex-col pt-24 px-4 pb-10 overflow-y-auto"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="max-w-4xl mx-auto w-full">
                        {/* Search Input */}
                        <div className="relative mb-12">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari layanan, produk, atau berita..."
                                className="w-full bg-transparent border-b-2 border-white/20 pb-4 pl-12 text-2xl md:text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            {loading && (
                                <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-spin" />
                            )}
                        </div>

                        {/* Results Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Products Results */}
                            <div>
                                <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Produk & Layanan
                                </h3>
                                <div className="space-y-4">
                                    {results.products.length > 0 ? (
                                        results.products.map(product => {
                                            const targetSlug = product.slug || product.id;
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/produk/${targetSlug}`}
                                                    onClick={onClose}
                                                    className="group block p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase text-sm mb-1">{product.name}</p>
                                                            <p className="text-white/50 text-xs line-clamp-1">{product.description?.replace(/<[^>]*>/g, '')}</p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : query.length >= 2 && !loading && (
                                        <p className="text-white/20 text-sm italic">Tidak ada produk ditemukan.</p>
                                    )}
                                </div>
                            </div>

                            {/* News Results */}
                            <div>
                                <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                    <Newspaper className="w-4 h-4" /> Berita Terkini
                                </h3>
                                <div className="space-y-4">
                                    {results.news.length > 0 ? (
                                        results.news.map(item => {
                                            const targetSlug = item.slug || item.id;
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/berita/${targetSlug}`}
                                                    onClick={onClose}
                                                    className="group block p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm mb-1">{item.title}</p>
                                                            <p className="text-white/50 text-xs line-clamp-1">{item.excerpt || item.content?.replace(/<[^>]*>/g, '')}</p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : query.length >= 2 && !loading && (
                                        <p className="text-white/20 text-sm italic">Tidak ada berita ditemukan.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Empty State */}
                        {query.length < 2 && (
                            <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                <SearchSlash className="w-16 h-16 mb-4 opacity-10" />
                                <p className="text-center max-w-sm">Ketikkan kata kunci untuk mencari layanan, berita, atau informasi terbaru dari Desa Sumberanyar.</p>
                            </div>
                        )}
                    </div>

                    {/* Branding Logo Overlay */}
                    {logoUrl && (
                        <div className="fixed bottom-10 right-10 pointer-events-none opacity-20 select-none hidden md:block">
                            <img src={logoUrl} alt="SID Sumberanyar" className="w-48 h-auto grayscale brightness-200" />
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
