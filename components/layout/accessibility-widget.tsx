"use client";

import { useState, useEffect } from "react";
import { Settings2, Type, Contrast, ZoomIn, EyeOff, X, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    
    // State for accessibility features
    const [fontSize, setFontSize] = useState(100); // Percentage
    const [highContrast, setHighContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);

    // Apply font size
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    // Apply contrast and grayscale
    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add("high-contrast-mode");
        } else {
            document.documentElement.classList.remove("high-contrast-mode");
        }

        if (grayscale) {
            document.documentElement.classList.add("grayscale-mode");
            document.documentElement.style.filter = "grayscale(100%)";
        } else {
            document.documentElement.classList.remove("grayscale-mode");
            document.documentElement.style.filter = "";
        }
    }, [highContrast, grayscale]);

    const resetAll = () => {
        setFontSize(100);
        setHighContrast(false);
        setGrayscale(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Widget Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
                    isOpen ? "bg-slate-800 text-white" : "bg-desa-primary text-white"
                )}
                aria-label="Menu Aksesibilitas"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Settings2 className="w-7 h-7" />}
            </button>

            {/* Accessibility Menu Panel */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 origin-bottom-right">
                    <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-blue-400" />
                            <h3 className="font-semibold">Aksesibilitas</h3>
                        </div>
                        <button onClick={resetAll} className="text-xs flex items-center gap-1 hover:text-blue-300 transition-colors" title="Reset Semua">
                            <RefreshCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    <div className="p-2 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                        {/* Text Size Control */}
                        <div className="p-3 border-b border-slate-50 last:border-0 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-2 text-slate-700">
                                    <Type className="w-4 h-4 text-slate-400" /> Ukuran Teks
                                </span>
                                <span className="text-xs font-bold text-desa-primary">{fontSize}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                                    className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-700 font-bold"
                                >A-</button>
                                <input 
                                    type="range" 
                                    min="80" 
                                    max="150" 
                                    step="10" 
                                    value={fontSize} 
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="flex-1 accent-desa-primary"
                                />
                                <button 
                                    onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                                    className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-700 font-bold"
                                >A+</button>
                            </div>
                        </div>

                        {/* Contrast Control */}
                        <button 
                            onClick={() => setHighContrast(!highContrast)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                        >
                            <span className="text-sm font-medium flex items-center gap-2 text-slate-700">
                                <Contrast className="w-4 h-4 text-slate-400" /> Kontras Tinggi
                            </span>
                            <div className={cn("w-10 h-5 rounded-full relative transition-colors duration-200", highContrast ? "bg-desa-primary" : "bg-slate-200")}>
                                <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200", highContrast ? "left-[22px]" : "left-0.5")}></div>
                            </div>
                        </button>

                        {/* Grayscale Control */}
                        <button 
                            onClick={() => setGrayscale(!grayscale)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                        >
                            <span className="text-sm font-medium flex items-center gap-2 text-slate-700">
                                <EyeOff className="w-4 h-4 text-slate-400" /> Mode Abu-abu
                            </span>
                            <div className={cn("w-10 h-5 rounded-full relative transition-colors duration-200", grayscale ? "bg-desa-primary" : "bg-slate-200")}>
                                <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200", grayscale ? "left-[22px]" : "left-0.5")}></div>
                            </div>
                        </button>
                        
                        {/* Zoom Control (Fake for visual, real zoom is usually browser native) */}
                        <div className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                             <span className="text-sm font-medium flex items-center gap-2 text-slate-700 mb-1">
                                <ZoomIn className="w-4 h-4 text-slate-400" /> Kaca Pembesar (Zoom)
                            </span>
                             <p className="text-xs text-slate-500">Gunakan pintasan keyboard (Ctrl/Cmd) + (+/-) untuk memperbesar layar secara penuh.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
