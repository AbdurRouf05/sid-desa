"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { BkuTransactionForm as BkuTransactionFormType, BkuTransactionSchema } from "@/lib/validations/bku";
import { RekeningKas } from "@/types";
import { FormInput } from "@/components/ui/form-input";
import { TactileButton } from "@/components/ui/tactile-button";
import { Save, ArrowLeft, Loader2, ArrowDownCircle, ArrowUpCircle, RefreshCw, Upload, X, FileText, AlertCircle } from "lucide-react";
import { getSaldoRekening } from "@/lib/bku-utils";

interface RekeningKasWithSaldo extends RekeningKas {
    saldo?: number;
}

const formatLocalYYYYMMDD = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

interface BkuTransaksiFormProps {
    id?: string;
}

export function BkuTransaksiForm({ id }: BkuTransaksiFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rekeningList, setRekeningList] = useState<RekeningKasWithSaldo[]>([]);
    
    // File upload state for existing and new files
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BkuTransactionFormType>({
        resolver: zodResolver(BkuTransactionSchema),
        defaultValues: {
            tipe_transaksi: "Masuk",
            tanggal: formatLocalYYYYMMDD(new Date()),
            uraian: "",
            nominal: 0,
            rekening_sumber_id: "",
            rekening_tujuan_id: "",
        },
    });

    const watchTipe = watch("tipe_transaksi");
    const watchSumber = watch("rekening_sumber_id");
    const watchTujuan = watch("rekening_tujuan_id");
    const watchHasPajak = watch("has_pajak");

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch valid rekenings
                const rekenings = await pb.collection("rekening_kas").getFullList<RekeningKas>({
                    sort: "jenis,nama_rekening"
                });
                
                const rekeningsWithSaldo = await Promise.all(rekenings.map(async (rek) => {
                    const saldo = await getSaldoRekening(rek.id);
                    return { ...rek, saldo };
                }));

                setRekeningList(rekeningsWithSaldo);

                if (id) {
                    const record = await pb.collection("bku_transaksi").getOne<BkuTransactionFormType>(id);
                    setValue("tipe_transaksi", record.tipe_transaksi);
                    setValue("tanggal", record.tanggal.split(' ')[0]);
                    setValue("nominal", record.nominal);
                    setValue("uraian", record.uraian);
                    setValue("rekening_sumber_id", record.rekening_sumber_id || "");
                    setValue("rekening_tujuan_id", record.rekening_tujuan_id || "");
                    
                    if (record.bukti_file) {
                        setExistingFileUrl(pb.files.getUrl(record as any, record.bukti_file as string));
                    }
                }
            } catch (error) {
                console.error("Error fetching", error);
                alert("Gagal memuat data transaksi/rekening.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [id, setValue]);

    const nominal = watch("nominal") || 0;
    const sourceRekening = rekeningList.find(r => r.id === watchSumber);
    const overSpend = (watchTipe === "Keluar" || watchTipe === "Pindah Buku") && sourceRekening && (nominal > (sourceRekening.saldo || 0));

    // Auto calculate tax 11% if PPN is selected
    useEffect(() => {
        if (watchHasPajak && watch("jenis_pajak") === "PPN 11%") {
            const taxNominal = Math.round(nominal * 0.11);
            setValue("nominal_pajak", taxNominal, { shouldValidate: true });
        }
    }, [nominal, watchHasPajak, watch("jenis_pajak"), setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: BkuTransactionFormType) => {
        setIsSaving(true);
        const submitData = new FormData();

        submitData.append("tipe_transaksi", data.tipe_transaksi);
        submitData.append("tanggal", data.tanggal);
        submitData.append("uraian", data.uraian);
        submitData.append("nominal", String(data.nominal));

        if (data.tipe_transaksi === "Masuk" || data.tipe_transaksi === "Pindah Buku") {
            submitData.append("rekening_tujuan_id", data.rekening_tujuan_id || "");
        } else {
            submitData.append("rekening_tujuan_id", "");
        }

        if (data.tipe_transaksi === "Keluar" || data.tipe_transaksi === "Pindah Buku") {
            submitData.append("rekening_sumber_id", data.rekening_sumber_id || "");
        } else {
            submitData.append("rekening_sumber_id", "");
        }

        if (selectedFile) {
            submitData.append("bukti_file", selectedFile);
        }

        try {
            let savedRecord;
            if (id) {
                savedRecord = await pb.collection("bku_transaksi").update(id, submitData);
            } else {
                savedRecord = await pb.collection("bku_transaksi").create(submitData);
            }

            // --- Tax Log Integration ---
            if (data.tipe_transaksi === "Keluar" && data.has_pajak && data.jenis_pajak && data.nominal_pajak && data.nominal_pajak > 0) {
                // Check if tax log exists for this bku_id (in case of edit)
                try {
                    const existingTax = await pb.collection("pajak_log").getFirstListItem(`bku_id="${savedRecord.id}"`);
                    if (existingTax) {
                        await pb.collection("pajak_log").update(existingTax.id, {
                            jenis_pajak: data.jenis_pajak,
                            nominal_pajak: data.nominal_pajak,
                        });
                    }
                } catch (e) {
                    // Not found, create new
                    await pb.collection("pajak_log").create({
                        bku_id: savedRecord.id,
                        jenis_pajak: data.jenis_pajak,
                        nominal_pajak: data.nominal_pajak,
                        status: "Belum Disetor"
                    });
                }
            }

            // Remove tax if toggled off during edit
            if (id && data.tipe_transaksi === "Keluar" && !data.has_pajak) {
                try {
                    const existingTax = await pb.collection("pajak_log").getFirstListItem(`bku_id="${savedRecord.id}"`);
                    if (existingTax) await pb.collection("pajak_log").delete(existingTax.id);
                } catch (e) { /* ignore */ }
            }

            router.push("/panel/dashboard/bku/transaksi");
            router.refresh();
        } catch (error: any) {
            console.error("Save error", error);
            alert("Gagal menyimpan transaksi. Pastikan rekening sudah dipilih.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Memuat form transaksi...</div>;
    }

    if (rekeningList.length === 0) {
        return (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <p className="font-bold text-amber-800">Perhatian: Modul Kas Tidak Siap</p>
                <p className="text-amber-700 mt-1">Anda belum memiliki Rekening Kas apapun. Harap buat <b>Master Rekening Desa</b> terlebih dahulu sebelum mencatat transaksi.</p>
                <TactileButton variant="primary" className="mt-4" onClick={() => router.push("/panel/dashboard/bku/rekening/baru")}>
                    Buat Rekening Desa Sekarang
                </TactileButton>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl ${
                        watchTipe === 'Masuk' ? 'bg-emerald-100 text-emerald-600' : 
                        watchTipe === 'Keluar' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        {watchTipe === 'Masuk' && <ArrowDownCircle className="w-6 h-6" />}
                        {watchTipe === 'Keluar' && <ArrowUpCircle className="w-6 h-6" />}
                        {watchTipe === 'Pindah Buku' && <RefreshCw className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {id ? "Edit Log Buku Kas Umum" : "Catat Transaksi BKU Baru"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Rekam keluar masuknya dana ke dalam dompet pemerintahan desa secara terstruktur.
                        </p>
                    </div>
                </div>

                {errors.tipe_transaksi && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                        {errors.tipe_transaksi.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipe Transaksi */}
                    <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-sm font-bold text-slate-700 block">Jalur Arus Uang</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <label className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${watchTipe === 'Masuk' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" value="Masuk" className="hidden" {...register("tipe_transaksi")} />
                                <span className={`font-bold ${watchTipe === 'Masuk' ? 'text-emerald-700' : 'text-slate-600'}`}>Pemasukan / Uang Masuk</span>
                            </label>
                            <label className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${watchTipe === 'Keluar' ? 'border-red-500 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" value="Keluar" className="hidden" {...register("tipe_transaksi")} />
                                <span className={`font-bold ${watchTipe === 'Keluar' ? 'text-red-700' : 'text-slate-600'}`}>Pengeluaran / Uang Keluar</span>
                            </label>
                            <label className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${watchTipe === 'Pindah Buku' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" value="Pindah Buku" className="hidden" {...register("tipe_transaksi")} />
                                <span className={`font-bold ${watchTipe === 'Pindah Buku' ? 'text-blue-700' : 'text-slate-600'}`}>Pindah Buku Saldo</span>
                            </label>
                        </div>
                    </div>

                    {/* Routing Rekening */}
                    {(watchTipe === "Keluar" || watchTipe === "Pindah Buku") && (
                        <div className="col-span-1">
                            <label className="text-sm font-bold text-slate-700 block mb-1">
                                Rekening Asal (Sumber Dana)
                            </label>
                            <select 
                                {...register("rekening_sumber_id")} 
                                className="block w-full py-3 px-3 rounded-lg border-gray-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            >
                                <option value="">-- Pilih dompet potong --</option>
                                {rekeningList.map((rek) => (
                                    <option key={rek.id} value={rek.id} disabled={watchTipe === "Pindah Buku" && rek.id === watchTujuan}>
                                        {rek.nama_rekening} {rek.jenis === 'Bank' ? '(Bank)' : '(Tunai)'}
                                    </option>
                                ))}
                            </select>
                            {(watchSumber && sourceRekening) && (
                                <div className={`mt-2 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${overSpend ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                    <span>Sisa Saldo Kas:</span>
                                    <span>Rp {(sourceRekening.saldo || 0).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {(watchTipe === "Masuk" || watchTipe === "Pindah Buku") && (
                        <div className="col-span-1">
                            <label className="text-sm font-bold text-slate-700 block mb-1">
                                {watchTipe === "Masuk" ? "Disimpan Ke (Rekening Tujuan)" : "Dikirim Ke (Tujuan)"}
                            </label>
                            <select 
                                {...register("rekening_tujuan_id")} 
                                className="block w-full py-3 px-3 rounded-lg border-gray-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            >
                                <option value="">-- Pilih dompet penyimpanan --</option>
                                {rekeningList.map((rek) => (
                                    <option key={rek.id} value={rek.id} disabled={watchTipe === "Pindah Buku" && rek.id === watchSumber}>
                                        {rek.nama_rekening} {rek.jenis === 'Bank' ? '(Bank)' : '(Tunai)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Basic info */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <FormInput
                            label="Nominal (Rupiah)"
                            type="text"
                            numeric
                            currencyPrefix="Rp"
                            value={watch("nominal")?.toString() || ""}
                            onNumericChange={(val) => {
                                const num = parseInt(val, 10);
                                setValue("nominal", isNaN(num) ? 0 : num, { shouldValidate: true });
                            }}
                            error={errors.nominal?.message}
                        />
                        <FormInput
                            label="Tanggal Transaksi"
                            type="date"
                            {...register("tanggal")}
                            error={errors.tanggal?.message}
                        />
                    </div>

                    {/* Opsional Pajak Section */}
                    {watchTipe === "Keluar" && (
                        <div className="col-span-1 md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-2 transition-all">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    {...register("has_pajak")}
                                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                />
                                <span className="font-bold text-slate-700">Terdapat Potongan Pajak pada transaksi ini? (Titipan ke Kas)</span>
                            </label>
                            
                            {watchHasPajak && (
                                <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-1">Jenis Pemotongan Pajak</label>
                                        <select 
                                            {...register("jenis_pajak")}
                                            className="block w-full py-3 px-3 rounded-lg border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        >
                                            <option value="">-- Pilih Jenis Pajak --</option>
                                            <option value="PPN 11%">PPN 11%</option>
                                            <option value="PPh 21">PPh Pasal 21</option>
                                            <option value="PPh 22">PPh Pasal 22</option>
                                            <option value="PPh 23">PPh Pasal 23</option>
                                        </select>
                                    </div>
                                    <FormInput
                                        label="Nominal Pajak Disisihkan"
                                        type="text"
                                        numeric
                                        currencyPrefix="Rp"
                                        value={watch("nominal_pajak")?.toString() || ""}
                                        onNumericChange={(val) => {
                                            const num = parseInt(val, 10);
                                            setValue("nominal_pajak", isNaN(num) ? 0 : num, { shouldValidate: true });
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 block mb-1">
                            Uraian / Keterangan Keperluan
                        </label>
                        <textarea
                            {...register("uraian")}
                            placeholder="Contoh: Belanja alat tulis kantor RT 01 / Insentif bulanan"
                            className="block w-full p-4 rounded-xl border-gray-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            rows={3}
                        />
                        {errors.uraian && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.uraian.message}</span>}
                    </div>

                    {/* Nota File */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 block mb-1">
                            Upload Bukti Nota / Dokumen (Opsional)
                        </label>
                        
                        {(existingFileUrl || selectedFile) ? (
                            <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                                <FileText className="w-6 h-6 text-emerald-500" />
                                <span className="flex-1 font-medium truncate">
                                    {selectedFile ? selectedFile.name : 'Bukti file telah dilampirkan'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-1 hover:bg-emerald-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col flex-1 items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center">
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="text-sm font-medium text-slate-600">
                                    Klik untuk memilih file nota dari komputer
                                </span>
                                <span className="text-xs text-slate-400 mt-1">
                                    Format: JPG, PNG, atau PDF (Maks. 5MB)
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Batal
                </button>
                <div className="flex-1 flex flex-col items-end gap-2">
                    <TactileButton variant="primary" type="submit" disabled={isSaving || overSpend} className="w-full justify-center disabled:opacity-50">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Catat Ke Buku
                            </>
                        )}
                    </TactileButton>
                    {overSpend && (
                        <span className="text-red-500 font-medium text-xs flex items-center bg-red-50 px-2 py-1 rounded-md">
                            <AlertCircle className="w-3 h-3 mr-1" /> Tidak dapat menyimpan, saldo tidak mencukupi!
                        </span>
                    )}
                </div>
            </div>
        </form>
    );
}
