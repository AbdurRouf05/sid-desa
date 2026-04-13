"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { 
    Save, ArrowLeft, Loader2, ArrowDownCircle, ArrowUpCircle, 
    RefreshCw, Wallet, Calendar, FileText, Plus, X, 
    Calculator, Receipt, Info, ShieldCheck, Activity
} from "lucide-react";
import { BkuTransaksi, RekeningKas } from "@/types";
import { BkuTransaksiSchema, BkuTransaksiData } from "@/lib/validations/bku";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BkuFormProps {
    initialData?: BkuTransaksi | null;
}

export function BkuTransaksiForm({ initialData }: BkuFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [rekenings, setRekenings] = useState<RekeningKas[]>([]);
    
    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<BkuTransaksiData>({
        resolver: zodResolver(BkuTransaksiSchema),
        defaultValues: {
            tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
            uraian: initialData?.uraian || "",
            tipe_transaksi: initialData?.tipe_transaksi || "Masuk",
            nominal: initialData?.nominal || 0,
            rekening_sumber_id: initialData?.rekening_sumber_id || "",
            rekening_tujuan_id: initialData?.rekening_tujuan_id || "",
            pajak_logs: {
                pph21: 0,
                pph22: 0,
                pph23: 0,
                ppn: 0
            }
        }
    });

    const tipe = watch("tipe_transaksi");
    const nominal = watch("nominal");
    const pajakLogs = watch("pajak_logs");

    // Total Pajak calculation
    const totalPajakCalculated = useMemo(() => {
        if (!pajakLogs) return 0;
        return (pajakLogs.pph21 || 0) + (pajakLogs.pph22 || 0) + (pajakLogs.pph23 || 0) + (pajakLogs.ppn || 0);
    }, [pajakLogs]);

    useEffect(() => {
        const fetchRekenings = async () => {
            try {
                const records = await pb.collection("rekening_kas").getFullList<RekeningKas>({
                    sort: "nama_rekening",
                });
                setRekenings(records);
            } catch (error) {
                console.error("Error fetching rekenings", error);
            }
        };
        fetchRekenings();
    }, []);

    const onSubmit = async (data: BkuTransaksiData) => {
        setIsLoading(true);
        try {
            let record;
            if (initialData?.id) {
                record = await pb.collection("bku_transaksi").update(initialData.id, data);
            } else {
                record = await pb.collection("bku_transaksi").create(data);
            }

            // Sync Pajak logs if exists
            const existingPajak = await pb.collection("pajak_log").getFullList({ filter: `bku_id = "${record.id}"` });
            await Promise.all(existingPajak.map(p => pb.collection("pajak_log").delete(p.id)));

            const tasks = [];
            if (data.pajak_logs.pph21 > 0) tasks.push(pb.collection("pajak_log").create({ bku_id: record.id, jenis_pajak: "PPh 21", nominal_pajak: data.pajak_logs.pph21, status: "Belum Disetor" }));
            if (data.pajak_logs.pph22 > 0) tasks.push(pb.collection("pajak_log").create({ bku_id: record.id, jenis_pajak: "PPh 22", nominal_pajak: data.pajak_logs.pph22, status: "Belum Disetor" }));
            if (data.pajak_logs.pph23 > 0) tasks.push(pb.collection("pajak_log").create({ bku_id: record.id, jenis_pajak: "PPh 23", nominal_pajak: data.pajak_logs.pph23, status: "Belum Disetor" }));
            if (data.pajak_logs.ppn > 0) tasks.push(pb.collection("pajak_log").create({ bku_id: record.id, jenis_pajak: "PPN", nominal_pajak: data.pajak_logs.ppn, status: "Belum Disetor" }));
            
            await Promise.all(tasks);

            router.push("/panel/dashboard/bku/transaksi");
            router.refresh();
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Integrated Header (Bansos Reference) */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/bku/transaksi"
                            className="p-2.5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {initialData ? "Koreksi Jurnal Umum" : "Pencatatan BKU Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Input mutasi kas masuk, keluar, atau pindah buku antar rekening desa.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        Simpan Jurnal Kas
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Input Column (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Header Transaksi */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Inisialisasi Transaksi</h3>
                            </div>

                            <div className="space-y-8">
                                {/* Tipe Selector (Premium Radio Buttons) */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Arus Sirkulasi Uang</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { id: 'Masuk', icon: ArrowDownCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                            { id: 'Keluar', icon: ArrowUpCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                                            { id: 'Pindah Buku', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    setValue("tipe_transaksi", item.id as any);
                                                    if (item.id === 'Masuk') setValue("rekening_sumber_id", "");
                                                    if (item.id === 'Keluar') setValue("rekening_tujuan_id", "");
                                                }}
                                                className={cn(
                                                    "relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all active:scale-95 group overflow-hidden",
                                                    tipe === item.id 
                                                        ? `${item.bg} ${item.border} border-current shadow-lg shadow-slate-100` 
                                                        : "bg-white border-slate-100 hover:border-slate-300 text-slate-400"
                                                )}
                                            >
                                                <item.icon className={cn("w-5 h-5 transition-transform", tipe === item.id && "scale-110 rotate-12")} />
                                                <span className={cn("text-[11px] font-black uppercase tracking-widest", tipe === item.id && "text-slate-900")}>
                                                    {item.id}
                                                </span>
                                                {tipe === item.id && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-md font-black">ACTIVE</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tanggal Transaksi</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                {...register("tanggal")}
                                                className="w-full h-12 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold"
                                            />
                                            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Nominal Transaksi (Gross)</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">RP</div>
                                            <input
                                                type="number"
                                                {...register("nominal", { valueAsNumber: true })}
                                                className="w-full h-12 pl-12 pr-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-black"
                                                placeholder="0"
                                            />
                                        </div>
                                        {errors.nominal && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.nominal.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Detail Jurnal */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <LayoutGrid className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Detail & Klasifikasi Rekening</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Uraian / Keterangan Transaksi</label>
                                    <textarea
                                        {...register("uraian")}
                                        rows={3}
                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-tight"
                                        placeholder="CONTOH: PEMBAYARAN HONOR PERANGKAT DESA BULAN MEI"
                                    />
                                    {errors.uraian && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.uraian.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(tipe === 'Keluar' || tipe === 'Pindah Buku') && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Rekening Sumber (DEBET)</label>
                                            <select
                                                {...register("rekening_sumber_id")}
                                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                                            >
                                                <option value="">-- PILIH REKENING --</option>
                                                {rekenings.map(r => <option key={r.id} value={r.id}>{r.nama_rekening} ({r.jenis})</option>)}
                                            </select>
                                            {errors.rekening_sumber_id && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.rekening_sumber_id.message}</p>}
                                        </div>
                                    )}

                                    {(tipe === 'Masuk' || tipe === 'Pindah Buku') && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Rekening Tujuan (KREDIT)</label>
                                            <select
                                                {...register("rekening_tujuan_id")}
                                                className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                                            >
                                                <option value="">-- PILIH REKENING --</option>
                                                {rekenings.map(r => <option key={r.id} value={r.id}>{r.nama_rekening} ({r.jenis})</option>)}
                                            </select>
                                            {errors.rekening_tujuan_id && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{errors.rekening_tujuan_id.message}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Pajak Integration Section */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Potongan / Titipan Pajak (Log Pajak)</h3>
                            </div>

                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-8 leading-relaxed">
                                Jika transaksi ini mengandung potongan pajak, masukkan nilai nominal pada masing-masing kolom di bawah. Sistem akan otomatis mencatatnya dalam Buku Pembantu Pajak.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {["pph21", "pph22", "pph23", "ppn"].map((p) => (
                                    <div key={p} className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{p.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            {...register(`pajak_logs.${p}` as any, { valueAsNumber: true })}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-amber-500 outline-none transition-all text-xs font-mono font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Summary Column (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Final Balance Recap */}
                        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-950/20 relative overflow-hidden group border border-white/5">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all duration-700" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/10 text-white rounded-xl">
                                        <Calculator className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Ringkasan Nilai Jurnal</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Nilai Gross</span>
                                        <span className="text-sm font-black font-mono">Rp {nominal?.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Total Pajak</span>
                                        <span className="text-sm font-black font-mono text-amber-400">- Rp {totalPajakCalculated.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest block mb-2">Nilai Netto (Aliran Kas Sebenarnya)</span>
                                        <span className="text-2xl font-black font-mono text-emerald-400">Rp {(nominal - totalPajakCalculated).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest leading-relaxed">
                                        Jurnal akan diverifikasi secara otomatis oleh sistem saat disimpan untuk memastikan integritas buku besar.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audit Log Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Info className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Digital Audit Trail</h3>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                Setiap perubahan pada jurnal kas umum akan dicatat dalam riwayat riwayat sistem untuk keperluan audit transparansi pemerintahan desa.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

function LayoutGrid(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}
