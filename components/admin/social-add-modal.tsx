"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Assuming we have these or will use raw
import { TactileButton } from "@/components/ui/tactile-button";
import { Input } from "../ui/input";
import { ExternalLink, Loader2, Check, AlertCircle, Clipboard } from "lucide-react";
import { getPlatformFromUrl } from "@/lib/oembed";
import { scrapeSocialMetadata } from "@/app/actions/scrape-metadata";
import Image from "next/image";

interface SocialAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: string;
    profileUrl: string;
    initialData?: any;
    onSave: (data: any) => Promise<void>;
}

export function SocialAddModal({ isOpen, onClose, platform, profileUrl, initialData, onSave }: SocialAddModalProps) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [error, setError] = useState("");
    const [caption, setCaption] = useState("");
    const [debouncedUrl, setDebouncedUrl] = useState("");

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUrl(url);
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [url]);

    useEffect(() => {
        if (debouncedUrl && debouncedUrl.length > 10) {
            fetchPreview(debouncedUrl);
        }
    }, [debouncedUrl]);

    // Reset or Load initial data when opening
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db-bmtnulmj.sagamuda.cloud";
                setUrl(initialData.url || "");
                setCaption(initialData.caption || "");

                // Prioritize physical file over URL string
                const thumb = initialData.thumbnail
                    ? `${baseUrl}/api/files/social_feeds/${initialData.id}/${initialData.thumbnail}`
                    : (initialData.thumbnail_url || "");

                setPreview({
                    ...initialData,
                    thumbnail_url: thumb
                });
                setPreviewUrl("");
                setUploadedFile(null);
            } else {
                setUrl("");
                setDebouncedUrl("");
                setCaption("");
                setPreview(null);
                setError("");
                setUploadedFile(null);
                setPreviewUrl("");
            }
        }
    }, [isOpen, initialData]);

    const handlePasteEvent = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const file = new File([blob], "pasted-image.png", { type: blob.type });
                    handleFileSelect(file);
                    return;
                }
            }
        }

        // Fallback for text (URL)
        const text = e.clipboardData.getData("text");
        if (text && text.startsWith("http")) {
            setUrl(text);
            setDebouncedUrl(text);
        }
    };

    const handlePasteManual = async () => {
        setError("");
        try {
            // Attempt to use the newer Clipboard API
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.includes("image/png") || item.types.includes("image/jpeg") || item.types.includes("image/webp")) {
                    const blob = await item.getType(item.types.find(t => t.includes("image")) || "image/png");
                    const file = new File([blob], "pasted-image.png", { type: blob.type });
                    handleFileSelect(file);
                    return;
                }
            }
            const text = await navigator.clipboard.readText();
            if (text && text.startsWith("http")) {
                setUrl(text);
                setDebouncedUrl(text);
            }
        } catch (e: any) {
            console.warn("Manual paste failed, likely permission:", e);
            // Don't show scary error if it's just a permission/browser block
            // Just guide the user to Use Ctrl+V
            setError("Klik di sini lalu tekan Ctrl+V untuk menempel gambar.");
        }
    };



    const handleFileSelect = (file: File) => {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError("");

        // If we don't have a preview object yet, create a dummy one so UI shows up
        if (!preview) {
            setPreview({
                title: "Manual Upload",
                description: "",
                thumbnail_url: url,
                author_name: "Me",
                original_url: url || "",
                platform: platform
            });
        } else {
            // Update existing preview
            setPreview((prev: any) => ({ ...prev, thumbnail_url: url }));
        }
    };

    // Sync URL state with preview original_url if user hasn't typed anything
    useEffect(() => {
        if (preview?.original_url && !url && !initialData) {
            setUrl(preview.original_url);
        }
    }, [preview, url, initialData]);

    const fetchPreview = async (inputUrl: string) => {
        if (!inputUrl) return;

        // Validate Platform
        const detected = getPlatformFromUrl(inputUrl);
        // Warn but don't block? User might paste weird links.
        // If it's completely wrong, warn.
        if (detected !== platform && detected !== 'other') {
            // setError(`Link ini terdeteksi sebagai ${detected}, bukan ${platform}.`);
            // Allow it, maybe they are cross-posting? Or just warn.
        }

        setLoading(true);
        setError("");
        try {
            // Use Server Action
            const data = await scrapeSocialMetadata(inputUrl, platform);

            if (data) {
                setPreview({
                    ...data,
                    platform: platform,
                    original_url: inputUrl
                });
                // Fill caption only if it is currently empty
                if (!caption) {
                    if (data.description) setCaption(data.description);
                    else if (data.title && data.title !== "Social Post") setCaption(data.title);
                }
            } else {
                // Fallback for manual entry
                setPreview({
                    title: "Manual Entry (Gagal Scrape)",
                    description: caption || "", // Keep existing caption if any
                    thumbnail_url: "",
                    author_name: "Unknown",
                    original_url: inputUrl,
                    platform: platform
                });
            }
        } catch (e: any) {
            console.error(e);
            setPreview({
                title: "Manual Entry (Error)",
                description: caption || "",
                thumbnail_url: "",
                author_name: "Unknown",
                original_url: inputUrl,
                platform: platform
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preview) return;
        setLoading(true);
        setError("");
        try {
            // 1. Prepare FormData
            const formData = new FormData();
            if (initialData?.id) {
                formData.append("id", initialData.id);
            }

            formData.append("platform", platform);
            formData.append("url", url || preview.original_url || "");
            formData.append("caption", caption || preview.description || "");
            formData.append("is_active", "true");
            formData.append("embed_code", preview.embed_code || "");

            // 2. Handle Thumbnail
            if (uploadedFile) {
                // Manual file or pasted screenshot
                formData.append("thumbnail", uploadedFile);
            } else if (preview.thumbnail_url && preview.thumbnail_url.startsWith("http")) {
                const isInternal = preview.thumbnail_url.includes("/api/files/");
                if (!isInternal) {
                    // It's a fresh scraper URL, download it to make it "physical"
                    try {
                        const res = await fetch(preview.thumbnail_url);
                        if (res.ok) {
                            const blob = await res.blob();
                            const fileName = `${platform}-${Date.now()}.jpg`;
                            const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
                            formData.append("thumbnail", file);
                        }
                    } catch (e) {
                        console.warn("Download failed, saving as string URL:", e);
                        formData.append("thumbnail_url", preview.thumbnail_url);
                    }
                } else {
                    // It's already internal PB URL (e.g. from media collection or previous upload)
                    formData.append("thumbnail_url", preview.thumbnail_url);
                }
            }

            await onSave(formData);
            onClose();
        } catch (e: any) {
            console.error(e);
            setError("Gagal menyimpan: " + e.message);
        } finally {
            setLoading(false);
        }
    };


    // Platform Colors
    const colors: Record<string, string> = {
        instagram: "bg-pink-600",
        facebook: "bg-blue-600",
        tiktok: "bg-black",
        youtube: "bg-red-600"
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className={`bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-transform flex flex-col max-h-[90vh] ${isOpen ? "scale-100" : "scale-95"}`}>

                {/* Header */}
                <div className={`p-6 rounded-t-2xl text-white flex justify-between items-start shrink-0 ${colors[platform] || "bg-slate-700"}`}>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 capitalize">
                            Tambah Konten {platform}
                        </h2>
                        <p className="text-white/80 text-sm mt-1">
                            Ambil konten dari {platform} atau upload manual
                        </p>
                        {profileUrl && (
                            <div className="mt-3 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                <span className="text-xs font-mono truncate max-w-[200px]" title={profileUrl}>
                                    {profileUrl}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(profileUrl);
                                        // Optional: toast or state change for feedback
                                    }}
                                    className="hover:text-white text-white/70 transition-colors"
                                    title="Copy Profile URL"
                                >
                                    <Clipboard className="w-3.5 h-3.5" />
                                </button>
                                <a
                                    href={profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white text-white/70 transition-colors"
                                    title="Open Profile"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar" onPaste={handlePasteEvent}>

                    {/* URL Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Link Postingan</label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={`https://www.${platform}.com/...`}
                            className="w-full font-mono text-sm"
                        />
                        {error && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {error}
                            </p>
                        )}
                    </div>

                    {/* Preview Area */}
                    {loading && (
                        <div className="py-8 text-center text-slate-400 animate-pulse">
                            Memproses Magic Fetch...
                        </div>
                    )}

                    {/* Always show preview area if we have data OR we want to allow upload */}
                    <div className={`border rounded-xl overflow-hidden bg-slate-50 transition-all ${preview || uploadedFile ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                        <div className="relative h-56 bg-slate-200 group">
                            {(previewUrl || preview?.thumbnail_url) ? (
                                <img
                                    src={previewUrl || preview?.thumbnail_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center">
                                    <p className="mb-2">No Thumbnail</p>
                                    <p className="text-xs">Paste Image (Ctrl+V) or Click to Upload</p>
                                </div>
                            )}

                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    Upload
                                </button>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg border border-white/20">
                                    💡 Klik di sini & tekan <kbd className="bg-white/20 px-1 rounded">Ctrl+V</kbd> untuk tempel gambar
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                                }}
                            />
                        </div>

                    </div>
                    {preview && (
                        <div className="p-3 bg-white border-t border-slate-100">
                            <p className="text-xs text-slate-500 capitalize">By {preview.author_name}</p>
                        </div>
                    )}
                </div>


                {/* Caption Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Caption</label>
                    <textarea
                        value={caption || ""}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        placeholder="Tulis caption..."
                    />
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Batal
                    </button>
                    <TactileButton
                        onClick={handleSave}
                        disabled={loading || (!preview && !url && !uploadedFile)}
                        className={colors[platform] || "bg-emerald-600"}
                    >
                        {loading ? "Menyimpan..." : "Simpan Konten"}
                    </TactileButton>
                </div>
            </div>
        </div>
    );
}

