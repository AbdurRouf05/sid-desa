"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import PocketBase from "pocketbase"; // Import for fresh client
import {
    Plus, Search, Edit, Trash2,
    ShoppingBag, PiggyBank, CreditCard, Wallet, Banknote, Landmark, Coins, DollarSign,
    TrendingUp, ShieldCheck, Briefcase, Building, Home, Car, GraduationCap,
    Plane, Umbrella, Vote, Users, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all'); // Add Tab State

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Base filter from Search
            let filterExpr = search ? `name ~ "${search}"` : "";

            // Add Tab Filter
            if (activeTab === 'published') {
                filterExpr = filterExpr ? `${filterExpr} && published = true` : "published = true";
            } else if (activeTab === 'draft') {
                filterExpr = filterExpr ? `${filterExpr} && published = false` : "published = false";
            }

            // Strategy: Try fetching with SORT first
            try {
                const queryOptions: any = {
                    sort: '-created',
                    requestKey: null,
                    filter: filterExpr // Apply combined filter
                };

                const result = await pb.collection('products').getList(page, 10, queryOptions);
                setProducts(result.items);
                setTotalPages(result.totalPages);
            } catch (sortError: any) {
                // Fallback (e.g. invalid sort index)
                if (sortError.status === 400) {
                    console.warn("Sort failed, retrying without sort...");
                    const fallbackOptions: any = {
                        requestKey: null,
                        filter: filterExpr
                    };
                    const result = await pb.collection('products').getList(page, 10, fallbackOptions);
                    setProducts(result.items);
                    setTotalPages(result.totalPages);
                } else {
                    throw sortError;
                }
            }
        } catch (e: any) {
            console.error("Error fetching products:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timeout);
    }, [page, search, activeTab]); // Trigger fetch on tab change

    const handleDelete = async (id: string) => {
        if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
        try {
            await pb.collection('products').delete(id);
            fetchProducts();
        } catch (e) {
            alert("Gagal menghapus produk");
        }
    };

    return (
        <main className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Produk & Layanan</h1>
                    <p className="text-slate-500">Kelola produk simpanan dan pembiayaan BMT NU.</p>
                </div>
                <Link
                    href="/panel/dashboard/produk/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Produk
                </Link>
            </div>

            {/* TABS UI */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => { setActiveTab('all'); setPage(1); }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                            ? 'border-emerald-600 text-emerald-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => { setActiveTab('published'); setPage(1); }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'published'
                            ? 'border-emerald-600 text-emerald-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Terbit (Published)
                </button>
                <button
                    onClick={() => { setActiveTab('draft'); setPage(1); }}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'draft'
                            ? 'border-emerald-600 text-emerald-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Draft
                </button>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500">Memuat data...</div>
                ) : products.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center">
                        <ShoppingBag className="w-12 h-12 mb-4 text-slate-300" />
                        <p>Belum ada produk. Silakan tambah baru.</p>
                    </div>
                ) : (
                    products.map((item) => (
                        <div key={item.id} className={cn(
                            "bg-white rounded-2xl border transition-all group relative overflow-hidden",
                            item.published
                                ? "shadow-sm border-slate-100 hover:shadow-md"
                                : "shadow-none border-slate-200 bg-slate-50/50 opacity-75 grayscale-[0.5]"
                        )}>
                            {/* Thumbnail */}
                            <div className="h-40 bg-slate-100 relative">
                                {item.thumbnail ? (
                                    <img
                                        src={pb.files.getUrl(item, item.thumbnail)}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    {item.published ? (
                                        <span className="bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="bg-slate-200/90 backdrop-blur text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            Draft
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center -mt-10 bg-white shadow-md relative z-10",
                                        item.type === "simpanan" ? "text-emerald-600" : "text-gold-600"
                                    )}>
                                        {(() => {
                                            const IconMap: any = {
                                                PiggyBank, CreditCard, Wallet, Banknote, Landmark, Coins, DollarSign,
                                                TrendingUp, ShieldCheck, Briefcase, Building, Home, Car, GraduationCap,
                                                Plane, Umbrella, Vote, Users, ShoppingBag, Smartphone
                                            };
                                            const IconComponent = item.icon_name && IconMap[item.icon_name]
                                                ? IconMap[item.icon_name]
                                                : (item.type === "simpanan" ? PiggyBank : CreditCard);

                                            return <IconComponent className="w-5 h-5" />;
                                        })()}
                                    </div>
                                    <div className="flex gap-1">
                                        <Link
                                            href={`/panel/dashboard/produk/${item.id}`}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{item.name}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                                    {item.type} • {item.schema_type || "General"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
