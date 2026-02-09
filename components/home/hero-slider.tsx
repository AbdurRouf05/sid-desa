"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { getAssetUrl } from "@/lib/cdn";

export interface HeroSlide {
    id: string | number;
    title: string;
    subtitle: string;
    cta: string;
    cta_link: string;
    bgClass: string;
    image: string;
    mobile_image?: string | null;
    foreground_image?: string | null;
    collectionId?: string;
    recordId?: string;
}

interface HeroSliderProps {
    slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auto-slide logic
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    if (!slides || slides.length === 0) {
        return (
            <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden bg-emerald-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10" />
                <div className="relative z-10 text-center space-y-4 animate-pulse">
                    <div className="w-32 h-6 bg-white/20 rounded-full mx-auto" />
                    <div className="w-64 md:w-96 h-12 bg-white/20 rounded-xl mx-auto" />
                    <div className="w-48 md:w-80 h-4 bg-white/10 rounded-full mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden bg-emerald-950 text-white">
            {/* 
                Performance Note: initial={false} on AnimatePresence ensures that 
                the very first slide doesn't perform an "entry" animation on page load, 
                eliminating flashes/transitions from skeleton/fallback states.
            */}
            <AnimatePresence mode="popLayout" initial={false}>
                {slides.map((slide, index) => {
                    const isOriginal = slide.bgClass === "original";
                    const foregroundUrl = slide.foreground_image ? getAssetUrl(slide, slide.foreground_image) : null;

                    return (
                        index === currentSlide && (
                            <motion.div
                                key={slide.id}
                                className={`absolute inset-0 ${isOriginal ? 'bg-slate-900' : slide.bgClass} flex items-center justify-center overflow-hidden`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                {/* LAYER 1A: Desktop Background */}
                                <motion.div
                                    className={`absolute inset-0 ${isOriginal ? 'opacity-100' : 'opacity-40'} ${slide.mobile_image ? 'hidden md:block' : ''}`}
                                    initial={{ scale: 1.05 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 10, ease: "easeOut" }}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        loading="eager"
                                        sizes="100vw"
                                    />
                                </motion.div>

                                {/* LAYER 1B: Mobile Background */}
                                {slide.mobile_image && (
                                    <motion.div
                                        className={`absolute inset-0 ${isOriginal ? 'opacity-100' : 'opacity-40'} md:hidden`}
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 10, ease: "easeOut" }}
                                    >
                                        <Image
                                            src={slide.mobile_image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                            loading="eager"
                                            sizes="100vw"
                                        />
                                    </motion.div>
                                )}

                                {/* LAYER 2: Gradient Overlay */}
                                {!isOriginal && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />
                                )}

                                {/* LAYER 3: Arabesque Grid */}
                                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-20 pointer-events-none" />

                                {/* LAYER 4: Foreground Image (Character/Floating Object) */}
                                {foregroundUrl && (
                                    <motion.div
                                        className="absolute inset-0 z-10 pointer-events-none flex items-end justify-end md:justify-end md:pr-12 lg:pr-32 pb-0"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: isMounted ? 0.4 : 0, // No delay on very first load to prevent flicker
                                            duration: 0.6,
                                            ease: "easeOut"
                                        }}
                                    >
                                        <img
                                            src={foregroundUrl}
                                            alt=""
                                            className="h-[65%] md:h-[90%] object-contain object-bottom drop-shadow-2xl mr-0 mb-0 pointer-events-none"
                                        />
                                    </motion.div>
                                )}

                                {/* LAYER 5: Text Content */}
                                <div className="container relative z-20 px-4 md:px-8 h-full flex flex-col justify-center">
                                    <div className={`space-y-6 ${foregroundUrl ? 'max-w-[75%] sm:max-w-[80%] md:max-w-xl lg:max-w-3xl' : 'max-w-3xl'}`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: isMounted ? 0.3 : 0, duration: 0.5 }}
                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-gold text-sm font-bold tracking-wide"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                            BMT NU LUMAJANG
                                        </motion.div>

                                        <motion.h1
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: isMounted ? 0.5 : 0, duration: 0.6 }}
                                            className={`${foregroundUrl ? 'text-3xl' : 'text-4xl'} md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-lg`}
                                        >
                                            {slide.title}
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: isMounted ? 0.7 : 0, duration: 0.6 }}
                                            className="text-lg md:text-xl text-emerald-100/90 leading-relaxed max-w-2xl drop-shadow-md"
                                        >
                                            {slide.subtitle}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: isMounted ? 0.9 : 0, duration: 0.6 }}
                                            className="pt-4"
                                        >
                                            <TactileButton
                                                variant={index === 0 ? "secondary" : "primary"}
                                                className="text-lg h-14 px-8 shadow-2xl"
                                                onClick={() => window.location.href = slide.cta_link}
                                            >
                                                {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                                            </TactileButton>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    );
                })}
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-24 md:bottom-32 left-0 w-full z-20">
                <div className="container px-4 md:px-8 flex gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-gold' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
