"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { TactileButton } from "@/components/ui/tactile-button";
import { Loader2, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/cdn";

interface BannerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function BannerForm({ initialData, isEdit = false }: BannerFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // File states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image ? getAssetUrl(initialData, initialData.image) : "");

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            subtitle: initialData?.subtitle || "",
            cta_text: initialData?.cta_text || "",
            cta_link: initialData?.cta_link || "",
            order: initialData?.order || 0,
            active: initialData?.active ?? true, // Default true
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("subtitle", data.subtitle);
            formData.append("cta_text", data.cta_text);
            formData.append("cta_link", data.cta_link);
            formData.append("order", data.order);
            formData.append("active", data.active);

            if (imageFile) {
                formData.append("image", imageFile);
                // Also setting desktop/mobile image to same for now to satisfy potential checks
                // In future can add separate inputs
            }

            if (isEdit && initialData?.id) {
                await pb.collection('hero_banners').update(initialData.id, formData);
                alert("Banner diperbarui!");
            } else {
                await pb.collection('hero_banners').create(formData);
                alert("Banner dibuat!");
            }

            router.push("/panel/dashboard/banners");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan banner.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/panel/dashboard/banners" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEdit ? "Edit Banner" : "Tambah Banner Baru"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Banner Image (Landscape)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                            />
                            {previewUrl ? (
                                <div className="relative z-10">
                                    <img src={previewUrl} alt="Preview" className="h-48 mx-auto object-cover rounded-lg shadow-sm" />
                                    <p className="text-xs text-slate-500 mt-2">Klik untuk ganti gambar</p>
                                </div>
                            ) : (
                                <div className="py-8 z-10">
                                    <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-500">Drag & drop atau klik untuk upload</p>
                                    <p className="text-xs text-slate-400 mt-1">Rekomendasi: 1920x1080px (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama (Headline)</label>
                            <input {...register("title", { required: true })} className="w-full p-2 border rounded-lg" placeholder="Contoh: Promo Haji 2026" />
                            {errors.title && <span className="text-xs text-red-500">Wajib diisi</span>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul (Opsional)</label>
                            <textarea {...register("subtitle")} className="w-full p-2 border rounded-lg h-20" placeholder="Deskripsi singkat..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol (CTA)</label>
                            <input {...register("cta_text")} className="w-full p-2 border rounded-lg" placeholder="Selengkapnya" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Link Tombol</label>
                            <input {...register("cta_link")} className="w-full p-2 border rounded-lg" placeholder="/produk/haji" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Display</label>
                            <input type="number" {...register("order")} className="w-full p-2 border rounded-lg" />
                        </div>

                        <div className="flex items-center pt-8">
                            <label className="flex items-center cursor-pointer gap-3 select-none">
                                <input type="checkbox" {...register("active")} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                                <span className="text-slate-700 font-medium">Publikasikan (Aktif)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <TactileButton type="submit" disabled={isSaving} className="w-48">
                            {isSaving ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : <><Save className="w-4 h-4 mr-2" /> Simpan Banner</>}
                        </TactileButton>
                    </div>

                </form>
            </div>
        </div>
    );
}
