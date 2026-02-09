import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pb";

// Security: Require a secret key to run this generic "cron" task
const CRON_SECRET = process.env.CRON_SECRET || "bmt-nu-archive-key-v1";

export async function POST(req: NextRequest) {
    try {
        // 1. Authorization
        // 1. Authorization
        const authHeader = req.headers.get("authorization");
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('key');

        if (authHeader !== `Bearer ${CRON_SECRET}` && apiKey !== CRON_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Define Cutoff Date (Data older than 1 month)
        // Adjust logic: "setiap tanggal 25... menghapus data bulan lalu"
        // We'll simplisticly take anything older than 30 days to be safe.
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        const cutoffISO = cutoffDate.toISOString();

        // 3. Fetch Raw Data (Pagination loop needed for large datasets, strictly we'd do this internally in Go/SQL but via API we batch it)
        // LIMITATION: Fetching 10k+ records via API is slow. We'll do a batch limit.
        const BATCH_SIZE = 500;

        const records = await pb.collection('analytics_events').getList(1, BATCH_SIZE, {
            filter: `created < "${cutoffISO}"`,
            sort: 'created'
        });

        if (records.items.length === 0) {
            return NextResponse.json({ message: "No old records to archive." });
        }

        // 4. In-Memory Aggregation (Global for the batch/month)
        // We aggregate EVERYTHING into one big report object for the month

        // RE-REFACTOR: Group by Month Key first
        const monthlyBatches: Record<string, {
            views: number,
            duration: number,
            visitors: Set<string>,
            pages: Record<string, { views: number, duration: number, visitors: Set<string> }>,
            sources: Record<string, number>,
            countries: Record<string, number>
        }> = {};

        for (const item of records.items) {
            const date = new Date(item.created);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

            if (!monthlyBatches[monthKey]) {
                monthlyBatches[monthKey] = {
                    views: 0,
                    duration: 0,
                    visitors: new Set(),
                    pages: {},
                    sources: {},
                    countries: {}
                };
            }

            const batch = monthlyBatches[monthKey];
            const path = item.path || "/";
            const source = item.source || "Direct";
            const country = item.country || "Unknown";

            // Global Month Stats
            if (item.event_type === 'page_view') {
                batch.views++;
                if (item.session_id) batch.visitors.add(item.session_id);

                // Page Stats
                if (!batch.pages[path]) {
                    batch.pages[path] = { views: 0, duration: 0, visitors: new Set() };
                }
                batch.pages[path].views++;
                if (item.session_id) batch.pages[path].visitors.add(item.session_id);

                // Source Stats
                batch.sources[source] = (batch.sources[source] || 0) + 1;

                // Country Stats
                batch.countries[country] = (batch.countries[country] || 0) + 1;
            }

            // Duration (can come from page_leave or page_view updates)
            if (item.duration) {
                batch.duration += item.duration;
                // Add to page duration too
                if (batch.pages[path]) { // Should exist if view came first, but safety check
                    batch.pages[path].duration += item.duration;
                }
            }
        }

        // 5. Commit to "Analytics_Reports" Collection (1 row per month)
        // Schema: month_key (text index), report_data (json)
        // report_data will contain: { top_pages: [], top_sources: [], ... }

        let processedMonths = 0;
        let errors: any[] = [];

        for (const mKey of Object.keys(monthlyBatches)) {
            const batch = monthlyBatches[mKey];

            // Convert Sets to counts and Sort Lists
            const sortedPages = Object.entries(batch.pages)
                .map(([p, data]) => ({
                    path: p,
                    views: data.views,
                    visitors: data.visitors.size,
                    avg_duration: data.views > 0 ? Math.round(data.duration / data.views) : 0
                }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 100); // Top 100 pages only to save space

            const sortedSources = Object.entries(batch.sources)
                .map(([s, count]) => ({ source: s, count }))
                .sort((a, b) => b.count - a.count);

            const sortedCountries = Object.entries(batch.countries)
                .map(([c, count]) => ({ country: c, count }))
                .sort((a, b) => b.count - a.count);

            // Construct Rich JSON
            const richReport = {
                meta: {
                    generated_at: new Date().toISOString(),
                    total_views: batch.views,
                    total_visitors: batch.visitors.size,
                    avg_session_duration: batch.views > 0 ? Math.round(batch.duration / batch.views) : 0,
                },
                top_pages: sortedPages,
                demographics: {
                    sources: sortedSources,
                    countries: sortedCountries
                }
            };

            // Upsert Logic
            let existingID = null;
            let existingReport: any = null;

            try {
                const exist = await pb.collection('analytics_monthly').getFirstListItem(`month_key = "${mKey}"`);
                existingID = exist.id;
                existingReport = exist;
            } catch (e) { }

            try {
                if (existingID) {
                    // Update existing month report
                    await pb.collection('analytics_monthly').update(existingID, {
                        data: richReport // Replaces with new complete report of the batch
                    });
                } else {
                    // Create new month report
                    await pb.collection('analytics_monthly').create({
                        month_key: mKey,
                        data: richReport
                    });
                }
                processedMonths++;
            } catch (e: any) {
                console.error("Archive Error", e);
                errors.push({ month: mKey, error: e.message });
            }
        }

        // 6. Delete Raw Records
        if (errors.length === 0 && processedMonths > 0) {
            const deletePromises = records.items.map(r => pb.collection('analytics_events').delete(r.id));
            await Promise.all(deletePromises);
            return NextResponse.json({
                success: true,
                archived_months: processedMonths,
                deleted_rows: records.items.length
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Partial archive failure, raw records NOT deleted to prevent data loss.",
                errors
            }, { status: 500 });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
