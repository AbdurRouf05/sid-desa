// file: app/api/analytics/stats/public/route.ts
import { NextResponse } from "next/server";
import { pb } from "@/lib/pb";

// Cache for 5 minutes (300 seconds) since public stats don't need to be precise up to the second
export const revalidate = 300;

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Fetch Total Views
        const totalReq = pb.collection('analytics_events').getList(1, 1, {
            filter: 'event_type = "page_view"',
            skipTotal: false
        });

        // Fetch Today Views
        const todayReq = pb.collection('analytics_events').getList(1, 1, {
            filter: `event_type = "page_view" && created >= "${today.toISOString()}"`,
            skipTotal: false
        });

        // Fetch Yesterday Views
        const yesterdayReq = pb.collection('analytics_events').getList(1, 1, {
            filter: `event_type = "page_view" && created >= "${yesterday.toISOString()}" && created < "${today.toISOString()}"`,
            skipTotal: false
        });

        const [totalRes, todayRes, yesterdayRes] = await Promise.all([totalReq, todayReq, yesterdayReq]);

        // Just get the top browser/OS from a recent sampling to save complex DB aggregration time
        const recentSample = await pb.collection('analytics_events').getList(1, 50, {
            filter: 'event_type = "page_view" && user_agent != ""',
            sort: '-created'
        });

        let topOs = "Windows";
        let topBrowser = "Chrome";

        if (recentSample.items.length > 0) {
            const osCounts: Record<string, number> = {};
            const browserCounts: Record<string, number> = {};

            recentSample.items.forEach(item => {
                const ua = (item.user_agent || "").toLowerCase();
                
                // OS
                if (ua.includes('windows')) osCounts['Windows'] = (osCounts['Windows'] || 0) + 1;
                else if (ua.includes('mac')) osCounts['MacOS'] = (osCounts['MacOS'] || 0) + 1;
                else if (ua.includes('android')) osCounts['Android'] = (osCounts['Android'] || 0) + 1;
                else if (ua.includes('iphone') || ua.includes('ipad')) osCounts['iOS'] = (osCounts['iOS'] || 0) + 1;
                else osCounts['Lainnya'] = (osCounts['Lainnya'] || 0) + 1;

                // Browser
                if (ua.includes('chrome') && !ua.includes('edge')) browserCounts['Chrome'] = (browserCounts['Chrome'] || 0) + 1;
                else if (ua.includes('safari') && !ua.includes('chrome')) browserCounts['Safari'] = (browserCounts['Safari'] || 0) + 1;
                else if (ua.includes('firefox')) browserCounts['Firefox'] = (browserCounts['Firefox'] || 0) + 1;
                else if (ua.includes('edge')) browserCounts['Edge'] = (browserCounts['Edge'] || 0) + 1;
                else browserCounts['Lainnya'] = (browserCounts['Lainnya'] || 0) + 1;
            });

            const getTop = (obj: Record<string, number>) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
            
            topOs = getTop(osCounts);
            topBrowser = getTop(browserCounts);
        }

        return NextResponse.json({
            hari_ini: todayRes.totalItems || 0,
            kemarin: yesterdayRes.totalItems || 0,
            total: totalRes.totalItems || 0,
            top_os: topOs,
            top_browser: topBrowser
        });

    } catch (e) {
        console.error("Failed to fetch public stats", e);
        return NextResponse.json({ 
            hari_ini: 0, 
            kemarin: 0, 
            total: 0,
            top_os: "N/A",
            top_browser: "N/A"
        });
    }
}
