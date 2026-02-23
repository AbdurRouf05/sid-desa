"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, User, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TactileButton } from "@/components/ui/tactile-button";
import { pb } from "@/lib/pb";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { SearchOverlay } from "./search-overlay";

export function ModernNavbar() {
    const { getLabel, isVisible } = useUiLabels();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState("SID Sumberanyar");

    // Scroll Listener & Logo Fetcher
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const fetchConfig = async () => {
            try {
                const records = await pb.collection('site_config').getList(1, 1);
                if (records.items.length > 0) {
                    const data = records.items[0];
                    if (data.logo_primary) {
                        setLogoUrl(pb.files.getURL(data, data.logo_primary));
                    }
                    if (data.logo_secondary) {
                        setLogoWhiteUrl(pb.files.getURL(data, data.logo_secondary));
                    }
                    if (data.company_name) {
                        setCompanyName(data.company_name);
                    }
                }
            } catch (e) {
                console.error("Failed to load nav config", e);
            }
        };

        window.addEventListener("scroll", handleScroll);
        fetchConfig();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: getLabel('nav_home', 'Beranda'), href: "/", visible: isVisible('nav_home') },
        { name: getLabel('nav_products', 'Produk'), href: "/produk", visible: isVisible('nav_products') },
        { name: getLabel('nav_news', 'Berita'), href: "/berita", visible: isVisible('nav_news') },
        { name: getLabel('nav_about', 'Tentang Kami'), href: "/tentang-kami", visible: isVisible('nav_about') },
        { name: getLabel('nav_contact', 'Kontak'), href: "/kontak", visible: isVisible('nav_contact') },
    ].filter(link => link.visible);

    // Logic for current logo: Scrolled = Primary (Color), Unscrolled = Secondary (White)
    const currentLogo = isScrolled ? logoUrl : (logoWhiteUrl || logoUrl);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8",
                    isScrolled
                        ? "bg-white text-slate-900 shadow-md py-3"
                        : "bg-transparent text-white py-5"
                )}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "p-1.5 rounded-lg transition-colors duration-300 overflow-hidden flex items-center justify-center",
                                isScrolled ? "bg-white" : "bg-white/20 backdrop-blur-sm"
                            )}
                        >
                            {currentLogo ? (
                                <img
                                    src={currentLogo}
                                    alt="Logo"
                                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                                />
                            ) : (
                                <Home className="w-5 h-5 md:w-6 md:h-6 text-current" />
                            )}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg md:text-xl tracking-tight leading-none">{companyName}</h1>
                            <p className={cn(
                                "text-[10px] font-semibold tracking-wider uppercase opacity-80",
                                isScrolled ? "text-desa-primary" : "text-desa-primary-light"
                            )}>
                                Desa Sumberanyar
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
                                    "text-sm font-medium transition-colors hover:text-desa-accent relative group",
                                    isScrolled ? "text-gray-600" : "text-white/90"
                                )}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-desa-accent transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={cn(
                                "p-2 transition-colors hover:text-desa-accent",
                                isScrolled ? "text-gray-400" : "text-white/80"
                            )}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-current focus:outline-none"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                        <button
                            className="p-2 text-current focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
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
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-desa-primary text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg flex items-center justify-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo Mobile" className="w-6 h-6 object-contain" />
                            ) : (
                                <Home className="w-5 h-5" />
                            )}
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
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-desa-primary" />
                        </Link>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                    <p className="text-center text-xs text-gray-400">
                        © 2026 Pemerintah Desa Sumberanyar <br /> App Experience v2.0
                    </p>
                </div>
            </div>

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
