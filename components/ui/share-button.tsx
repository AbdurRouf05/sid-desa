"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title: title,
            text: text || "Cek info menarik ini dari BMT NU Lumajang!",
            url: url || window.location.href,
        };

        // 1. Log the event immediately
        try {
            const sessionId = sessionStorage.getItem('analytics_session_id') || "unknown";
            const visitorId = localStorage.getItem('analytics_visitor_id') || "unknown";

            await pb.collection('analytics_logs').create({
                session_id: sessionId,
                visitor_id: visitorId,
                path: window.location.pathname,
                source_category: "Engagement",
                device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                is_share_event: true,
                dwell_time_seconds: 0
            });
        } catch (e) {
            console.error("Share log error", e);
        }

        // 2. Trigger Native Share or Fallback
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled share, ignore
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link berhasil disalin!");
            } catch (err) {
                console.error("Failed to copy", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm",
                className
            )}
        >
            <Share2 className="w-4 h-4" />
            Bagikan
        </button>
    );
}
