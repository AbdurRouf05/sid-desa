"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { RekeningKasForm as RekeningKasFormType, RekeningKasSchema } from "@/lib/validations/bku";
import { FormInput } from "@/components/ui/form-input";
import { TactileButton } from "@/components/ui/tactile-button";
import { Save, ArrowLeft, Loader2, Wallet, Building2 } from "lucide-react";

interface RekeningKasFormProps {
    id?: string;
}

export function RekeningKasForm({ id }: RekeningKasFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RekeningKasFormType>({
        resolver: zodResolver(RekeningKasSchema),
        defaultValues: {
            jenis: "Tunai",
            nama_rekening: "",
        },
    });

    const watchJenis = watch("jenis");

    useEffect(() => {
        if (id) {
            const fetchRecord = async () => {
                try {
                    const record = await pb.collection("rekening_kas").getOne<RekeningKasFormType>(id);
                    setValue("nama_rekening", record.nama_rekening);
                    setValue("jenis", record.jenis);
                } catch (error) {
                    console.error("Error fetching", error);
                    alert("Data rekening tidak ditemukan!");
                    router.push("/panel/dashboard/bku/rekening");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecord();
        }
    }, [id, setValue, router]);

    const onSubmit = async (data: RekeningKasFormType) => {
        setIsSaving(true);
        try {
            if (id) {
                await pb.collection("rekening_kas").update(id, data);
            } else {
                await pb.collection("rekening_kas").create(data);
            }
            router.push("/panel/dashboard/bku/rekening");
            router.refresh();
        } catch (error: any) {
            console.error("Save error", error);
            alert("Gagal menyimpan data rekening. Pastikan nama tidak duplikat.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Memuat form rekening...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl ${watchJenis === 'Tunai' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {watchJenis === 'Tunai' ? <Wallet className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {id ? "Edit Master Rekening" : "Tambah Rekening Baru"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Pengaturan dompet penyimpan uang kelurahan.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-sm font-bold text-slate-700 block">
                            Tipe Saldo
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition-all ${watchJenis === 'Tunai' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input 
                                    type="radio" 
                                    value="Tunai" 
                                    className="hidden" 
                                    {...register("jenis")} 
                                />
                                <Wallet className={`w-8 h-8 ${watchJenis === 'Tunai' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <span className={`font-bold ${watchJenis === 'Tunai' ? 'text-emerald-700' : 'text-slate-600'}`}>Laci Tunai</span>
                            </label>
                            
                            <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition-all ${watchJenis === 'Bank' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input 
                                    type="radio" 
                                    value="Bank" 
                                    className="hidden" 
                                    {...register("jenis")} 
                                />
                                <Building2 className={`w-8 h-8 ${watchJenis === 'Bank' ? 'text-blue-500' : 'text-slate-400'}`} />
                                <span className={`font-bold ${watchJenis === 'Bank' ? 'text-blue-700' : 'text-slate-600'}`}>Rekening Bank</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <FormInput
                            label="Nama Rekening/Dompet"
                            placeholder={watchJenis === 'Tunai' ? "Contoh: Kas Kelurahan / Kas Kecil" : "Contoh: Bank Jatim (0123456789)"}
                            {...register("nama_rekening")}
                            error={errors.nama_rekening?.message}
                        />
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
                <TactileButton variant="primary" type="submit" disabled={isSaving} className="flex-1 justify-center">
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            Simpan Rekening
                        </>
                    )}
                </TactileButton>
            </div>
        </form>
    );
}
