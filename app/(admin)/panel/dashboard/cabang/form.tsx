"use client";

import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import Link from "next/link";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface BranchFormProps {
    initialData?: any;
    isEdit?: boolean;
}

// Helper: Transform various Google Maps links to Embed URL
function transformMapUrl(input: string): string {
    if (!input) return "";

    // 1. If iframe code, extract src
    if (input.includes("<iframe") && input.includes("src=")) {
        const srcMatch = input.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) return srcMatch[1];
    }

    // 2. If already an embed iframe src, return as is
    if (input.includes("google.com/maps/embed") || input.includes("output=embed")) {
        return input;
    }

    // 3. Try to extract Lat/Lng from various Google Maps formats
    // @lat,lng
    const atMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
        const [_, lat, lng] = atMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // q=lat,lng or ll=lat,lng
    const qMatch = input.match(/[?&](q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
        const [_, __, lat, lng] = qMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // search/lat,lng
    const searchMatch = input.match(/search\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (searchMatch) {
        const [_, lat, lng] = searchMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // Fallback: Return original
    return input;
}

export function BranchForm({ initialData, isEdit }: BranchFormProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: initialData?.name || "",
            type: initialData?.type || "Cabang",
            address: initialData?.address || "",
            phone_wa: initialData?.phone_wa || "",
            map_link: initialData?.map_link || "",
            sort_order: initialData?.sort_order || 0,
            is_active: initialData?.is_active ?? true,
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            // Apply Smart Transform to map_link before saving
            if (data.map_link) {
                data.map_link = transformMapUrl(data.map_link);
            }

            if (isEdit && initialData?.id) {
                await pb.collection('branches').update(initialData.id, data);
                alert("Kantor cabang diperbarui!");
            } else {
                await pb.collection('branches').create(data);
                alert("Kantor cabang ditambahkan!");
            }
            router.push("/panel/dashboard/cabang");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/panel/dashboard/cabang" className="text-slate-500 hover:text-emerald-600 flex items-center gap-2 mb-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEdit ? "Edit Kantor Cabang" : "Tambah Kantor Cabang"}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">

                {/* Nama & Tipe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nama Kantor *</label>
                        <input
                            {...register("name", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Contoh: Cabang Pasirian"
                        />
                        {errors.name && <span className="text-xs text-red-500">Wajib diisi</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Tipe Kantor *</label>
                        <select
                            {...register("type")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="Pusat">Pusat</option>
                            <option value="Cabang">Cabang</option>
                            <option value="Kas">Kas</option>
                        </select>
                    </div>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Alamat Lengkap *</label>
                    <textarea
                        {...register("address", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                        placeholder="Alamat lengkap kantor..."
                    />
                    {errors.address && <span className="text-xs text-red-500">Wajib diisi</span>}
                </div>

                {/* Kontak & Maps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nomor Telepon / WA</label>
                        <input
                            {...register("phone_wa")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="0812-3456-7890"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Link Google Maps / Embed URL <span className="text-emerald-600 text-xs font-normal bg-emerald-50 px-2 py-0.5 rounded-full">Baru: Bisa paste Link Google Maps biasa!</span></label>
                        <div className="relative">
                            <input
                                {...register("map_link", {
                                    onChange: (e) => {
                                        // Smart Paste: If user pastes an iframe code, extract the src automatically
                                        const val = e.target.value;
                                        if (val.includes("<iframe") && val.includes("src=")) {
                                            const srcMatch = val.match(/src="([^"]+)"/);
                                            if (srcMatch && srcMatch[1]) {
                                                // Update field value to just the URL
                                                e.target.value = srcMatch[1];
                                                // Need to trigger react-hook-form update
                                                register("map_link").onChange(e);
                                            }
                                        }
                                    }
                                })}
                                className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="Paste link Google Maps (https://maps.app.goo.gl/...) atau Embed code"
                            />
                            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <p className="text-[10px] text-slate-400 mt-1">Sistem otomatis mendeteksi Lokasi dan membuat Pin jika Anda copas link dari Google Maps.</p>
                        </div>
                    </div>
                </div>

                {/* Map Preview */}
                <div className="rounded-lg overflow-hidden border border-slate-200 h-64 bg-slate-50 relative group">
                    {/* Logic: If map_link is an embed URL, use it. Else use Search Embed based on name/address */}
                    <iframe
                        width="100%"
                        height="100%"
                        src={(() => {
                            const link = useWatch({ control, name: "map_link" });
                            const name = useWatch({ control, name: "name" });
                            const address = useWatch({ control, name: "address" });

                            // 1. Try to transform the link (Smart Logic)
                            const transformed = transformMapUrl(link || "");
                            if (transformed && (transformed.includes("embed") || transformed.includes("output=embed"))) {
                                return transformed;
                            }

                            // 2. Fallback: Generate Search Embed based on Name + Address
                            return `https://maps.google.com/maps?q=${encodeURIComponent((name || "") + " " + (address || "") + " Pasuruan")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        })()}
                        className="absolute inset-0"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="Map Preview"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs rounded shadow text-slate-500 pointer-events-none group-hover:hidden transition-opacity">
                        Preview Lokasi
                    </div>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-700">
                    <div className="shrink-0 mt-0.5">ℹ️</div>
                    <div>
                        <span className="font-semibold block mb-1">Catatan Pengaturan Kantor Pusat</span>
                        Data yang diubah di sini hanya mempengaruhi tampilan di <strong>Halaman Kontak (Daftar Cabang)</strong>.
                        Untuk mengubah informasi kontak utama (Footer/Header), silakan akses menu <strong>Pengaturan Situs</strong>.
                    </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Urutan (Order)</label>
                        <input
                            type="number"
                            {...register("sort_order", { valueAsNumber: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                        <input
                            type="checkbox"
                            {...register("is_active")}
                            id="is_active"
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Status Aktif (Tampilkan di Website)
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={cn(
                            "bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors",
                            isSaving && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Menyimpan..." : "Simpan Data"}
                    </button>
                </div>

            </form>
        </div>
    );
}
