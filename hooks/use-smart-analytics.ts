"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pb } from '@/lib/pb';

interface AnalyticsPayload {
    session_id: string;
    visitor_id: string;
    path: string;
    source_category: string;
    referrer_url: string;
    country?: string;
    device: string;
    dwell_time_seconds: number;
    scroll_depth: number;
    is_share_event: boolean;
}

export function useSmartAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTimeRef = useRef<number>(Date.now());
    const maxScrollRef = useRef<number>(0);

    useEffect(() => {
        // Reset metrics on route change
        startTimeRef.current = Date.now();
        maxScrollRef.current = 0;

        // 1. Session & Visitor ID Management
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem('analytics_session_id', sessionId);
        }

        let visitorId = localStorage.getItem('analytics_visitor_id');
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('analytics_visitor_id', visitorId);
        }

        // 2. Source Detection
        const referrer = document.referrer || "";
        let sourceCategory = "Unknown";

        if (referrer.includes("google.com")) sourceCategory = "Organic Search";
        else if (referrer.includes("instagram.com") || referrer.includes("t.co") || referrer.includes("facebook.com")) sourceCategory = "Social Media";
        else if (referrer === "" || referrer.includes(window.location.hostname)) sourceCategory = "Direct"; // Internal or Direct
        else sourceCategory = "Referral";

        // 3. Scroll Tracking
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
            if (scrollPercent > maxScrollRef.current) {
                maxScrollRef.current = Math.min(Math.round(scrollPercent), 100);
            }
        };
        window.addEventListener('scroll', handleScroll);

        // 4. Country Detection (Optional / Lazy)
        // Fetch only if not in sessionStorage to save bandwidth
        if (!sessionStorage.getItem('analytics_country')) {
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data.country_name) {
                        sessionStorage.setItem('analytics_country', data.country_name);
                    }
                })
                .catch(() => { /* Ignore errors */ });
        }

        // 5. Send Data on Unmount / Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);

            const endTime = Date.now();
            const dwellTime = (endTime - startTimeRef.current) / 1000;
            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

            const payload: AnalyticsPayload = {
                session_id: sessionId!,
                visitor_id: visitorId!,
                path: fullPath,
                source_category: sourceCategory,
                referrer_url: referrer,
                country: sessionStorage.getItem('analytics_country') || "Unknown",
                device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                dwell_time_seconds: Math.round(dwellTime),
                scroll_depth: maxScrollRef.current,
                is_share_event: false
            };

            // Use keepalive to ensure request completes even after unload
            // Note: PocketBase SDK 'create' does not directly expose fetch options easily in all versions,
            // but we can assume 'pb.collection(...).create(data, { $autoCancel: false })' combined with standard fetch behavior? 
            // Actually, for pure 'sendBeacon' reliability, we might need to use standard fetch if SDK fails.
            // But let's try direct SDK first. If it fails, we fall back to manual fetch to PB endpoint.

            // For robust 'leaving' analytics, manual fetch is safer with keepalive:true
            const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

            fetch(`${pbUrl}/api/collections/analytics_logs/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(err => console.error("Analytics Error", err));
        };
    }, [pathname, searchParams]);
}
