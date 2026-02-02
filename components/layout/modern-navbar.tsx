"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, User, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TactileButton } from "@/components/ui/tactile-button";

export function ModernNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "#" },
        { name: "Produk", href: "#" },
        { name: "Layanan", href: "#" },
        { name: "Tentang Kami", href: "#" },
    ];

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8",
                    isScrolled
                        ? "bg-white text-emerald-950 shadow-md py-3"
                        : "bg-transparent text-white py-5"
                )}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "p-2 rounded-lg transition-colors duration-300",
                                isScrolled ? "bg-primary text-white" : "bg-white/20 text-white backdrop-blur-sm"
                            )}
                        >
                            <Home className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg md:text-xl tracking-tight leading-none">BMT NU</h1>
                            <p className={cn(
                                "text-[10px] font-semibold tracking-wider uppercase opacity-80",
                                isScrolled ? "text-emerald-700" : "text-emerald-50"
                            )}>
                                Lumajang
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-gold relative group",
                                    isScrolled ? "text-gray-600" : "text-white/90"
                                )}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className={cn(
                            "p-2 transition-colors hover:text-gold",
                            isScrolled ? "text-gray-400" : "text-white/80"
                        )}>
                            <Search className="w-5 h-5" />
                        </button>
                        {/* Login Button Hidden as per request */}
                        {/* <TactileButton variant={isScrolled ? "primary" : "secondary"} className="h-10 px-6 text-sm">
                            Login Anggota
                        </TactileButton> */}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-current focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Overlay) */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Mobile Menu Content (Sheet) */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Home className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg">Menu Utama</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium group transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                    {/* <TactileButton fullWidth variant="primary" icon={<User className="w-4 h-4" />}>
                        Login / Register
                    </TactileButton> */}
                    <p className="text-center text-xs text-gray-400">
                        © 2024 BMT NU Lumajang <br /> Mobile Experience v1.0
                    </p>
                </div>
            </div>
        </>
    );
}
