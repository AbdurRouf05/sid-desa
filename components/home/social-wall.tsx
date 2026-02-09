"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pb } from "@/lib/pb";
import { Pin, ExternalLink, Youtube, Instagram, Facebook, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAssetUrl } from "@/lib/cdn";

import { useUiLabels } from "@/components/providers/ui-labels-provider";

// Simple Tiktok Icon for brand consistency (Matches Footer)
const TiktokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const MAX_DISPLAY = 15;

export function SocialWall() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { getLabel } = useUiLabels();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const records = await pb.collection('social_feeds').getList(1, 40, {
                    sort: '-is_pinned,-id',
                });

                let processedPosts = [...records.items];

                // Shuffle logic for fresh content
                if (processedPosts.length > MAX_DISPLAY) {
                    const pinned = processedPosts.filter(p => p.is_pinned);
                    const regular = processedPosts.filter(p => !p.is_pinned);
                    const shuffledRegular = regular.sort(() => Math.random() - 0.5);
                    processedPosts = [...pinned, ...shuffledRegular].slice(0, MAX_DISPLAY);
                }

                setPosts(processedPosts);
            } catch (e) {
                console.error("Social Wall Fetch Error", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <SocialSkeleton />;
    if (posts.length === 0) return null;

    return (
        <div className="space-y-12">
            <div className="text-left md:text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-emerald-950 mb-4">{getLabel('section_social_title', 'Sosial Media')}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{getLabel('section_social_subtitle', 'Ikuti perkembangan terbaru kami melalui kanal sosial media resmi.')}</p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-8 [column-fill:_balance]">
                {posts.map((post) => (
                    <SocialCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

function SocialCard({ post }: { post: any }) {
    const platform = post.platform?.toLowerCase();
    const isPinned = post.is_pinned;

    return (
        <div
            className={cn(
                "relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group bg-slate-900 border border-white/5 shadow-2xl transition-all duration-500 w-full mb-4 md:mb-8 break-inside-avoid",
                isPinned ? "ring-4 ring-gold/20 z-10" : "opacity-95 hover:opacity-100"
            )}
        >
            {/* Labels & Tags */}
            <div className={cn(
                "absolute top-5 right-5 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-white text-[10px] md:text-xs font-black shadow-2xl backdrop-blur-2xl border border-white/10",
                platform === "youtube" ? "bg-red-600/80" :
                    platform === "facebook" ? "bg-blue-600/80" :
                        platform === "instagram" ? "bg-gradient-to-tr from-yellow-400/80 via-pink-500/80 to-purple-600/80" :
                            "bg-black/40"
            )}>
                <span className="capitalize">{platform || "Social"}</span>
                {platform === "youtube" && <Youtube className="w-3.5 h-3.5" />}
                {platform === "instagram" && <Instagram className="w-3.5 h-3.5" />}
                {platform === "tiktok" && <TiktokIcon className="w-3.5 h-3.5" />}
                {platform === "facebook" && <Facebook className="w-3.5 h-3.5" />}
            </div>

            {isPinned && (
                <div className="absolute top-5 left-5 z-20 bg-gold text-emerald-950 px-4 py-1.5 rounded-2xl text-[10px] md:text-xs font-black flex items-center gap-1.5 shadow-xl">
                    <Pin className="w-3.5 h-3.5 fill-emerald-950" />
                    <span className="tracking-tighter uppercase font-black text-[9px]">Highlight</span>
                </div>
            )}

            <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full relative"
            >
                {/* Natural Proportion Container */}
                <div className="relative w-full overflow-hidden bg-slate-800">
                    {(() => {
                        const finalUrl = post.thumbnail
                            ? getAssetUrl(post, post.thumbnail)
                            : (post.thumbnail_url ? getAssetUrl(post, post.thumbnail_url) : "");

                        // Note: Using standard <img> here to ensure natural proportions 
                        // work seamlessly with CSS columns without requiring explicit Next.js aspect ratios
                        if (finalUrl) {
                            return (
                                <img
                                    src={finalUrl}
                                    alt={post.caption || "Social Post"}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 block"
                                />
                            );
                        } else if (platform === "youtube" && post.url) {
                            const videoId = post.url.split('v=')[1]?.substring(0, 11);
                            return (
                                <img
                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                    alt="YouTube"
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 block"
                                />
                            );
                        } else {
                            return (
                                <div className="w-full aspect-video flex items-center justify-center">
                                    <span className="text-slate-600 font-bold capitalize">{platform || "Link"}</span>
                                </div>
                            );
                        }
                    })()}

                    {/* Overlay with Content */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent p-6 md:p-8 flex flex-col justify-end transition-all duration-700",
                        "opacity-100 group-hover:opacity-100"
                    )}>
                        <h3 className={cn(
                            "font-bold text-white mb-2 leading-tight tracking-tight drop-shadow-lg",
                            isPinned ? "text-lg md:text-xl line-clamp-3" : "text-xs md:text-sm line-clamp-3"
                        )}>
                            {post.caption || "Update Terbaru"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gold text-[10px] md:text-xs font-black tracking-widest uppercase items-center group-hover:translate-x-1 transition-transform">
                            Buka Post <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}

function SocialSkeleton() {
    return (
        <div className="columns-2 md:columns-4 gap-6">
            <div className="bg-slate-200/50 rounded-[2.5rem] aspect-square animate-pulse mb-4"></div>
            <div className="bg-slate-200/50 rounded-[2.5rem] aspect-video animate-pulse mb-4"></div>
            <div className="bg-slate-200/50 rounded-[2.5rem] aspect-[9/16] animate-pulse mb-4"></div>
            <div className="bg-slate-200/50 rounded-[2.5rem] aspect-[4/5] animate-pulse mb-4"></div>
        </div>
    );
}
