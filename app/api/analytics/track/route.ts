import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pb";
import crypto from "crypto";

// --- PRIVACY & SECURITY CONFIG ---
// We use a daily rotating salt to ensure hashes cannot be reversed or linked across days.
const SALT_SECRET = process.env.ANALYTICS_SALT || "sid-secret-salt-v1";

function getDailyHash(ip: string, userAgent: string, path: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const raw = `${ip}|${userAgent}|${path}|${today}|${SALT_SECRET}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
}

function getSourceFromReferrer(referrer: string): string {
    if (!referrer) return "Direct";
    const lowerRef = referrer.toLowerCase();
    if (lowerRef.includes("google")) return "Google Search";
    if (lowerRef.includes("bing") || lowerRef.includes("yahoo") || lowerRef.includes("duckduckgo")) return "Search Engine";
    if (lowerRef.includes("facebook") || lowerRef.includes("instagram") || lowerRef.includes("tiktok") || lowerRef.includes("t.co") || lowerRef.includes("twitter")) return "Social Media";
    if (lowerRef.includes("gemini") || lowerRef.includes("chatgpt") || lowerRef.includes("claude")) return "AI Assistant"; // As requested ;)
    return "Referral";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event_type, path, label, referrer, session_id, duration } = body;

        // --- SECURITY: Ignore /panel tracking ---
        if (path?.startsWith('/panel')) {
            return NextResponse.json({ skipped: true, reason: "admin_path" });
        }

        // 1. Get IP & UA
        const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "unknown";

        let country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");

        // Fallback: Fetch Country if missing and not localhost
        if (!country || country === 'Unknown') {
            if (ip === '127.0.0.1' || ip === '::1') {
                country = 'Local';
            } else {
                try {
                    // Timeout to prevent hanging
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1500);

                    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.status === 'success') {
                            country = geoData.countryCode;
                        }
                    }
                } catch (e) {
                    // Ignore lookup errors
                }
            }
        }

        // Default to Unknown if still missing
        country = country || "Unknown";

        // 2. Generate Unique Daily Hash (Fingerprint)
        const uniqueEventId = getDailyHash(ip, userAgent, path);

        // 3. De-duplication Logic (Only for 'page_view')
        if (event_type === 'page_view') {
            try {
                // FILTER: Timestamp based de-dupe (5 mins)
                const lastEvents = await pb.collection('analytics_events').getList(1, 1, {
                    filter: `session_id = "${session_id}" && path = "${path}" && created >= "${new Date(Date.now() - 5 * 60 * 1000).toISOString()}"`,
                    sort: '-created'
                });

                if (lastEvents.items.length > 0) {
                    return NextResponse.json({ skipped: true, reason: "duplicate_view_5min" });
                }

            } catch (e) {
                // If DB query fails, just proceed to create
            }
        }

        // 4. Create Record
        // We use our server-side admin client to write
        await pb.collection('analytics_events').create({
            event_type,
            path,
            duration: duration || 0,
            session_id, // Client-side session (for flow tracking)
            user_agent: userAgent,
            referrer: referrer,
            source: getSourceFromReferrer(referrer),
            country: country,
            label: label || `ip_hash:${uniqueEventId.substring(0, 8)}`, // Store partial hash for debugging unique visitors
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Analytics API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
