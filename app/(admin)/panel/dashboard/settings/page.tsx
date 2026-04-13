"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { pb } from "@/lib/pb";
import { optimizeImage } from "@/lib/image-optimizer";
import { IconPicker } from "@/components/ui/icon-picker";
import { 
    Save, Building2, Phone, Mail, MapPin, Loader2, 
    Image as ImageIcon, Share2, Instagram, Facebook, 
    Video, Youtube, Globe, FileText, LayoutGrid, Sparkles, 
    ArrowLeft, HelpCircle, ShieldCheck, AppWindow
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    instagram_url?: string;
    facebook_url?: string;
    tiktok_url?: string;
    youtube_url?: string;

    logo_primary: any;
    logo_secondary: any;
    favicon: any;

    locations_title?: string;
    locations_description?: string;
    locations_feature1_text?: string;
    locations_feature1_icon?: string;
    locations_feature2_text?: string;
    locations_feature2_icon?: string;
}

function transformMapUrl(input: string): string {
    if (!input) return "";
    if (input.includes("google.com/maps/embed") || input.includes("output=embed")) return input;
    const atMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&hl=id&z=16&output=embed`;
    const qMatch = input.match(/[?&](q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return `https://maps.google.com/maps?q=${qMatch[2]},${qMatch[3]}&hl=id&z=16&output=embed`;
    const searchMatch = input.match(/search\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (searchMatch) return `https://maps.google.com/maps?q=${searchMatch[1]},${searchMatch[2]}&hl=id&z=16&output=embed`;
    return input;
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [configId, setConfigId] = useState("");
    const [mapPreview, setMapPreview] = useState("");
    const [logoPreviews, setLogoPreviews] = useState<any>({});

    const { register, handleSubmit, setValue, watch, control } = useForm<SiteConfig>();
    const mapInput = watch("map_embed_url");

    useEffect(() => {
        if (mapInput) setMapPreview(transformMapUrl(mapInput));
    }, [mapInput]);

    useEffect(() => {
        async function loadConfig() {
            try {
                const records = await pb.collection('profil_desa').getList(1, 1);
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

                    const links = data.social_links || {};
                    setValue("instagram_url", links.instagram || "");
                    setValue("facebook_url", links.facebook || "");
                    setValue("tiktok_url", links.tiktok || "");
                    setValue("youtube_url", links.youtube || "");

                    const mapUrl = links.map_embed_url || data.map_embed_url || "";
                    setValue("map_embed_url", mapUrl);
                    setMapPreview(mapUrl);

                    setValue("locations_title", data.locations_title || "");
                    setValue("locations_description", data.locations_description || "");
                    setValue("locations_feature1_text", data.locations_feature1_text || "");
                    setValue("locations_feature1_icon", data.locations_feature1_icon || "");
                    setValue("locations_feature2_text", data.locations_feature2_text || "");
                    setValue("locations_feature2_icon", data.locations_feature2_icon || "");

                    setLogoPreviews({
                        logo_primary: data.logo_primary ? pb.files.getUrl(data, data.logo_primary) : null,
                        logo_secondary: data.logo_secondary ? pb.files.getUrl(data, data.logo_secondary) : null,
                        favicon: data.favicon ? pb.files.getUrl(data, data.favicon) : null,
                    });
                }
            } catch (e: any) {
                console.error("Error loading config:", e);
            } finally {
                setIsLoading(false);
            }
        }
        loadConfig();
    }, [setValue]);

    const onSubmit = async (data: SiteConfig) => {
        setIsSaving(true);
        try {
            const transformedMapUrl = transformMapUrl(data.map_embed_url);
            const formData = new FormData();
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
            formData.append("locations_title", data.locations_title || "");
            formData.append("locations_description", data.locations_description || "");
            formData.append("locations_feature1_text", data.locations_feature1_text || "");
            formData.append("locations_feature1_icon", data.locations_feature1_icon || "");
            formData.append("locations_feature2_text", data.locations_feature2_text || "");
            formData.append("locations_feature2_icon", data.locations_feature2_icon || "");

            const socialLinks = {
                map_embed_url: transformedMapUrl,
                instagram: data.instagram_url,
                facebook: data.facebook_url,
                tiktok: data.tiktok_url,
                youtube: data.youtube_url
            };
            formData.append("social_links", JSON.stringify(socialLinks));

            if (data.logo_primary?.[0] instanceof File) {
                const optimized = await optimizeImage(data.logo_primary[0], 'logo');
                formData.append("logo_primary", optimized);
            }
            if (data.logo_secondary?.[0] instanceof File) {
                const optimized = await optimizeImage(data.logo_secondary[0], 'logo');
                formData.append("logo_secondary", optimized);
            }
            if (data.favicon?.[0] instanceof File) {
                const optimized = await optimizeImage(data.favicon[0], 'favicon');
                formData.append("favicon", optimized);
            }

            const existing = await pb.collection('profil_desa').getList(1, 1);
            let record;
            if (existing.items.length > 0) {
                record = await pb.collection('profil_desa').update(existing.items[0].id, formData);
            } else {
                record = await pb.collection('profil_desa').create(formData);
            }

            setLogoPreviews({
                logo_primary: record.logo_primary ? pb.files.getUrl(record, record.logo_primary) : null,
                logo_secondary: record.logo_secondary ? pb.files.getUrl(record, record.logo_secondary) : null,
                favicon: record.favicon ? pb.files.getUrl(record, record.favicon) : null,
            });
            setValue("map_embed_url", transformedMapUrl);
            setMapPreview(transformedMapUrl);
            alert("Pengaturan website berhasil diperbarui.");
        } catch (e: any) {
            console.error("Error saving config:", e);
            alert("Gagal menyimpan pengaturan.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Sinkronisasi preferensi...</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Header Banner Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-emerald-950/20 mb-10 border border-white/5">
                    <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-5 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/panel/dashboard" 
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Website Configuration</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Pengaturan Situs</h1>
                            <p className="text-slate-400 font-medium max-w-xl">Sesuaikan identitas digital, branding, dan informasi operasional desa.</p>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-70 group"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Main Sidebar (Left) */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* Branding Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Identitas & Branding</h3>
                            </div>

                            <div className="space-y-8">
                                {/* Primary Logo */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Logo Utama (Warna)</label>
                                    <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center p-6 relative group overflow-hidden hover:bg-slate-100/50 transition-colors">
                                        <input 
                                            type="file" 
                                            {...register("logo_primary")}
                                            onChange={(e) => {
                                                register("logo_primary").onChange(e);
                                                if (e.target.files?.[0]) setLogoPreviews((p:any)=>({...p, logo_primary: URL.createObjectURL(e.target.files![0])}));
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        />
                                        {logoPreviews.logo_primary ? (
                                            <img src={logoPreviews.logo_primary} alt="Primary" className="max-h-full object-contain" />
                                        ) : (
                                            <div className="text-center opacity-30">
                                                <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                                                <p className="text-[9px] font-black uppercase tracking-widest">Pilih Logo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Favicon */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Favicon Browser</label>
                                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center p-4 relative group hover:bg-slate-100/50 transition-colors">
                                        <input 
                                            type="file" 
                                            {...register("favicon")}
                                            onChange={(e) => {
                                                register("favicon").onChange(e);
                                                if (e.target.files?.[0]) setLogoPreviews((p:any)=>({...p, favicon: URL.createObjectURL(e.target.files![0])}));
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        />
                                        {logoPreviews.favicon ? (
                                            <img src={logoPreviews.favicon} alt="Favicon" className="w-full h-full object-contain" />
                                        ) : (
                                            <Globe className="w-8 h-8 opacity-20" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Media Sosial</h3>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { id: "instagram_url", icon: Instagram, color: "text-emerald-500", label: "Instagram" },
                                    { id: "facebook_url", icon: Facebook, color: "text-emerald-600", label: "Facebook" },
                                    { id: "tiktok_url", icon: Video, color: "text-emerald-700", label: "TikTok" },
                                    { id: "youtube_url", icon: Youtube, color: "text-emerald-800", label: "YouTube" },
                                ].map((s) => (
                                    <div key={s.id} className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <s.icon className={cn("w-3.5 h-3.5", s.color)} /> {s.label}
                                        </label>
                                        <input 
                                            {...register(s.id as any)} 
                                            className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 text-xs font-mono transition-all outline-none" 
                                            placeholder={`https://${s.label.toLowerCase()}.com/...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area (Center/Right) */}
                    <div className="xl:col-span-8 space-y-8">
                        {/* Information Grid */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-10">
                            {/* General Info */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Profil Operasional Desa</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Instansi</label>
                                        <input {...register("company_name")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold uppercase tracking-wide outline-none" placeholder="Pemerintah Desa ..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Official</label>
                                        <input {...register("email_official")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold outline-none" placeholder="desa@example.id" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp Center</label>
                                        <input {...register("phone_wa")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-sm font-mono font-bold outline-none" placeholder="6281234567890" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nomor Induk Berusaha (NIB)</label>
                                        <input {...register("nib")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-sm font-mono font-bold outline-none" placeholder="12345678..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alamat Kantor Pusat</label>
                                        <textarea {...register("address")} rows={3} className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium outline-none resize-none" placeholder="Jl. Alun-alun Timur No. 1..." />
                                    </div>
                                </div>
                            </section>

                            {/* Map Settings */}
                            <section className="space-y-6 pt-6 border-t border-slate-50">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Lokasi Interaktif (Maps)</h3>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                        Auto-Detect Link Google Maps
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paste URL / Embed Iframe</label>
                                        <input
                                            {...register("map_embed_url")}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 outline-none focus:bg-white transition-all"
                                            placeholder="https://maps.app.goo.gl/..."
                                        />
                                    </div>

                                    {mapPreview && (
                                        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                                            <div className="px-5 py-2.5 bg-white/80 backdrop-blur-md border-b text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                Visual Preview (Auto-generated)
                                            </div>
                                            <iframe
                                                src={mapPreview}
                                                width="100%"
                                                height="300"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                className="grayscale hover:grayscale-0 transition-all duration-700"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Section: Homepage Jaringan Kantor */}
                            <section className="space-y-8 pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <AppWindow className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Kustomisasi Halaman Beranda</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul Bagian</label>
                                            <input {...register("locations_title")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white text-sm font-black uppercase tracking-tight transition-all outline-none" placeholder="Jaringan Kantor Kami" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deskripsi Singkat</label>
                                            <input {...register("locations_description")} className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white text-sm font-medium transition-all outline-none" placeholder="Kami melayani dengan sepenuh hati..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                        {[1, 2].map((num) => (
                                            <div key={num} className="space-y-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fitur Unggulan {num}</label>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pilih Icon Visual</label>
                                                        <Controller
                                                            control={control}
                                                            name={`locations_feature${num}_icon` as any}
                                                            render={({ field }) => (
                                                                <IconPicker value={field.value} onChange={field.onChange} />
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Keterangan Teks</label>
                                                        <textarea 
                                                            {...register(`locations_feature${num}_text` as any)} 
                                                            rows={2} 
                                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 transition-all text-[11px] font-bold uppercase tracking-tight leading-relaxed outline-none resize-none shadow-sm"
                                                            placeholder="Misal: Pelayanan Cepat 5 Menit..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                        
                        {/* Status Card Footer */}
                        <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-xl shadow-emerald-600/20 relative overflow-hidden group border border-white/10">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-6 h-6 text-blue-200" />
                                            <h3 className="text-xl font-black uppercase tracking-tight">Konfigurasi Aman</h3>
                                        </div>
                                        <p className="text-emerald-50/80 text-xs font-medium max-w-md">Perubahan yang Anda lakukan akan langsung berdampak pada seluruh halaman publik website. Pastikan data yang dimasukkan sudah benar.</p>
                                    </div>
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                        <HelpCircle className="w-8 h-8 text-white opacity-40" />
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
}
