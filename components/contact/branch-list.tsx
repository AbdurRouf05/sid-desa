import React, { useState, useEffect } from "react";
import { MapPin, Phone, Search, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";

// Helper to format 08xx to 628xx for WhatsApp
const formatWA = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        return "62" + cleaned.slice(1);
    }
    return cleaned;
};

export function BranchList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const result = await pb.collection('branches').getFullList({
                    sort: 'sort_order',
                });
                setBranches(result);
            } catch (e) {
                console.error("Error fetching branches", e);
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    const filteredBranches = branches.filter((branch) =>
        (branch.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (branch.address || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder="Cari kantor cabang (e.g., Kunir, Pasirian)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p>Memuat data kantor cabang...</p>
                </div>
            ) : (
                <>
                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBranches.map((branch) => (
                            <div
                                key={branch.id}
                                className="group bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "p-2.5 rounded-xl",
                                            branch.type === "Pusat" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                        )}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider",
                                            branch.type === "Pusat" ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {branch.type}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                        {branch.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                        {branch.address}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                                    {/* WhatsApp Button */}
                                    <a
                                        href={`https://wa.me/${formatWA(branch.phone_wa || "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Chat WA
                                    </a>

                                    {/* Maps Button (No API, Deep Link) */}
                                    <a
                                        href={branch.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Desa Sumberanyar " + branch.name + " " + branch.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Peta
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredBranches.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Tidak ada kantor cabang ditemukan untuk "{searchQuery}"</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
