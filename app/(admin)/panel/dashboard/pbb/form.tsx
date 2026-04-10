"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { SectionHeading } from "@/components/ui/section-heading";
import { Save, ArrowLeft, Loader2, Calculator } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
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
        return <div className="p-8 text-center text-slate-500 flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Memuat form...</div>;
    }

    return (
        <main className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/panel/dashboard/pbb">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" type="button">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                </Link>
                <SectionHeading 
                    title={isEdit ? "Edit Catatan PBB" : "Tambah Tagihan PBB Warga"} 
                    subtitle="Kelola tagihan Pajak Bumi dan Bangunan berdasarkan setoran tiap dusun." 
                />
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* NOP */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nomor Objek Pajak (NOP) <span className="text-red-500">*</span></label>
                            <input
                                {...register("nop")}
                                placeholder="Contoh: 35.14.XXX..."
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono",
                                    errors.nop ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nop && <p className="text-red-500 text-xs">{errors.nop.message}</p>}
                        </div>

                        {/* Nama Wajib Pajak */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nama Wajib Pajak <span className="text-red-500">*</span></label>
                            <input
                                {...register("nama_wajib_pajak")}
                                placeholder="Nama sesuai SPPT PBB"
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nama_wajib_pajak ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nama_wajib_pajak && <p className="text-red-500 text-xs">{errors.nama_wajib_pajak.message}</p>}
                        </div>

                        {/* Dusun / Koordinator */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Dusun / Koordinator <span className="text-red-500">*</span></label>
                            <input
                                {...register("dusun_koordinator")}
                                placeholder="Cth: Dusun Krajan / Bpk. Rudi"
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.dusun_koordinator ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.dusun_koordinator && <p className="text-red-500 text-xs">{errors.dusun_koordinator.message}</p>}
                        </div>

                        {/* Nominal Tagihan */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nominal Pokok Pajak (Rp) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                {...register("nominal_tagihan")}
                                className={cn(
                                    "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    errors.nominal_tagihan ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.nominal_tagihan && <p className="text-red-500 text-xs">{errors.nominal_tagihan.message}</p>}
                        </div>

                    </div>

                    <div className="border-t border-slate-100 pt-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        {/* Status Pembayaran */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Status Pembayaran <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select 
                                    {...register("status_pembayaran")}
                                    className={cn(
                                        "w-full px-4 py-2.5 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all font-bold",
                                        statusPembayaran === "Lunas" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-white text-slate-700 border-slate-300"
                                    )}
                                >
                                    <option value="Belum Lunas">Belum Lunas</option>
                                    <option value="Lunas">Selesai / Lunas</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Tanggal Bayar */}
                        {statusPembayaran === "Lunas" && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Tanggal Bayar <span className="text-slate-400 font-normal">(Default hari ini)</span></label>
                                <input
                                    type="date"
                                    {...register("tanggal_bayar")}
                                    className={cn(
                                        "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white",
                                        "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                                    )}
                                />
                            </div>
                        )}

                        {/* Denda Keterlambatan - Hybrid */}
                        <div className="space-y-2 md:col-span-2 mt-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                <span>Denda Keterlambatan (Rp) <span className="text-slate-400 font-normal text-xs ml-1">(Bisa diedit manual)</span></span>
                                <button
                                    type="button"
                                    onClick={handleHitungDenda}
                                    className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors flex items-center"
                                >
                                    <Calculator className="w-3.5 h-3.5 mr-1" />
                                    Isi Otomatis (2%)
                                </button>
                            </label>
                            <input
                                type="number"
                                {...register("denda")}
                                placeholder="0"
                                className={cn(
                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-lg font-bold text-red-600 bg-white",
                                    errors.denda ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-500"
                                )}
                            />
                            {errors.denda && <p className="text-red-500 text-xs">{errors.denda.message}</p>}
                        </div>
                    </div>


                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-8">
                        <Link href="/panel/dashboard/pbb">
                            <TactileButton variant="secondary" type="button" disabled={isLoading}>
                                Batal
                            </TactileButton>
                        </Link>
                        <TactileButton variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Catatan PBB
                                </>
                            )}
                        </TactileButton>
                    </div>
                </form>
            </div>
        </main>
    );
}
