"use server";

interface ScrapedMetadata {
    title: string;
    description: string;
    thumbnail_url: string;
    author_name: string;
    original_url: string;
    platform: string;
}

// Helper to decode HTML entities (Decimal & Hex)
function decodeHtmlEntities(text: string): string {
    if (!text) return "";
    return text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        // Handle Decimal (e.g. &#33;)
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        // Handle Hex (e.g. &#x1F331;)
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function cleanInstagramCaption(text: string): string {
    // Instagram OG:Description often starts with "X Likes, Y Comments - User (@handle) on Instagram: "
    const parts = text.split(': "');
    if (parts.length > 1) {
        // Return everything after the first match, and remove the trailing quote if present
        let content = parts.slice(1).join(': "');
        if (content.endsWith('"')) content = content.slice(0, -1);
        return content;
    }

    // Fallback: simple split by ": " if the quote pattern doesn't match
    const simpleParts = text.indexOf(": ");
    if (simpleParts > -1 && simpleParts < 100) {
        return text.substring(simpleParts + 2);
    }
    return text;
}

// Helper to clean captions/titles that are actually URLs
function isUrl(text: string): boolean {
    if (!text) return false;
    const clean = text.trim();
    return clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("www.") || (clean.length > 5 && clean.indexOf(".") > 0 && !clean.includes(" "));
}

function cleanScrapedText(text: string): string {
    if (isUrl(text)) return "";
    return decodeHtmlEntities(text).trim();
}
// Helper to fetch and scrape HTML
const fetchHtmlData = async (targetUrl: string) => {
    const headers = {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "Cache-Control": "max-age=0",
    };
    try {
        const res = await fetch(targetUrl, { headers, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const html = await res.text();

        const getMeta = (prop: string) => {
            // Match property="..." or name="..."
            const regex = new RegExp(`<meta [^>]*?(?:property|name)=["']${prop}["'] [^>]*?content=["']([^"']*)["']`, "i");
            const match = html.match(regex);
            if (match) return match[1];

            // Reversed order
            const regexRev = new RegExp(`<meta [^>]*?content=["']([^"']*)["'] [^>]*?(?:property|name)=["']${prop}["']`, "i");
            const matchRev = html.match(regexRev);
            return matchRev ? matchRev[1] : "";
        };

        return {
            title: getMeta("og:title") || getMeta("twitter:title") || getMeta("title") || "",
            description: getMeta("og:description") || getMeta("description") || getMeta("twitter:description") || "",
            image: getMeta("og:image") || getMeta("twitter:image") || getMeta("image") || ""
        };
    } catch (e) {
        console.warn("HTML Scrape failed", e);
        return null;
    }
};


export async function scrapeSocialMetadata(url: string, platform: string): Promise<ScrapedMetadata | null> {
    try {
        if (!url || !url.startsWith("http")) return null;

        // Clean URL (remove query params for better oEmbed hit rate)
        let cleanUrl = url;
        try {
            const u = new URL(url);
            // For TikTok/IG/FB, pure path is usually enough and safer.
            if (platform === 'tiktok' || platform === 'instagram' || platform === 'facebook') {
                cleanUrl = `${u.origin}${u.pathname}`;
            }
            // For YouTube, we need specific params
            if (platform === 'youtube') {
                if (u.hostname.includes('youtu.be')) {
                    cleanUrl = `${u.origin}${u.pathname}`;
                } else {
                    const v = u.searchParams.get('v');
                    if (v) cleanUrl = `${u.origin}${u.pathname}?v=${v}`;
                }
            }
        } catch (e) {
            cleanUrl = url;
        }

        // Platform specific strategies

        // TikTok Strategy: oEmbed + HTML Fallback for Image
        if (platform === "tiktok") {
            try {
                const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
                const oembedRes = await fetch(oembedUrl);
                let data: any = {};

                if (oembedRes.ok) {
                    data = await oembedRes.json();
                }

                // If oEmbed missed thumbnail (common for Photo Mode), try HTML scrape
                let scraped: any = await fetchHtmlData(cleanUrl);

                const title = cleanScrapedText(data.title || scraped?.title || "TikTok Post");
                let description = cleanScrapedText(scraped?.description || "");

                // If description is empty but we have a non-URL title from oembed, use that
                if (!description && data.title && !isUrl(data.title)) {
                    description = data.title;
                }

                return {
                    title: title || "TikTok Post",
                    description: description,
                    thumbnail_url: data.thumbnail_url || scraped?.image || "",
                    author_name: data.author_name || "TikTok User",
                    original_url: url,
                    platform: platform
                };
            } catch (err) {
                console.warn("TikTok Strategy failed", err);
            }
        }


        // YouTube Strategy: oEmbed (Title/Thumb) + HTML (Description)
        if (platform === 'youtube') {
            try {
                const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;

                // Run in parallel
                const [oembedRes, scraped] = await Promise.all([
                    fetch(oembedUrl),
                    fetchHtmlData(cleanUrl)
                ]);

                let data: any = {};
                if (oembedRes.ok) data = await oembedRes.json();

                const title = decodeHtmlEntities(data.title || scraped?.title || "YouTube Video");
                const desc = decodeHtmlEntities(scraped?.description || "");

                return {
                    title: title,
                    // User requested: [judul] \n\n [caption]
                    description: desc ? `${title}\n\n${desc}` : title,
                    thumbnail_url: data.thumbnail_url || scraped?.image || "",
                    author_name: data.author_name || "YouTuber",
                    original_url: url,
                    platform: platform
                };

            } catch (err) {
                console.warn("YouTube Strategy failed", err);
            }
        }

        // Facebook Strategy: Enhanced HTML Discovery
        if (platform === 'facebook') {
            try {
                // Ensure desktop URL for scraping
                let fbUrl = cleanUrl.replace("m.facebook.com", "www.facebook.com");
                const scraped = await fetchHtmlData(fbUrl);

                if (scraped) {
                    let title = cleanScrapedText(scraped.title.replace(/ \| Facebook/g, "").replace("Log into Facebook", ""));
                    let description = cleanScrapedText(scraped.description);

                    return {
                        title: title || "Facebook Post",
                        description: description,
                        thumbnail_url: scraped.image,
                        author_name: "Facebook User",
                        original_url: url,
                        platform: platform
                    };
                }
            } catch (err) {
                console.warn("Facebook Strategy failed", err);
            }
        }


        // Fallback / Others (IG)
        const scraped = await fetchHtmlData(cleanUrl);
        if (!scraped) return null;

        let title = cleanScrapedText(scraped.title.replace(/ \| Instagram/g, "").replace(/ \| Facebook/g, "").replace(/ on TikTok/g, ""));
        let description = cleanScrapedText(scraped.description);

        // Clean Instagram Description
        if (platform === 'instagram' && description) {
            description = cleanInstagramCaption(description);
        }

        return {
            title: title || "Social Post",
            description: description,
            thumbnail_url: scraped.image,
            author_name: "",
            original_url: url,
            platform: platform
        };

    } catch (e) {
        console.error("Scrape Error:", e);
        return null;
    }
}
