"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pb } from "@/lib/pb";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTime = useRef(Date.now());
    const hasTracked = useRef(false);

    useEffect(() => {
        // Reset tracking on route change
        hasTracked.current = false;
        startTime.current = Date.now();

        // Small delay to ensure we don't track rapid redirects
        const timer = setTimeout(() => {
            if (hasTracked.current) return;

            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

            // Send to PB
            pb.collection('analytics_events').create({
                event_type: 'page_view',
                path: fullPath,
                referrer: document.referrer || '',
                ua: navigator.userAgent,
                screen_width: window.innerWidth,
                language: navigator.language,
                session_id: getSessionId()
            }).catch(err => {
                // Silent fail (analytics should not break app)
                // console.error("Analytics Error:", err); 
            });

            hasTracked.current = true;
        }, 1000); // 1s delay to count as "view"

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return null; // Headless component
}

// Simple Session Helper
function getSessionId() {
    let sid = sessionStorage.getItem("analytics_sid");
    if (!sid) {
        sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("analytics_sid", sid);
    }
    return sid;
}
