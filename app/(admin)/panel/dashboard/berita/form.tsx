"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { processImageForUpload } from "@/lib/image-processor";
import { getAssetUrl } from "@/lib/cdn";

const newsSchema = z.object({
    title: z.string().min(5, "Judul minimal 5 karakter"),
    slug: z.string().min(3, "Slug otomatis terisi, tapi minimal 3 karakter"),
    category: z.string().min(1, "Pilih kategori"),
    content: z.string().min(10, "Konten berita tidak boleh kosong"),
    published: z.boolean(),
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

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<NewsInputs>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: "",
            slug: "",
            category: "Berita",
            content: "",
            published: true,
            seo_title: "",
            seo_desc: ""
        }
    });

    const titleValue = watch("title");

    // Slug generator
    useEffect(() => {
        if (!isEdit && titleValue) {
            const slug = titleValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setValue("slug", slug);
        }
    }, [titleValue, isEdit, setValue]);

    // Fetch data if edit
    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchNews = async () => {
                try {
                    const record = await pb.collection('news').getOne(params.id as string);
                    setValue("title", record.title);
                    setValue("slug", record.slug);
                    setValue("category", record.category);
                    setValue("content", record.content);
                    setValue("published", record.published);
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
            formData.append("title", data.title);
            formData.append("slug", data.slug);
            formData.append("category", data.category);
            formData.append("content", data.content);
            formData.append("published", data.published.toString());

            // Auto-fill SEO if empty
            const seoTitle = data.seo_title || data.title;
            // Strip HTML tags for description
            const seoDesc = data.seo_desc || data.content.replace(/<[^>]*>?/gm, '').substring(0, 150).trim() + "...";

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
                await pb.collection('news').update(params.id as string, formData);
            } else {
                await pb.collection('news').create(formData);
            }

            router.push("/panel/dashboard/berita");
        } catch (e) {
            console.error("Save failed", e);
            alert("Gagal menyimpan berita. Cek koneksi atau validasi.");
        } finally {
            setIsLoading(false);
        }
    };

    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

    // Fetch Site Config for Watermark Logo
    useEffect(() => {
        pb.collection('site_config').getFirstListItem("")
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
        <main className="max-w-5xl mx-auto pb-20">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header with Sticky Save Button */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-8 px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/berita"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Berita" : "Tulis Berita Baru"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {isEdit ? "Perbarui konten berita yang sudah ada." : "Bagikan kabar terbaru kepada anggota."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isEdit ? "Simpan Perubahan" : "Publikasikan"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Berita</label>
                                <input
                                    {...register("title")}
                                    className="w-full text-lg font-bold placeholder:font-normal px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Contoh: Rapat Anggota Tahunan 2024 Berjalan Lancar"
                                />
                                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                                <input
                                    {...register("slug")}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-sm focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4">Konten Artikel</label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Mulai menulis artikel menarik di sini..."
                                    />
                                )}
                            />
                            {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>}
                        </div>


                        {/* SEO Section optional but good */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900">Pengaturan SEO (Opsional)</h3>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const contentText = watch("content")?.replace(/<[^>]*>?/gm, "") || "";
                                        const prompt = `Bertindaklah sebagai SEO Specialist. Tolong buatkan:
1. SEO Title (Max 60 chars, mengandung keyword, akhiri dengan "| SID Sumberanyar").
2. SEO Description (Max 150 chars, ringkasan masalah + solusi + CTA).

Untuk artikel berikut:
${contentText}`;

                                        // Robust Copy Logic
                                        try {
                                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                                await navigator.clipboard.writeText(prompt);
                                                alert("Prompt disalin! Paste ke Gemini sekarang.");
                                            } else {
                                                throw new Error("Clipboard API unavailable");
                                            }
                                        } catch (err) {
                                            // Fallback for HTTP/insecure contexts
                                            try {
                                                const textArea = document.createElement("textarea");
                                                textArea.value = prompt;

                                                // Ensure it's not visible but part of DOM
                                                textArea.style.position = "fixed";
                                                textArea.style.left = "-9999px";
                                                textArea.style.top = "0";
                                                document.body.appendChild(textArea);

                                                textArea.focus();
                                                textArea.select();

                                                const successful = document.execCommand('copy');
                                                document.body.removeChild(textArea);

                                                if (successful) {
                                                    alert("Prompt disalin! Paste ke Gemini sekarang.");
                                                } else {
                                                    throw new Error("Fallback copy failed");
                                                }
                                            } catch (fallbackErr) {
                                                console.error("Copy failed", fallbackErr);
                                                alert("Gagal menyalin otomatis. Silakan copy manual dari console log (F12).");
                                                console.log("--- PROMPT START ---\n" + prompt + "\n--- PROMPT END ---");
                                            }
                                        }
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Salin Prompt AI
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">Jika dikosongkan, akan mengambil otomatis dari judul dan konten.</p>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-sm font-bold text-slate-700">SEO Title</label>
                                        <span className={cn("text-xs font-medium", (watch("seo_title")?.length || 0) > 60 ? "text-red-500" : "text-slate-400")}>
                                            {watch("seo_title")?.length || 0}/60
                                        </span>
                                    </div>
                                    <input
                                        {...register("seo_title")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                                        placeholder={watch("title") || "Judul khusus untuk mesin pencari"}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-sm font-bold text-slate-700">SEO Description</label>
                                        <span className={cn("text-xs font-medium", (watch("seo_desc")?.length || 0) > 160 ? "text-red-500" : "text-slate-400")}>
                                            {watch("seo_desc")?.length || 0}/160
                                        </span>
                                    </div>
                                    <textarea
                                        {...register("seo_desc")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm h-24 resize-none"
                                        placeholder="Deskripsi singkat konten..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Publish Status */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Status Publikasi</h3>
                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    {...register("published")}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                                />
                                <span className="font-medium text-slate-700">Publikasikan Sekarang</span>
                            </label>
                            <p className="text-xs text-slate-400 mt-2 px-3">
                                Jika tidak dicentang, berita akan disimpan sebagai <strong>Draft</strong>.
                            </p>
                        </div>

                        {/* Category */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Kategori</h3>
                            <select
                                {...register("category")}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="Berita">Berita</option>
                                <option value="Edukasi">Edukasi</option>
                                <option value="Promo">Promo</option>
                            </select>
                        </div>

                        {/* Thumbnail */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Gambar Sampul</h3>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                                {previewUrl ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                            Ganti Gambar
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-slate-400">
                                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Klik untuk upload gambar</p>
                                    </div>
                                )}
                                <input
                                    id="thumbnail_input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-center">Rekomen: 1200x630px (JPG/PNG)</p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
