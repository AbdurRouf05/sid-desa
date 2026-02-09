"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTime = useRef(Date.now());

    // Helper to send data
    const sendEvent = async (type: string, path: string, duration?: number) => {
        try {
            const body = {
                event_type: type,
                path,
                session_id: getSessionId(),
                referrer: document.referrer || '',
                duration: duration || 0,
                label: "web_v1"
            };

            if (type === 'page_leave' && navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
                navigator.sendBeacon('/api/analytics/track', blob);
            } else {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            }
        } catch (e) {
            // Passive error handling
        }
    };

    useEffect(() => {
        // --- 1. PRIVACY: Ignore /panel ---
        if (pathname.startsWith('/panel')) return;

        const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        startTime.current = Date.now();

        // Delay view to avoid bounce tracking (< 1s)
        const viewTimer = setTimeout(() => {
            sendEvent('page_view', fullPath);
        }, 1000);

        // --- 2. PAGE UNMOUNT ---
        return () => {
            clearTimeout(viewTimer);
            const durationArr = Math.floor((Date.now() - startTime.current) / 1000);

            if (durationArr > 1) {
                sendEvent('page_leave', fullPath, durationArr);
            }
        };
    }, [pathname, searchParams]);

    return null;
}

function getSessionId() {
    if (typeof window === 'undefined') return "server-side";
    let sid = sessionStorage.getItem("analytics_sid");
    if (!sid) {
        sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("analytics_sid", sid);
    }
    return sid;
}
