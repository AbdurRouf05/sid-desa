"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { Save, ArrowLeft, Loader2, Calculator, CreditCard, User, MapPin, Activity, Calendar } from "lucide-react";
import Link from "next/link";
import { PbbSchema, PbbData } from "@/lib/validations/pbb";
import { cn } from "@/lib/utils";
import { PbbWarga } from "@/types";

export default function PbbFormPage({ isEdit = false, params }: { isEdit?: boolean, params?: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PbbData>({
        resolver: zodResolver(PbbSchema) as any,
        defaultValues: {
            status_pembayaran: "Belum Lunas",
            denda: 0,
            tanggal_bayar: "",
        }
    });

    const nominalTagihan = watch("nominal_tagihan");
    const statusPembayaran = watch("status_pembayaran");

    useEffect(() => {
        const fetchRecord = async () => {
            if (isEdit && params?.id) {
                try {
                    const record = await pb.collection("pbb_warga").getOne<PbbWarga>(params.id);
                    setValue("nop", record.nop);
                    setValue("nama_wajib_pajak", record.nama_wajib_pajak);
                    setValue("dusun_koordinator", record.dusun_koordinator);
                    setValue("nominal_tagihan", record.nominal_tagihan);
                    setValue("status_pembayaran", record.status_pembayaran);
                    setValue("denda", record.denda || 0);
                    if (record.tanggal_bayar) {
                        setValue("tanggal_bayar", record.tanggal_bayar.split(' ')[0]);
                    }
                } catch (error) {
                    console.error("Error fetching record:", error);
                    alert("Data tidak ditemukan.");
                    router.push("/panel/dashboard/pbb");
                } finally {
                    setPageLoading(false);
                }
            }
        };

        fetchRecord();
    }, [isEdit, params?.id, setValue, router]);

    // Handle Auto Denda 2%
    const handleHitungDenda = () => {
        if (!nominalTagihan) return;
        const autoDenda = Math.floor(nominalTagihan * 0.02); // 2% 
        setValue("denda", autoDenda, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data: PbbData) => {
        setIsLoading(true);
        try {
            const submitData = {
                ...data,
                tanggal_bayar: data.status_pembayaran === "Lunas" && data.tanggal_bayar 
                    ? new Date(data.tanggal_bayar).toISOString() 
                    : (data.status_pembayaran === "Lunas" ? new Date().toISOString() : "")
            };

            if (isEdit && params?.id) {
                await pb.collection("pbb_warga").update(params.id, submitData);
            } else {
                await pb.collection("pbb_warga").create(submitData);
            }
            router.push("/panel/dashboard/pbb");
        } catch (error: any) {
            console.error("Error saving data", error);
            alert(`Gagal menyimpan data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Memuat formulir...</p>
            </div>
        );
    }

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Clean Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/pbb"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Catatan PBB" : "Catat Setoran PBB"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Kelola tagihan Pajak Bumi dan Bangunan berdasarkan setoran tiap dusun.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        Simpan Catatan
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content - Substantive Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section: Identitas Objek & Subjek Pajak */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas Objek & Subjek</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* NOP */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <CreditCard className="w-3 h-3" /> Nomor Objek Pajak (NOP)
                                    </label>
                                    <input
                                        {...register("nop")}
                                        placeholder="Contoh: 35.14.XXX..."
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-mono font-bold"
                                    />
                                    {errors.nop && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nop.message}</p>}
                                </div>

                                {/* Nama Wajib Pajak */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <User className="w-3 h-3" /> Nama Wajib Pajak
                                    </label>
                                    <input
                                        {...register("nama_wajib_pajak")}
                                        placeholder="Sesuai SPPT PBB"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold placeholder:font-normal uppercase tracking-wide"
                                    />
                                    {errors.nama_wajib_pajak && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nama_wajib_pajak.message}</p>}
                                </div>

                                {/* Dusun / Koordinator */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <MapPin className="w-3 h-3" /> Dusun / Koordinator
                                    </label>
                                    <input
                                        {...register("dusun_koordinator")}
                                        placeholder="Cth: Dusun Krajan / Bpk. Rudi"
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold placeholder:font-normal"
                                    />
                                    {errors.dusun_koordinator && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.dusun_koordinator.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Rincian Tagihan */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Rincian Pokok Tagihan</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nominal Pokok Pajak (Rp)</label>
                                <input
                                    type="number"
                                    {...register("nominal_tagihan")}
                                    className="w-full px-5 py-4 bg-emerald-50/20 border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-mono font-bold text-emerald-700"
                                    placeholder="0"
                                />
                                {errors.nominal_tagihan && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.nominal_tagihan.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Status & Action */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-6">
                            <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-4">
                                <div className={cn(
                                    "p-2 rounded-xl transition-all",
                                    statusPembayaran === "Lunas" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                )}>
                                    <Activity className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Status Setoran</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilih Status</label>
                                    <select 
                                        {...register("status_pembayaran")}
                                        className={cn(
                                            "w-full px-5 py-3 border rounded-xl appearance-none focus:outline-none transition-all font-bold text-sm",
                                            statusPembayaran === "Lunas" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-white text-slate-700 border-slate-300"
                                        )}
                                    >
                                        <option value="Belum Lunas">BELUM LUNAS</option>
                                        <option value="Lunas">LUNAS / SELESAI</option>
                                    </select>
                                </div>

                                {statusPembayaran === "Lunas" && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <Calendar className="w-3 h-3" /> Tanggal Bayar
                                        </label>
                                        <input
                                            type="date"
                                            {...register("tanggal_bayar")}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Denda Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                                        <Calculator className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Denda</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleHitungDenda}
                                    className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-100 shadow-sm flex items-center gap-1 active:scale-95"
                                >
                                    Auto 2%
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nominal Denda</label>
                                <input
                                    type="number"
                                    {...register("denda")}
                                    placeholder="0"
                                    className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-lg font-mono font-bold text-red-600"
                                />
                                {errors.denda && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 tracking-tight">{errors.denda.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
