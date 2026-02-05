import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    title: string;
    slug: string;
    thumbnail?: string;
    date: string;
    category?: string;
    author?: string;
    excerpt?: string;
    className?: string;
}

export function NewsCard({
    title,
    slug,
    thumbnail,
    date,
    category = "Berita",
    author = "Admin",
    excerpt,
    className
}: NewsCardProps) {
    return (
        <Link href={`/berita/${slug}`} className={cn("group block h-full", className)}>
            <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-slate-200">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <span className="text-sm font-medium">No Image</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full shadow-sm">
                            {category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 md:p-6 flex flex-col">
                    {/* Meta Data */}
                    <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gold-500" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gold-500" />
                            <span>{author}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                            {excerpt}
                        </p>
                    )}

                    {/* Read More */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-emerald-700 font-semibold text-sm group-hover:text-emerald-600">
                        Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </article>
        </Link>
    );
}
