"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { TanahDesa, TanahDesaSchema } from "@/lib/validations/aset";
import { FormInput } from "@/components/ui/form-input";
import { TactileButton } from "@/components/ui/tactile-button";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

interface TanahDesaFormProps {
    initialData?: (TanahDesa & { id: string }) | null;
}

export function TanahDesaForm({ initialData }: TanahDesaFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TanahDesa>({
        resolver: zodResolver(TanahDesaSchema),
        defaultValues: {
            lokasi: "",
            luas_m2: 0,
            peruntukan: "",
            pemegang_hak: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                lokasi: initialData.lokasi,
                luas_m2: initialData.luas_m2,
                peruntukan: initialData.peruntukan || "",
                pemegang_hak: initialData.pemegang_hak || ""
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: TanahDesa) => {
        setIsSaving(true);
        try {
            if (initialData?.id) {
                await pb.collection("tanah_desa").update(initialData.id, data);
            } else {
                await pb.collection("tanah_desa").create(data);
            }
            router.push("/panel/dashboard/aset/tanah");
            router.refresh();
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error?.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-3xl">
            <div className="mb-6">
                <Link href="/panel/dashboard/aset/tanah" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Aset Tanah
                </Link>
                <SectionHeading 
                    title={initialData ? "Edit Data Tanah" : "Tambah Data Tanah"} 
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <FormInput
                            label="Lokasi Tanah"
                            {...register("lokasi")}
                            error={errors.lokasi?.message}
                            placeholder="Contoh: Dusun Krajan / Blok Sawah Lor"
                        />
                    </div>
                    <div>
                        <FormInput
                            label="Luas (m²)"
                            type="number"
                            {...register("luas_m2", { valueAsNumber: true })}
                            error={errors.luas_m2?.message}
                            placeholder="Contoh: 1500"
                        />
                    </div>
                    <div>
                        <FormInput
                            label="Peruntukan / Penggunaan"
                            {...register("peruntukan")}
                            error={errors.peruntukan?.message}
                            placeholder="Contoh: Fasilitas Umum / Tanah Kas Desa"
                        />
                    </div>
                    <div>
                        <FormInput
                            label="Pemegang Hak / Bukti Kepemilikan"
                            {...register("pemegang_hak")}
                            error={errors.pemegang_hak?.message}
                            placeholder="Contoh: Pemerintah Desa / SHM No. 123"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <TactileButton type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Simpan Data
                    </TactileButton>
                </div>
            </form>
        </main>
    );
}
