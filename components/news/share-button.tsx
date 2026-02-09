"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
    title: string;
    url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
    const handleShare = async () => {
        // Track the share event
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'share_click',
                    path: window.location.pathname,
                    label: `platform:native`,
                    session_id: sessionStorage.getItem("analytics_sid") || "unknown"
                })
            });
        } catch (e) { }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Baca berita terbaru dari BMT NU Lumajang: ${title}`,
                    url: url || window.location.href,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url || window.location.href);
                toast.success("Link berhasil disalin!");
            } catch (err) {
                toast.error("Gagal menyalin link.");
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors"
        >
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Bagikan</span>
        </button>
    );
}
