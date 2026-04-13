"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Sparkles, BookOpen, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { processImageForUpload } from "@/lib/image-processor";
import { getAssetUrl } from "@/lib/cdn";

const newsSchema = z.object({
    judul: z.string().min(5, "Judul minimal 5 karakter"),
    slug: z.string().min(3, "Slug otomatis terisi, tapi minimal 3 karakter"),
    kategori: z.string().min(1, "Pilih kategori"),
    konten: z.string().min(10, "Konten berita tidak boleh kosong"),
    is_published: z.boolean(),
    seo_title: z.string().optional(),
    seo_desc: z.string().optional(),
    thumbnail: z.any().optional(),
});

type NewsInputs = z.infer<typeof newsSchema>;

export default function NewsEditorPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = isEdit ? useParams() : null;
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [slugEdited, setSlugEdited] = useState(false);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<NewsInputs>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            judul: "",
            slug: "",
            kategori: "Berita Utama",
            konten: "",
            is_published: true,
            seo_title: "",
            seo_desc: ""
        }
    });

    const judulValue = watch("judul");

    // Slug generator
    useEffect(() => {
        if (!isEdit && judulValue && !slugEdited) {
            const slug = judulValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setValue("slug", slug);
        }
    }, [judulValue, isEdit, setValue, slugEdited]);

    // Fetch data if edit
    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchNews = async () => {
                try {
                    const categoryMap: Record<string, string> = {
                        "Berita": "Berita Utama",
                        "Edukasi": "Edukasi & Literasi",
                        "Pengumuman": "Pengumuman Desa",
                        "Kegiatan": "Kegiatan Warga"
                    };

                    const record = await pb.collection('berita_desa').getOne(params.id as string);
                    setValue("judul", record.judul);
                    setValue("slug", record.slug);
                    setValue("kategori", categoryMap[record.kategori] || record.kategori);
                    setValue("konten", record.konten);
                    setValue("is_published", record.is_published);
                    setValue("seo_title", record.seo_title || "");
                    setValue("seo_desc", record.seo_desc || "");

                    if (record.thumbnail) {
                        setPreviewUrl(getAssetUrl(record, record.thumbnail));
                    }
                } catch (e) {
                    console.error("Failed to load news", e);
                    alert("Gagal memuat berita");
                    router.push("/panel/dashboard/berita");
                }
            };
            fetchNews();
        }
    }, [isEdit, params, setValue, router]);

    const onSubmit = async (data: NewsInputs) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("judul", data.judul);
            formData.append("slug", data.slug);
            formData.append("kategori", data.kategori);
            formData.append("konten", data.konten);
            formData.append("is_published", data.is_published.toString());

            // Auto-fill SEO if empty
            const seoTitle = data.seo_title || data.judul;
            // Strip HTML tags for description
            const seoDesc = data.seo_desc || data.konten.replace(/<[^>]*>?/gm, '').substring(0, 150).trim() + "...";

            formData.append("seo_title", seoTitle);
            formData.append("seo_desc", seoDesc);


            // Handle File with Smart Processing
            const fileInput = (document.getElementById("thumbnail_input") as HTMLInputElement)?.files?.[0];
            if (fileInput) {
                // Determine if we need to process
                // If it's an image, we process it.
                if (fileInput.type.startsWith("image/")) {
                    try {
                        const processedFile = await processImageForUpload(fileInput, logoUrl);
                        formData.append("thumbnail", processedFile);
                    } catch (err) {
                        console.error("Image processing failed, uploading original...", err);
                        formData.append("thumbnail", fileInput);
                    }
                } else {
                    formData.append("thumbnail", fileInput);
                }
            }

            if (isEdit && params?.id) {
                await pb.collection('berita_desa').update(params.id as string, formData);
            } else {
                await pb.collection('berita_desa').create(formData);
            }

            router.push("/panel/dashboard/berita");
        } catch (e: any) {
            console.error("Save failed", e);
            
            // Handle specific 400 validation errors
            if (e.status === 400 && e.data?.data) {
                const errors = e.data.data;
                let errorMsg = "Gagal menyimpan karena kesalahan data:";
                
                if (errors.slug) errorMsg += "\n- Alamat URL (slug) sudah digunakan.";
                if (errors.judul) errorMsg += "\n- Judul bermasalah: " + (errors.judul.message || "cek kembali.");
                if (errors.konten) errorMsg += "\n- Konten bermasalah: " + (errors.konten.message || "cek kembali.");
                if (errors.kategori) errorMsg += "\n- Kategori bermasalah: " + (errors.kategori.message || "cek kembali.");
                if (errors.thumbnail) errorMsg += "\n- Gambar bermasalah: " + (errors.thumbnail.message || "cek kembali.");
                
                alert(errorMsg);
            } else {
                alert("Gagal menyimpan berita. Detail: " + (e.message || "Cek koneksi atau kelengkapan data."));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

    // Fetch Site Config for Watermark Logo
    useEffect(() => {
        pb.collection('profil_desa').getFirstListItem("")
            .then(config => {
                // Use logo_secondary (white) and getSecureAssetUrl logic via getAssetUrl helper
                if (config.logo_secondary) {
                    const url = getAssetUrl(config, config.logo_secondary);

                    setLogoUrl(url);
                }
            })
            .catch(() => { });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <main className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Standard Header - Transparent */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/berita"
                            className="p-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Konten Berita" : "Tulis Berita Baru"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {isEdit ? "Perbarui narasi dan informasi publik desa." : "Bagikan kabar dan pengumuman terbaru desa."}
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
                        {isEdit ? "Simpan Perubahan" : "Publikasikan Sekarang"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Informasi Utama</h3>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Judul Artikel</label>
                                    <input
                                        {...register("judul")}
                                        className="w-full text-base font-bold placeholder:font-normal px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700"
                                        placeholder="Contoh: Peresmian Fasilitas Baru Desa..."
                                    />
                                    {errors.judul && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-tight">{errors.judul.message}</p>}
                                </div>

                                <div className="max-w-md">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Slug (URL Custom)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xs">/</span>
                                        <input
                                            {...register("slug")}
                                            onInput={() => setSlugEdited(true)}
                                            className="w-full pl-8 pr-4 py-2 bg-slate-100/50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                        />
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-tight px-1">Tip: Gunakan "-" sebagai pemisah kata.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Konten Narasi</h3>
                            </div>
                            <div className="flex-1 min-h-[450px]">
                                <Controller
                                    name="konten"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Tuliskan detail berita secara lengkap dan menarik..."
                                        />
                                    )}
                                />
                                {errors.konten && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-tight">{errors.konten.message}</p>}
                            </div>
                        </div>

                        {/* SEO Section - Compact version */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 text-slate-500 rounded-xl">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Optimasi Pencarian (SEO)</h3>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const contentText = watch("konten")?.replace(/<[^>]*>?/gm, "") || "";
                                        const prompt = `Bertindaklah sebagai SEO Specialist. Tolong buatkan:
1. SEO Title (Max 60 chars, mengandung keyword, akhiri dengan "| SID Sumberanyar").
2. SEO Description (Max 150 chars, ringkasan masalah + solusi + CTA).

Untuk artikel berikut:
${contentText}`;

                                        try {
                                            if (navigator.clipboard) {
                                                await navigator.clipboard.writeText(prompt);
                                                alert("Prompt SEO telah disalin! Silakan tempel di Gemini.");
                                            }
                                        } catch (err) {
                                            console.error("Copy failed", err);
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all active:scale-95"
                                >
                                    Copy AI Prompt
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Title</label>
                                        <span className={cn("text-[10px] font-black uppercase", (watch("seo_title")?.length || 0) > 60 ? "text-red-500" : "text-slate-300")}>
                                            {watch("seo_title")?.length || 0}/60
                                        </span>
                                    </div>
                                    <input
                                        {...register("seo_title")}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                        placeholder="Judul untuk pencarian..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Description</label>
                                        <span className={cn("text-[10px] font-black uppercase", (watch("seo_desc")?.length || 0) > 160 ? "text-red-500" : "text-slate-300")}>
                                            {watch("seo_desc")?.length || 0}/160
                                        </span>
                                    </div>
                                    <input
                                        {...register("seo_desc")}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                        placeholder="Ringkasan singkat artikel..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Pengaturan Publikasi</h3>
                            
                            <div className="space-y-3">
                                <label className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border",
                                    watch("is_published") ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register("is_published")}
                                            className="w-5 h-5 text-emerald-600 rounded-lg focus:ring-emerald-500 border-gray-300 transition-all"
                                        />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Terbitkan</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Visibilitas Publik</p>
                                    </div>
                                </label>
                                
                                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight leading-relaxed">
                                        {!watch("is_published") ? "⚠️ Berita akan disimpan sebagai Draft dan tidak terlihat di website." : "✅ Berita akan langsung terlihat oleh publik."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Category Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Kategori Berita</h3>
                            <select
                                {...register("kategori")}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                            >
                                <option value="Berita Utama">Berita Utama</option>
                                <option value="Edukasi & Literasi">Edukasi & Literasi</option>
                                <option value="Pengumuman Desa">Pengumuman Desa</option>
                                <option value="Kegiatan Warga">Kegiatan Warga</option>
                            </select>
                        </div>

                        {/* Thumbnail Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Gambar Sampul</h3>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition-all relative group overflow-hidden">
                                {previewUrl ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                            <Sparkles className="w-5 h-5 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Ganti Gambar</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 text-slate-300">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Upload Artikel Media</p>
                                    </div>
                                )}
                                <input
                                    id="thumbnail_input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-4 text-center uppercase font-bold tracking-widest">Format: JPG, PNG • Max: 2MB</p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
