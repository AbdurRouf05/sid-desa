"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pb, getSiteConfig } from "@/lib/pb";
import { Plus, Trash2, Pin, ExternalLink, AlertTriangle, Settings, Instagram, Facebook, Youtube, Video } from "lucide-react";
import { SocialAddModal } from "@/components/admin/social-add-modal";

export default function SocialsPage() {
    const [feeds, setFeeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [configWarning, setConfigWarning] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [config, setConfig] = useState<any>({});

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState("instagram");
    const [editingFeed, setEditingFeed] = useState<any>(null);

    const fetchFeeds = async () => {
        setLoading(true);
        try {
            // 1. Check Config
            const siteConfig = await getSiteConfig();
            setConfig(siteConfig);

            const links = siteConfig.social_links || {};

            // Determine available platforms
            const platforms = [];
            if (links.instagram) platforms.push("instagram");
            if (links.facebook) platforms.push("facebook");
            if (links.tiktok) platforms.push("tiktok");
            if (links.youtube) platforms.push("youtube");

            // Check if at least one is present
            if (platforms.length === 0) {
                setConfigWarning(true);
            } else {
                setConfigWarning(false);
            }

            // 2. Fetch Feeds
            const records = await pb.collection('social_feeds').getList(1, 50, {
                sort: '-id', // Fallback since 'created' is missing
            });
            // Client-side sort: Pinned first
            const sorted = records.items.sort((a: any, b: any) => {
                if (a.is_pinned === b.is_pinned) return 0;
                return a.is_pinned ? -1 : 1;
            });
            setFeeds(sorted);
        } catch (e) {
            console.error(e);
            alert("Gagal mengambil data social feeds");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, []);

    const handleOpenModal = (platform: string) => {
        setSelectedPlatform(platform);
        setEditingFeed(null);
        setIsModalOpen(true);
    };

    const handleEdit = (feed: any) => {
        setEditingFeed(feed);
        setSelectedPlatform(feed.platform);
        setIsModalOpen(true);
    };

    const handleSaveContent = async (data: any) => {
        try {
            // Check if it's FormData (has .get) or plain object
            const isFormData = data instanceof FormData;
            const id = isFormData ? data.get('id') as string : data.id;

            if (id) {
                // Update
                if (isFormData) data.delete('id'); // ID is already in the update() call
                await pb.collection('social_feeds').update(id, data);
            } else {
                // Create
                if (isFormData) {
                    data.append('is_pinned', 'false');
                    await pb.collection('social_feeds').create(data);
                } else {
                    await pb.collection('social_feeds').create({
                        ...data,
                        is_pinned: false
                    });
                }
            }
            fetchFeeds();
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const togglePin = async (id: string, currentStatus: boolean) => {
        try {
            await pb.collection('social_feeds').update(id, {
                is_pinned: !currentStatus
            });
            fetchFeeds(); // Refresh to re-sort
        } catch (e) {
            alert("Gagal update pin");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus postingan ini?")) return;
        try {
            await pb.collection('social_feeds').delete(id);
            fetchFeeds();
        } catch (e) {
            alert("Gagal menghapus");
        }
    };

    // Filter feeds based on active tab
    const filteredFeeds = activeTab === "all"
        ? feeds
        : feeds.filter(f => f.platform === activeTab);

    // Platform config for UI
    const platforms = [
        { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-100', link: config.social_links?.instagram },
        { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', link: config.social_links?.facebook },
        { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-black', bg: 'bg-slate-100 hover:bg-slate-200', link: config.social_links?.tiktok },
        { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100', link: config.social_links?.youtube },
    ].filter(p => p.link); // Only show configured platforms

    return (
        <main className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Social Media Feeds</h1>
                    <p className="text-slate-500">Kelola konten sosial media yang tampil di website</p>
                </div>

                {/* New "Add" Buttons */}
                <div className="flex gap-2">
                    {platforms.map(p => (
                        <button
                            key={p.id}
                            onClick={() => handleOpenModal(p.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-transform hover:scale-105 active:scale-95 ${p.bg} ${p.color} border border-transparent hover:border-current`}
                            title={`Tambah konten ${p.label}`}
                        >
                            <p.icon className="w-4 h-4" />
                            <span className="hidden md:inline">+ {p.label}</span>
                        </button>
                    ))}
                    {platforms.length === 0 && (
                        <Link href="/panel/dashboard/settings" className="text-sm text-amber-600 font-bold underline bg-amber-50 px-3 py-2 rounded-lg">
                            ⚠️ Atur Sosmed Dulu
                        </Link>
                    )}
                </div>
            </div>

            {configWarning && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-amber-800">Profil Media Sosial Belum Diatur</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Agar fitur "Magic Fetch" bekerja optimal dan pengunjung bisa menemukan profil Anda,
                            harap lengkapi link Instagram, Facebook, dan TikTok di halaman Pengaturan.
                        </p>
                        <Link href="/panel/dashboard/settings" className="inline-flex items-center gap-2 mt-3 text-xs font-bold bg-white border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                            <Settings className="w-3 h-3" />
                            Ke Pengaturan Situs
                        </Link>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            {platforms.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        Semua
                    </button>
                    {platforms.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActiveTab(p.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap flex items-center gap-2 ${activeTab === p.id
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-200 rounded-xl break-inside-avoid"></div>)}
                </div>
            ) : filteredFeeds.length > 0 ? (
                <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {filteredFeeds.map((feed) => {
                        // Platform-specific styling
                        let aspectRatio = "aspect-[4/5]"; // Default vertical-ish
                        let cardStyle = "bg-white";
                        let textColor = "text-slate-900";

                        if (feed.platform === "tiktok") {
                            aspectRatio = "aspect-[9/16]";
                            cardStyle = "bg-slate-900 border-slate-800";
                            textColor = "text-white";
                        } else if (feed.platform === "instagram") {
                            aspectRatio = "aspect-square";
                        } else if (feed.platform === "facebook") {
                            aspectRatio = "aspect-[4/3]";
                        } else if (feed.platform === "youtube") {
                            aspectRatio = "aspect-video";
                        }

                        // Prioritize the actual file field ('thumbnail') over the URL string
                        const imageSource = feed.thumbnail
                            ? pb.files.getUrl(feed, feed.thumbnail)
                            : (feed.thumbnail_url || "");

                        return (
                            <div key={feed.id} className={`break-inside-avoid relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 border mb-4 ${cardStyle} ${feed.is_pinned ? 'ring-2 ring-gold' : 'border-slate-200'}`}>
                                {/* Card Header/Thumbnail */}
                                <div className={`relative w-full ${aspectRatio} bg-slate-100 overflow-hidden`}>
                                    {imageSource ? (
                                        <Image
                                            src={imageSource}
                                            alt={feed.caption || "Thumbnail"}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold capitalize opacity-50">
                                            {feed.platform}
                                        </div>
                                    )}

                                    {feed.is_pinned && (
                                        <div className="absolute top-2 left-2 bg-gold text-emerald-950 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                                            <Pin className="w-3 h-3" /> PINNED
                                        </div>
                                    )}

                                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold capitalize backdrop-blur-sm z-10">
                                        {feed.platform}
                                    </div>

                                    {/* Overlay Gradient for text readability */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                                </div>

                                {/* Content Actions (Overlay styled) */}
                                <div className="absolute bottom-0 inset-x-0 p-4 pt-12">
                                    <p className={`text-sm font-medium line-clamp-2 mb-3 text-white`}>
                                        {feed.caption || "Tanpa Caption"}
                                    </p>

                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => togglePin(feed.id, feed.is_pinned)}
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                            title={feed.is_pinned ? "Lepas Pin" : "Pin Postingan"}
                                        >
                                            <Pin className={`w-4 h-4 ${feed.is_pinned ? 'fill-gold text-gold' : ''}`} />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(feed)}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                title="Edit Postingan"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={feed.url}
                                                target="_blank"
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                                                title="Lihat Sumber"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(feed.id)}
                                                className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="py-12 text-center bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                    <p className="text-slate-500 font-medium">Belum ada konten {activeTab !== 'all' ? activeTab : ''}.</p>
                    <p className="text-sm text-slate-400 mt-1">Klik tombol di atas untuk menambah.</p>
                </div>
            )}

            {/* Add Modal */}
            <SocialAddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={selectedPlatform}
                profileUrl={config.social_links?.[selectedPlatform]}
                initialData={editingFeed}
                onSave={handleSaveContent}
            />
        </main>
    );
}
