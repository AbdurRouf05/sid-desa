"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ApbdesRealisasi } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

export default function TransparansiPage() {
    const [data, setData] = useState<ApbdesRealisasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data to get available years
                const allData = await pb.collection("apbdes_realisasi").getFullList<ApbdesRealisasi>({
                    sort: "-tahun_anggaran",
                });

                const years = Array.from(new Set(allData.map(d => d.tahun_anggaran)));
                setAvailableYears(years);

                if (years.length > 0 && !years.includes(selectedYear)) {
                    setSelectedYear(years[0]);
                }

                // Filter by selected year
                const filteredData = allData.filter(d => d.tahun_anggaran === selectedYear);
                setData(filteredData);
            } catch (error) {
                console.error("Gagal memuat data APBDes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedYear]);

    // Aggregate data for Bar Chart
    const aggregatedData = [
        { name: "Pendapatan", Anggaran: 0, Realisasi: 0 },
        { name: "Belanja", Anggaran: 0, Realisasi: 0 },
        { name: "Pembiayaan", Anggaran: 0, Realisasi: 0 },
    ];

    data.forEach(item => {
        const target = aggregatedData.find(a => a.name === item.kategori);
        if (target) {
            target.Anggaran += item.anggaran;
            target.Realisasi += item.realisasi;
        }
    });

    const formatRupiah = (nominal: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(nominal);
    };

    const formatShorthand = (value: number) => {
        if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)} M`;
        if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)} Jt`;
        return `Rp ${value.toLocaleString()}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                    <p className="font-bold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} className="text-sm font-medium" style={{ color: entry.color }}>
                            {entry.name}: {formatRupiah(entry.value)}
                        </p>
                    ))}
                    {payload.length === 2 && payload[1].value > 0 && (
                        <p className="text-xs text-slate-500 mt-2 border-t pt-2">
                            Persentase: {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#0f766e', '#ea580c', '#3b82f6'];

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <ModernNavbar />

            {/* Hero Section */}
            <div className="bg-desa-primary text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Transparansi APBDes</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg leading-relaxed">
                        Wujud keterbukaan informasi publik tentang pengelolaan Anggaran Pendapatan dan Belanja Desa Sumberanyar.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20 w-full">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
                    
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Grafik Realisasi Anggaran</h2>
                            <p className="text-slate-500 text-sm">Perbandingan Anggaran vs Realisasi berdasarkan kategori</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-slate-700">Tahun:</label>
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                {availableYears.length > 0 ? (
                                    availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))
                                ) : (
                                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="h-64 flex items-center justify-center flex-col text-slate-500">
                            <p className="font-bold">Belum ada data APBDes untuk tahun {selectedYear}</p>
                            <p className="text-sm mt-1">Sistem sedang menunggu input dari Admin Keuangan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Main Bar Chart */}
                            <div className="lg:col-span-2 h-[450px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={aggregatedData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis dataKey="name" tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={formatShorthand} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                        <Bar dataKey="Anggaran" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                        <Bar dataKey="Realisasi" fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Summary Cards */}
                            <div className="space-y-4 flex flex-col justify-center">
                                {aggregatedData.map((item, index) => (
                                    <div key={item.name} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                                        <h3 className="font-bold text-slate-700 mb-3">{item.name}</h3>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-slate-500">Anggaran</span>
                                            <span className="text-sm font-bold text-slate-900">{formatRupiah(item.Anggaran)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">Realisasi</span>
                                            <span className={`text-sm font-bold ${item.name === 'Pendapatan' ? 'text-blue-600' : item.name === 'Belanja' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {formatRupiah(item.Realisasi)}
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full bg-slate-200 h-2 mt-3 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${item.Anggaran > 0 ? Math.min((item.Realisasi / item.Anggaran) * 100, 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModernFooter />
        </main>
    );
}
