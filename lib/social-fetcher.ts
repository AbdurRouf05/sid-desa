import { pb } from './pb';

/**
 * SOCIAL MEDIA FETCHER UTILITY
 * Handles fetching content from external platforms via RSS or OEmbed.
 */

interface OEmbedResult {
    title?: string;
    thumbnail_url?: string;
    html?: string;
    author_name?: string;
}

// --- PUBLIC PROVIDERS ---
// Using NoEmbed or Official Public Endpoints where available without Auth
const PROVIDERS = {
    TIKTOK: "https://www.tiktok.com/oembed?url=",
    YOUTUBE: "https://www.youtube.com/oembed?url=",
    // INSTAGRAM: DEPRECATED public endpoint. Valid endpoint requires Graph API Token.
};

/**
 * 1. Resolve Single Post (OEmbed)
 * Useful when Admin pastes a URL manually.
 */
export async function resolveSocialPost(url: string): Promise<OEmbedResult | null> {
    try {
        let apiUrl = "";

        if (url.includes("tiktok.com")) {
            apiUrl = `${PROVIDERS.TIKTOK}${encodeURIComponent(url)}`;
        } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
            apiUrl = `${PROVIDERS.YOUTUBE}${encodeURIComponent(url)}&format=json`;
        } else if (url.includes("instagram.com")) {
            // HYBRID STRATEGY: Instagram blocks servers without tokens.
            // We return a "Constructed" OEmbed result specifically for our frontend to handle.
            // The frontend will use <blockquote class="instagram-media"> script.
            return {
                title: "Instagram Post",
                html: `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote><script async src="//www.instagram.com/embed.js"></script>`,
                thumbnail_url: "" // Cannot fetch without key
            };
        }

        if (!apiUrl) return null;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Provider returned error");

        const data = await res.json();
        return {
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            html: data.html,
            author_name: data.author_name
        };

    } catch (e) {
        console.error("Resolve Social Post Error:", e);
        // Fallback for YouTube/TikTok if OEmbed fails
        if (url.includes("youtube") || url.includes("youtu.be")) {
            const videoId = url.split('v=')[1] || url.split('/').pop();
            return {
                title: "YouTube Video",
                html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
                thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            };
        }
        return null;
    }
}

/**
 * 2. Fetch YouTube Feed (RSS)
 * Valid for "Auto Sync" feature.
 */
export async function fetchYouTubeFeed(channelIdOrUser: string) {
    // Attempt Channel ID first (UC...)
    const isChannelId = channelIdOrUser.startsWith("UC");
    const rssUrl = isChannelId
        ? `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdOrUser}`
        : `https://www.youtube.com/feeds/videos.xml?user=${channelIdOrUser}`;

    try {
        const res = await fetch(rssUrl);
        const xmlText = await res.text();

        // Simple XML Parse (Regex to avoid huge dependency)
        // Extract <entry> items
        const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];

        return entries.map(entry => {
            const titleMatch = entry.match(/<title>(.*?)<\/title>/);
            const linkMatch = entry.match(/href="(.*?)"/);
            const mediaGroupMatch = entry.match(/<media:thumbnail url="(.*?)"/);
            // videoId is usually inside <yt:videoId>
            const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);

            const videoId = videoIdMatch ? videoIdMatch[1] : "";

            return {
                title: titleMatch ? titleMatch[1] : "No Title",
                url: linkMatch ? linkMatch[1] : `https://youtube.com/watch?v=${videoId}`,
                thumbnail: mediaGroupMatch ? mediaGroupMatch[1] : "",
                videoId
            };
        });

    } catch (e) {
        console.error("YouTube Feed Error", e);
        return [];
    }
}
