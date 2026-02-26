"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { pb } from "@/lib/pb";
import { optimizeImage } from "@/lib/image-optimizer";
import { SectionHeading } from "@/components/ui/section-heading";
import { TactileButton } from "@/components/ui/tactile-button";
import { IconPicker } from "@/components/ui/icon-picker";
import { Save, Building2, Phone, Mail, MapPin, Loader2, Image as ImageIcon, Share2, Instagram, Facebook, Video, Youtube, Globe, FileText } from "lucide-react";

interface SiteConfig {
    id: string;
    company_name: string;
    address: string;
    phone_wa: string;
    email_official: string;
    total_assets: string;
    total_members: string;
    total_branches: string;
    map_embed_url: string;
    nib: string;
    legal_bh: string;
    // Temp fields for Social Media form handling
    instagram_url?: string;
    facebook_url?: string;
    tiktok_url?: string;
    youtube_url?: string;

    logo_primary: any;
    logo_secondary: any;
    favicon: any;

    // Locations Section (Jaringan Kantor)
    locations_title?: string;
    locations_description?: string;
    locations_feature1_text?: string;
    locations_feature1_icon?: string;
    locations_feature2_text?: string;
    locations_feature2_icon?: string;
}

// Helper to extract Lat/Lng or convert to Embed URL
function transformMapUrl(input: string): string {
    if (!input) return "";

    // If already an embed iframe src, return as is
    if (input.includes("google.com/maps/embed") || input.includes("output=embed")) {
        return input;
    }

    // Try to extract Lat/Lng from various Google Maps formats
    // 1. @lat,lng
    const atMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
        const [_, lat, lng] = atMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // 2. q=lat,lng or ll=lat,lng
    const qMatch = input.match(/[?&](q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
        const [_, __, lat, lng] = qMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // 3. search/lat,lng
    const searchMatch = input.match(/search\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (searchMatch) {
        const [_, lat, lng] = searchMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed`;
    }

    // Fallback: Return original (User might have pasted something else, let them try)
    return input;
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [configId, setConfigId] = useState("");
    const [mapPreview, setMapPreview] = useState("");
    const [logoPreviews, setLogoPreviews] = useState<any>({});

    const { register, handleSubmit, setValue, watch, getValues, control } = useForm<SiteConfig>();

    // Watch map input for live preview
    const mapInput = watch("map_embed_url");

    useEffect(() => {
        if (mapInput) {
            setMapPreview(transformMapUrl(mapInput));
        }
    }, [mapInput]);

    // Load config
    useEffect(() => {
        let isMounted = true;

        async function loadConfig() {
            try {

                // Add a timeout to prevent infinite loading
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout loading config")), 10000)
                );

                const recordsPromise = pb.collection('profil_desa').getList(1, 1);

                // Race the fetch against timeout
                const records = await Promise.race([recordsPromise, timeoutPromise]) as any;

                if (!isMounted) return;


                if (records.items.length > 0) {
                    const data = records.items[0];
                    setConfigId(data.id);
                    setValue("company_name", data.company_name);
                    setValue("address", data.address);
                    setValue("phone_wa", data.phone_wa);
                    setValue("email_official", data.email_official);
                    setValue("total_assets", data.total_assets);
                    setValue("total_members", data.total_members);
                    setValue("total_branches", data.total_branches);
                    setValue("nib", data.nib || "");
                    setValue("legal_bh", data.legal_bh || "");

                    // Social Links Parsing
                    const links = data.social_links || {};
                    setValue("instagram_url", links.instagram || "");
                    setValue("facebook_url", links.facebook || "");
                    setValue("tiktok_url", links.tiktok || "");
                    setValue("youtube_url", links.youtube || "");

                    // Read Map URL
                    // Check if map is in soc links or root field (legacy support)
                    const mapUrl = links.map_embed_url || data.map_embed_url || "";
                    setValue("map_embed_url", mapUrl);
                    setMapPreview(mapUrl);

                    // Locations
                    setValue("locations_title", data.locations_title || "");
                    setValue("locations_description", data.locations_description || "");
                    setValue("locations_feature1_text", data.locations_feature1_text || "");
                    setValue("locations_feature1_icon", data.locations_feature1_icon || "");
                    setValue("locations_feature2_text", data.locations_feature2_text || "");
                    setValue("locations_feature2_icon", data.locations_feature2_icon || "");

                    // Update previews
                    setLogoPreviews({
                        logo_primary: data.logo_primary ? pb.files.getUrl(data, data.logo_primary) : null,
                        logo_secondary: data.logo_secondary ? pb.files.getUrl(data, data.logo_secondary) : null,
                        favicon: data.favicon ? pb.files.getUrl(data, data.favicon) : null,
                    });
                }
            } catch (e: any) {
                console.error("Error loading config:", e);
                if (isMounted) {
                    alert("Gagal memuat pengaturan: " + (e.message || "Unknown error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadConfig();

        return () => {
            isMounted = false;
        };
    }, [setValue]);

    const onSubmit = async (data: SiteConfig) => {
        setIsSaving(true);

        try {
            const transformedMapUrl = transformMapUrl(data.map_embed_url);

            // Use FormData to ensure file uploads work correctly
            const formData = new FormData();

            // ... append text fields ...
            formData.append("company_name", data.company_name || "");
            formData.append("address", data.address || "");
            formData.append("phone_wa", data.phone_wa || "");
            formData.append("email_official", data.email_official || "");
            formData.append("total_assets", data.total_assets || "");
            formData.append("total_members", data.total_members || "");
            formData.append("total_branches", data.total_branches || "");
            formData.append("nib", data.nib || "");
            formData.append("legal_bh", data.legal_bh || "");
            formData.append("map_embed_url", transformedMapUrl);

            // Locations Section
            formData.append("locations_title", data.locations_title || "");
            formData.append("locations_description", data.locations_description || "");
            formData.append("locations_feature1_text", data.locations_feature1_text || "");
            formData.append("locations_feature1_icon", data.locations_feature1_icon || "");
            formData.append("locations_feature2_text", data.locations_feature2_text || "");
            formData.append("locations_feature2_icon", data.locations_feature2_icon || "");

            // Append JSON Field (social_links)
            const socialLinks = {
                map_embed_url: transformedMapUrl,
                instagram: data.instagram_url,
                facebook: data.facebook_url,
                tiktok: data.tiktok_url,
                youtube: data.youtube_url
            };
            formData.append("social_links", JSON.stringify(socialLinks));

            // Append Files with Smart Optimization
            if (data.logo_primary && data.logo_primary.length > 0) {
                if (data.logo_primary[0] instanceof File) {

                    try {
                        const optimized = await optimizeImage(data.logo_primary[0], 'logo');
                        formData.append("logo_primary", optimized);
                    } catch (optErr) {
                        console.error("Optimization failed, using original", optErr);
                        formData.append("logo_primary", data.logo_primary[0]);
                    }
                }
            }
            if (data.logo_secondary && data.logo_secondary.length > 0) {
                if (data.logo_secondary[0] instanceof File) {

                    try {
                        const optimized = await optimizeImage(data.logo_secondary[0], 'logo');
                        formData.append("logo_secondary", optimized);
                    } catch (optErr) {
                        console.error("Optimization failed, using original", optErr);
                        formData.append("logo_secondary", data.logo_secondary[0]);
                    }
                }
            }
            if (data.favicon && data.favicon.length > 0) {
                if (data.favicon[0] instanceof File) {

                    try {
                        const optimized = await optimizeImage(data.favicon[0], 'favicon');
                        formData.append("favicon", optimized);
                    } catch (optErr) {
                        console.error("Optimization failed, using original", optErr);
                        formData.append("favicon", data.favicon[0]);
                    }
                }
            }



            let record;

            // Check for existing record to enforce Singleton
            // Always fetch the latest to be sure, or rely on configId if we trust it doesn't change
            const existing = await pb.collection('profil_desa').getList(1, 1);
            if (existing.items.length > 0) {

                const targetId = existing.items[0].id; // Ensure we use the correct ID from DB
                setConfigId(targetId);
                record = await pb.collection('profil_desa').update(targetId, formData);
            } else {

                record = await pb.collection('profil_desa').create(formData);
                setConfigId(record.id);
            }

            alert("Pengaturan berhasil disimpan! Gambar telah dioptimasi.");

            // Update previews with new URLs from response
            setLogoPreviews({
                logo_primary: record.logo_primary ? pb.files.getUrl(record, record.logo_primary) : null,
                logo_secondary: record.logo_secondary ? pb.files.getUrl(record, record.logo_secondary) : null,
                favicon: record.favicon ? pb.files.getUrl(record, record.favicon) : null,
            });

            // Update form with the transformed value
            setValue("map_embed_url", transformedMapUrl);
            setMapPreview(transformedMapUrl);

        } catch (e: any) {
            console.error("Error saving config:", e);
            alert("Gagal menyimpan pengaturan: " + (e.message || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Memuat pengaturan...</div>;
    }

    return (
        <main>
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-desa-primary to-desa-primary-dark text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-display">Pengaturan Situs</h1>
                    <p className="text-emerald-100 mt-2">Kelola informasi publik, kontak, dan statistik website.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">

                {/* Branding Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                        Branding & Logo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Primary Logo */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Logo Utama (Warna)
                                <span className="block text-[10px] text-emerald-600 font-normal mt-0.5">
                                    Format: PNG/JPG/WebP. Otomatis di-resize & convert ke WebP untuk performa.
                                </span>
                            </label>
                            <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 h-32 relative overflow-hidden group hover:border-emerald-300 transition-colors">
                                {logoPreviews.logo_primary ? (
                                    <img src={logoPreviews.logo_primary} alt="Primary Logo" className="h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">Belum ada logo</span>
                                )}
                            </div>
                            <input
                                {...register("logo_primary")}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    register("logo_primary").onChange(e);
                                    if (e.target.files && e.target.files[0]) {
                                        setLogoPreviews((prev: any) => ({ ...prev, logo_primary: URL.createObjectURL(e.target.files![0]) }));
                                    }
                                }}
                                className="text-xs w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>

                        {/* Secondary Logo */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Logo Sekunder (Putih/Negatif)
                                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                                    Sama seperti utama. WebP Optimized.
                                </span>
                            </label>
                            <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-800 h-32 relative overflow-hidden group hover:border-emerald-300 transition-colors">
                                {logoPreviews.logo_secondary ? (
                                    <img src={logoPreviews.logo_secondary} alt="Secondary Logo" className="h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">Belum ada logo</span>
                                )}
                            </div>
                            <input
                                {...register("logo_secondary")}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    register("logo_secondary").onChange(e);
                                    if (e.target.files && e.target.files[0]) {
                                        setLogoPreviews((prev: any) => ({ ...prev, logo_secondary: URL.createObjectURL(e.target.files![0]) }));
                                    }
                                }}
                                className="text-xs w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>

                        {/* Favicon */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Favicon
                                <span className="block text-[10px] text-purple-600 font-normal mt-0.5">
                                    Format Icon Browser. Otomatis convert ke PNG 256px.
                                </span>
                            </label>
                            <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-white h-32 relative overflow-hidden group hover:border-emerald-300 transition-colors">
                                {logoPreviews.favicon ? (
                                    <img src={logoPreviews.favicon} alt="Favicon" className="h-16 w-16 object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">Belum ada icon</span>
                                )}
                            </div>
                            <input
                                {...register("favicon")}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    register("favicon").onChange(e);
                                    if (e.target.files && e.target.files[0]) {
                                        setLogoPreviews((prev: any) => ({ ...prev, favicon: URL.createObjectURL(e.target.files![0]) }));
                                    }
                                }}
                                className="text-xs w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gold-500" />
                        Statistik & Identitas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi</label>
                            <input {...register("company_name")} className="w-full p-2 border rounded-lg" placeholder="Pemerintah Desa Sumberanyar" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Aset (Text)</label>
                            <input {...register("total_assets")} className="w-full p-2 border rounded-lg" placeholder="28 Milyar" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Anggota (Text)</label>
                            <input {...register("total_members")} className="w-full p-2 border rounded-lg" placeholder="6,000+" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Kantor</label>
                            <input {...register("total_branches")} className="w-full p-2 border rounded-lg" placeholder="16" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NIB (Nomor Induk Berusaha)</label>
                            <input {...register("nib")} className="w-full p-2 border rounded-lg" placeholder="12345678..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Legalitas / Badan Hukum</label>
                            <textarea {...register("legal_bh")} className="w-full p-2 border rounded-lg h-20 resize-y" placeholder="SK Menteri Hukum dan HAM..." />
                        </div>
                    </div>
                </div>

                {/* Social Media Profiles */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-pink-500" />
                        Profil Media Sosial
                        <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-100 px-2 py-1 rounded-full">Wajib untuk Magic Fetch</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" /> Instagram Profile
                            </label>
                            <input {...register("instagram_url")} className="w-full p-2 border rounded-lg font-mono text-sm" placeholder="https://www.instagram.com/desa_sumberanyar/" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-blue-600" /> Facebook Page
                            </label>
                            <input {...register("facebook_url")} className="w-full p-2 border rounded-lg font-mono text-sm" placeholder="https://www.facebook.com/DesaSumberanyar/" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Video className="w-4 h-4 text-black" /> TikTok Profile
                            </label>
                            <input {...register("tiktok_url")} className="w-full p-2 border rounded-lg font-mono text-sm" placeholder="https://www.tiktok.com/@desa_sumberanyar" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Youtube className="w-4 h-4 text-red-600" /> YouTube Channel
                            </label>
                            <input {...register("youtube_url")} className="w-full p-2 border rounded-lg font-mono text-sm" placeholder="https://www.youtube.com/channel/..." />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-emerald-500" />
                        Kontak & Lokasi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Official</label>
                            <input {...register("phone_wa")} className="w-full p-2 border rounded-lg" placeholder="6281234567890" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Official</label>
                            <input {...register("email_official")} className="w-full p-2 border rounded-lg" placeholder="desa@sumberanyar.id" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Kantor Pusat</label>
                            <textarea {...register("address")} className="w-full p-2 border rounded-lg h-24" placeholder="Jl. Alun-alun Timur..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Link Google Maps / Embed URL
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Baru: Bisa paste Link Google Maps biasa!</span>
                            </label>
                            <input
                                {...register("map_embed_url")}
                                className="w-full p-2 border rounded-lg font-mono text-xs text-slate-500"
                                placeholder="Paste link Google Maps (https://maps.app.goo.gl/...) atau Embed code"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Sistem otomatis mendeteksi Lokasi dan membuat Pin jika Anda copas link dari Google Maps.
                            </p>

                            {/* Live Preview */}
                            {mapPreview && (transformMapUrl(mapInput || "") !== (mapInput || "") || (typeof mapInput === 'string' && mapInput.includes("embed"))) && (
                                <div className="mt-4 border rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 px-3 py-1 text-xs text-slate-500 border-b">Preview Maps</div>
                                    <iframe
                                        src={transformMapUrl(mapInput || "")}
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Locations Section (Jaringan Kantor) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        Bagian "Jaringan Kantor" (Homepage)
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                            <input {...register("locations_title")} className="w-full p-2 border rounded-lg" placeholder="Kami Hadir Lebih Dekat" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                            <textarea {...register("locations_description")} className="w-full p-2 border rounded-lg h-24" placeholder="Dengan 16 titik layanan..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fitur 1 (Teks)</label>
                                    <textarea {...register("locations_feature1_text")} className="w-full p-2 border rounded-lg h-20 resize-y" placeholder="Kantor Pusat & Cabang Strategis" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fitur 1 (Icon)</label>
                                    <Controller
                                        control={control}
                                        name="locations_feature1_icon"
                                        render={({ field }) => (
                                            <IconPicker value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fitur 2 (Teks)</label>
                                    <textarea {...register("locations_feature2_text")} className="w-full p-2 border rounded-lg h-20 resize-y" placeholder="Layanan Senin - Sabtu..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fitur 2 (Icon)</label>
                                    <Controller
                                        control={control}
                                        name="locations_feature2_icon"
                                        render={({ field }) => (
                                            <IconPicker value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <TactileButton type="submit" disabled={isSaving} className="px-8" icon={isSaving ? undefined : <Save className="w-4 h-4" />}>
                        {isSaving ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Simpan Perubahan"}
                    </TactileButton>
                </div>

            </form>
        </main>
    );
}
