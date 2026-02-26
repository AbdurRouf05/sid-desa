"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pb } from "@/lib/pb";
import { InventarisDesaForm as InventarisDesa, InventarisDesaSchema } from "@/lib/validations/aset";
import { FormInput } from "@/components/ui/form-input";
import { TactileButton } from "@/components/ui/tactile-button";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

interface InventarisFormProps {
    initialData?: (InventarisDesa & { id: string }) | null;
}

export function InventarisForm({ initialData }: InventarisFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<InventarisDesa>({
        resolver: zodResolver(InventarisDesaSchema),
        defaultValues: {
            nama_barang: "",
            kategori: "Mebel",
            tahun_perolehan: new Date().getFullYear(),
            kuantitas: 1,
            kondisi: "Baik"
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                nama_barang: initialData.nama_barang,
                kategori: initialData.kategori,
                tahun_perolehan: initialData.tahun_perolehan,
                kuantitas: initialData.kuantitas,
                kondisi: initialData.kondisi
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: InventarisDesa) => {
        setIsSaving(true);
        try {
            if (initialData?.id) {
                await pb.collection("inventaris_desa").update(initialData.id, data);
            } else {
                await pb.collection("inventaris_desa").create(data);
            }
            router.push("/panel/dashboard/aset/inventaris");
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
                <Link href="/panel/dashboard/aset/inventaris" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Inventaris Barang
                </Link>
                <SectionHeading 
                    title={initialData ? "Edit Kondisi Aset" : "Tambah Inventaris Baru"} 
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <FormInput
                            label="Nama Aset / Barang"
                            {...register("nama_barang")}
                            error={errors.nama_barang?.message}
                            placeholder="Contoh: Laptop Acer Balai Desa"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Kategori Aset</label>
                            <select 
                                {...register("kategori")}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            >
                                <option value="Bangunan">Bangunan / Gedung</option>
                                <option value="Kendaraan">Kendaraan Dinas</option>
                                <option value="Elektronik">Elektronik / IT</option>
                                <option value="Mebel">Mebel / Furnitur</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            {errors.kategori && <p className="text-red-500 text-xs mt-1 absolute font-medium">{errors.kategori.message}</p>}
                        </div>
                        <div>
                            <FormInput
                                label="Tahun Perolehan"
                                type="number"
                                {...register("tahun_perolehan", { valueAsNumber: true })}
                                error={errors.tahun_perolehan?.message}
                                placeholder={`Contoh: ${new Date().getFullYear()}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormInput
                                label="Kuantitas (Unit / Buah)"
                                type="number"
                                {...register("kuantitas", { valueAsNumber: true })}
                                error={errors.kuantitas?.message}
                                placeholder="Contoh: 10"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Kondisi Saat Ini</label>
                            <select 
                                {...register("kondisi")}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                            >
                                <option value="Baik" className="text-emerald-700">Baik</option>
                                <option value="Rusak Ringan" className="text-amber-700">Rusak Ringan</option>
                                <option value="Rusak Berat" className="text-red-700">Rusak Berat</option>
                                <option value="Dihapus/Lelang" className="text-slate-500">Dihapus / Lelang</option>
                            </select>
                            {errors.kondisi && <p className="text-red-500 text-xs mt-1 absolute font-medium">{errors.kondisi.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <TactileButton type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Simpan Aset
                    </TactileButton>
                </div>
            </form>
        </main>
    );
}
