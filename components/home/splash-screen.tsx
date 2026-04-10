"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // Hold for 2 seconds, then fade out for 0.5s
        const timer = setTimeout(() => {
            setOpacity(0);
            setTimeout(() => setIsVisible(false), 500); // Wait for fade out transition
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-desa-primary transition-opacity duration-500 ease-in-out",
                opacity === 0 ? "opacity-0" : "opacity-100"
            )}
        >
            <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-700">
                {/* Real Logo */}
                <div className="w-24 h-24 mb-6 relative">
                    {/* Decorative bubles around logo */}
                    <div className="absolute top-0 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-2 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    <div className="absolute -top-4 left-4 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                   <img 
                    src="/logo3-removebg-preview.png" 
                    alt="Logo Sumberanyar" 
                    className="w-full h-full object-contain filter drop-shadow-lg"
                /></div>

                <h1 className="text-2xl md:text-4xl font-black text-white tracking-widest text-center mb-2 drop-shadow-lg">
                    DESA SUMBERANYAR
                </h1>
                
                <h2 className="text-sm md:text-lg font-medium text-green-100 text-center tracking-wider max-w-[280px] md:max-w-none">
                    Kecamatan Rowokangkung <br/>
                    Kabupaten Lumajang - Jawa Timur
                </h2>
                
                {/* Loader animation */}
                <div className="mt-12 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></div>
                </div>
            </div>
        </div>
    );
}
