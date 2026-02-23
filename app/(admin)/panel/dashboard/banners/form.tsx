"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { TactileButton } from "@/components/ui/tactile-button";
import { Loader2, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/cdn";
import { SmartLinkInput } from "@/components/admin/smart-link-input";

interface BannerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function BannerForm({ initialData, isEdit = false }: BannerFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // File states
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string>(
        initialData?.image_desktop ? getAssetUrl(initialData, initialData.image_desktop) :
            (initialData?.image ? getAssetUrl(initialData, initialData.image) : "") // Fallback to legacy 'image'
    );

    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string>(initialData?.image_mobile ? getAssetUrl(initialData, initialData.image_mobile) : "");

    const [foregroundFile, setForegroundFile] = useState<File | null>(null);
    const [foregroundPreviewUrl, setForegroundPreviewUrl] = useState<string>(initialData?.foreground_image ? getAssetUrl(initialData, initialData.foreground_image) : "");

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            subtitle: initialData?.subtitle || "",
            cta_text: initialData?.cta_text || "",
            cta_link: initialData?.cta_link || "",
            order: initialData?.order || 0,
            bg_class: initialData?.bg_class || "bg-emerald-900",
            active: initialData?.active ?? true,
        }
    });

    const handleDesktopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setDesktopFile(file);
            setDesktopPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMobileFile(file);
            setMobilePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setForegroundFile(file);
            setForegroundPreviewUrl(URL.createObjectURL(file));
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
            formData.append("bg_class", data.bg_class);
            formData.append("active", data.active);

            if (desktopFile) {
                formData.append("image_desktop", desktopFile);
            }

            if (mobileFile) {
                formData.append("image_mobile", mobileFile);
            }

            if (foregroundFile) {
                formData.append("foreground_image", foregroundFile);
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
            {/* ... (Header) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Background Image Desktop */}
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Banner Background (Desktop / Landscape)</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group h-64 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDesktopChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                />
                                {desktopPreviewUrl ? (
                                    <div className="relative z-10 w-full h-full">
                                        <img src={desktopPreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                                        <p className="text-xs text-slate-500 mt-2 absolute bottom-2 left-0 right-0 bg-white/80 py-1">Klik untuk ganti</p>
                                    </div>
                                ) : (
                                    <div className="z-10">
                                        <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">Desktop Background</p>
                                        <p className="text-xs text-slate-400">1920x1080px (Landscape)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Image Mobile */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Banner Background (Mobile / Portrait)</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group h-64 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMobileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                />
                                {mobilePreviewUrl ? (
                                    <div className="relative z-10 w-full h-full">
                                        <img src={mobilePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                                        <p className="text-xs text-slate-500 mt-2 absolute bottom-2 left-0 right-0 bg-white/80 py-1">Klik untuk ganti</p>
                                    </div>
                                ) : (
                                    <div className="z-10">
                                        <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">Mobile Background</p>
                                        <p className="text-xs text-slate-400">1080x1920px (Portrait)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Foreground Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Gambar Depan / Ilustrasi (Opsional) - Auto Responsive</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group h-64 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleForegroundChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                />
                                {foregroundPreviewUrl ? (
                                    <div className="relative z-10 w-full h-full">
                                        <img src={foregroundPreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg shadow-sm" />
                                        <p className="text-xs text-slate-500 mt-2 absolute bottom-2 left-0 right-0 bg-white/80 py-1">Klik untuk ganti</p>
                                    </div>
                                ) : (
                                    <div className="z-10">
                                        <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">Foreground / Orang</p>
                                        <p className="text-xs text-slate-400">PNG Transparan</p>
                                    </div>
                                )}
                            </div>
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
                            <Controller
                                name="cta_link"
                                control={control}
                                render={({ field }) => (
                                    <SmartLinkInput value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Display</label>
                            <input type="number" {...register("order")} className="w-full p-2 border rounded-lg" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Warna Background (Overlay)</label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { value: "bg-emerald-900", label: "Emerald Dark", color: "bg-emerald-900" },
                                    { value: "bg-emerald-800", label: "Emerald Medium", color: "bg-emerald-800" },
                                    { value: "bg-slate-900", label: "Midnight Slate", color: "bg-slate-900" },
                                    { value: "bg-blue-900", label: "Royal Blue", color: "bg-blue-900" },
                                    { value: "original", label: "Original (No Overlay)", color: "bg-slate-200" },
                                ].map((option) => (
                                    <label key={option.value} className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register("bg_class")}
                                            className="peer sr-only"
                                        />
                                        <div className="p-3 rounded-xl border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all flex flex-col items-center gap-2 text-center h-full">
                                            <div className={`w-8 h-8 rounded-full ${option.color} shadow-sm border border-black/10`}></div>
                                            <span className="text-xs font-medium text-slate-700 peer-checked:text-emerald-800">{option.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center pt-4">
                            <label className="flex items-center cursor-pointer gap-3 select-none">
                                <input type="checkbox" {...register("active")} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                                <span className="text-slate-700 font-medium">Publikasikan (Aktif)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <TactileButton type="submit" disabled={isSaving} className="w-48 flex items-center justify-center gap-2">
                            {isSaving ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    <span className="font-bold">Simpan Banner</span>
                                </div>
                            )}
                        </TactileButton>
                    </div>

                </form>
            </div>
        </div>
    );
}
