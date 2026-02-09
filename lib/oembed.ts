export interface OEmbedData {
    title: string;
    thumbnail_url: string;
    author_name: string;
    author_url: string;
    html?: string;
}

export async function fetchOEmbed(url: string, platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook'): Promise<OEmbedData | null> {
    try {
        if (!url) return null;

        // Basic validation for http
        if (!url.startsWith('http')) return null;

        // Basic URL cleaning
        let cleanUrl = url.split('?')[0]; // Remove query params by default for some

        if (platform === 'youtube') {
            // YT needs format=json
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oembedUrl);
            if (!res.ok) throw new Error('Failed to fetch YouTube oEmbed');
            return await res.json();
        }

        if (platform === 'tiktok') {
            try {
                const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
                const res = await fetch(oembedUrl);
                if (!res.ok) throw new Error('Failed to fetch TikTok oEmbed');
                return await res.json();
            } catch (err) {
                // TikTok oEmbed failed (likely 404 or bad URL), return basic fallback
                console.warn("TikTok oEmbed failed", err);
                // Return null to allow falling through to generic fallback at function end?
                // The structure of this function has return at end.
                // If I just catch and do nothing, it exits this block and goes to next if (instagram).
                // Then at the end it returns generic fallback? 
                // Wait, if I don't return, it goes to next `if`.
                // Eventually it hits return null at line 73? 
                // NO. Line 73 returns null.

                // I want it to fall back to the GENERIC return at the catch(e) of the MAIN function?
                // OR I can return the generic structure here.

                // If I throw, it goes to line 74 catch(e) and returns generic there.
                // SO WHY DID IT FAIL?
                // Ah, the user saw "Console TypeError: Failed to fetch".
                // That might be the browser's console log for the network request itself, NOT my throw?
                // BUT the stack trace says `lib/oembed.ts (30:35)`.
                // If I catch it here, I should probably return a manual fallback here to be safe and avoiding re-throw.
                return {
                    title: 'TikTok Post',
                    thumbnail_url: '',
                    author_name: 'TikTok User',
                    author_url: url,
                    html: ''
                };
            }
        }

        if (platform === 'instagram') {
            // Instagram LEGACY oEmbed is deprecated and requires auth.
            // Without API key, we can't get thumbnail/title reliably from client-side.
            // However, we can parse the ID and return a placeholder so the link is saved.
            // ID is usually /p/ID or /reel/ID
            const idMatch = url.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
            const id = idMatch ? idMatch[2] : 'unknown';

            return {
                title: `Instagram Post (${id})`,
                thumbnail_url: '', // User will have to upload manually if needed, or we use a generic placeholder
                author_name: 'Instagram User',
                author_url: url,
                html: ''
            }
        }

        if (platform === 'facebook') {
            // Facebook oEmbed also requires auth.
            return {
                title: `Facebook Post`,
                thumbnail_url: '',
                author_name: 'Facebook User',
                author_url: url,
                html: ''
            }
        }

        return null;
    } catch (e) {
        console.error("oEmbed Error:", e);
        // Fallback: return structure with original URL so it can be saved even if fetch failed
        return {
            title: 'Social Content',
            thumbnail_url: '',
            author_name: '',
            author_url: url,
            html: ''
        };
    }
}

export function getPlatformFromUrl(url: string): 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'other' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return 'other';
}

// Alias for compatibility
export const getOEmbedData = async (url: string) => {
    const platform = getPlatformFromUrl(url);
    if (platform === 'other') return null;
    return await fetchOEmbed(url, platform);
};
