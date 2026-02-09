"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { ArrowLeft, Save, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";
import { fetchOEmbed, getPlatformFromUrl } from "@/lib/oembed";

export default function AddSocialFeedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [formData, setFormData] = useState({
        url: "",
        platform: "",
        caption: "",
        is_pinned: false,
        is_active: true,
        embed_code: "" // Optional
    });

    const handleMagicFetch = async () => {
        if (!formData.url) return;

        setFetching(true);
        try {
            const platform = getPlatformFromUrl(formData.url);
            let metadata = await fetchOEmbed(formData.url, platform as any);

            setFormData(prev => ({
                ...prev,
                platform: platform === 'other' ? 'website' : platform,
                caption: metadata?.title || prev.caption || "Postingan Baru",
                // Note: We can't automatically upload the thumbnail file here easily from client 
                // without fetching blob and re-uploading. 
                // For this MVP, we will might leave thumbnail as manual upload OR just rely on platform icon if no thumb.
                // Or if metadata has html (like tiktok), store it.
                embed_code: metadata?.html || ""
            }));

            alert("Data berhasil diambil dari URL! Silakan lengkapi gambar jika perlu.");
        } catch (e) {
            console.error(e);
            alert("Gagal mengambil data otomatis. Silakan isi manual.");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData object for file upload support
            const data = new FormData();
            data.append("url", formData.url);
            data.append("platform", formData.platform || "website");
            data.append("caption", formData.caption);
            data.append("is_pinned", formData.is_pinned.toString());
            data.append("is_active", formData.is_active.toString());
            if (formData.embed_code) data.append("embed_code", formData.embed_code);

            // Handle file input if we add one, but for now let's assume manual upload for file
            const fileInput = document.getElementById("thumbnail_input") as HTMLInputElement;
            if (fileInput?.files?.length) {
                data.append("thumbnail", fileInput.files[0]);
            }

            await pb.collection("social_feeds").create(data);
            router.push("/panel/dashboard/socials");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan data.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="fle items-center gap-4 mb-6">
                <Link href="/panel/dashboard/socials" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Tambah Konten Sosial</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* URL Input with Magic Button */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link Postingan (URL)</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                required
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://instagram.com/p/..."
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleMagicFetch}
                                disabled={fetching || !formData.url}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                Magic Fetch
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Dukung: Instagram, TikTok, YouTube, Facebook.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                            <select
                                value={formData.platform}
                                onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none capitalize"
                            >
                                <option value="">- Pilih Platform -</option>
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                                <option value="facebook">Facebook</option>
                                <option value="youtube">YouTube</option>
                                <option value="website">Website / Lainnya</option>
                            </select>
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_pinned}
                                    onChange={e => setFormData({ ...formData, is_pinned: e.target.checked })}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Pin ke Atas (Sorotan)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Caption / Judul</label>
                        <input
                            type="text"
                            value={formData.caption}
                            onChange={e => setFormData({ ...formData, caption: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail (Opsional)</label>
                        <input
                            type="file"
                            id="thumbnail_input"
                            accept="image/*"
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <p className="text-xs text-slate-500 mt-1">Jika kosong, akan menggunakan icon platform.</p>
                    </div>

                    {/* Hidden/Advanced Embed Code */}
                    {formData.embed_code && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Embed Code (Auto-generated)</label>
                            <textarea
                                value={formData.embed_code}
                                readOnly
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-xs font-mono h-20"
                            />
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href="/panel/dashboard/socials"
                            className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Simpan Konten
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
