"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, MonitorSmartphone, Search, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

export function ModernNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navMenus = [
        { href: "/", label: "Beranda" },
        { 
            label: "Pelayanan", 
            items: [
                { href: "#pelayanan-cepat", label: "Portal Layanan Cepat", desc: "Akses form surat dan bansos." },
                { href: "/pelayanan", label: "Semua Layanan", desc: "Lihat semua layanan administrasi." },
            ]
        },
        { 
            label: "Profil Desa", 
            items: [
                { href: "/tentang-kami", label: "Visi Misi & Sejarah", desc: "Mengenal Desa Sumberanyar." },
                { href: "#aparatur", label: "Aparatur Desa", desc: "Struktur organisasi pemerintahan." },
            ]
        },
        { href: "/berita", label: "Berita" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl transition-all shadow-sm",
                        isScrolled ? "bg-desa-primary" : "bg-white/20 backdrop-blur-md"
                    )}>
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-bold text-lg leading-none tracking-tight", 
                            isScrolled ? "text-slate-900" : "text-white drop-shadow-md"
                        )}>
                            SID
                        </span>
                        <span className={cn(
                            "text-xs font-semibold tracking-wider uppercase", 
                            isScrolled ? "text-desa-primary" : "text-green-100 drop-shadow-md"
                        )}>
                            Sumberanyar
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav - Mega Menu Style */}
                <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: isScrolled ? 'transparent' : '', borderColor: isScrolled ? 'transparent' : '', boxShadow: isScrolled ? 'none' : ''}}>
                    {navMenus.map((menu) => (
                        <div 
                            key={menu.label} 
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(menu.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            {menu.href ? (
                                <Link
                                    href={menu.href}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/20",
                                        isActive(menu.href)
                                            ? (isScrolled ? "bg-green-50 text-desa-primary" : "bg-white/20 text-white")
                                            : isScrolled
                                                ? "text-slate-600 hover:text-desa-primary hover:bg-slate-100"
                                                : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {menu.label}
                                </Link>
                            ) : (
                                <button
                                    className={cn(
                                        "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-white/20",
                                        activeDropdown === menu.label || menu.items?.some(i => isActive(i.href))
                                            ? (isScrolled ? "bg-green-50 text-desa-primary" : "bg-white/20 text-white")
                                            : isScrolled
                                                ? "text-slate-600 hover:text-desa-primary hover:bg-slate-100"
                                                : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {menu.label}
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </button>
                            )}

                            {/* Dropdown Panel */}
                            {menu.items && activeDropdown === menu.label && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 py-3 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex flex-col gap-1">
                                        {menu.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                                            >
                                                <div className="text-sm font-semibold text-slate-800 group-hover/item:text-desa-primary">
                                                    {item.label}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                    {item.desc}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button className={cn(
                        "p-2.5 rounded-full transition-colors",
                         isScrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/20"
                    )}>
                        <Search className="w-5 h-5" />
                    </button>
                    
                    <Button 
                        variant={isScrolled ? "default" : "outline"} 
                        className={cn(
                            "rounded-full gap-2 font-semibold shadow-sm",
                            !isScrolled && "border-white/40 text-white hover:bg-white/20 hover:text-white"
                        )}
                    >
                        <UserCircle2 className="w-4 h-4" />
                        E-Mandiri
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={cn("lg:hidden p-2.5 rounded-full", isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/20")}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu (Drawer approach for simplicity) */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full h-screen bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-full max-h-[80vh] overflow-y-auto bg-white border-t border-slate-100 p-4 shadow-xl flex flex-col rounded-b-3xl" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col gap-2 relative">
                            {navMenus.map((menu) => (
                                <div key={menu.label} className="flex flex-col">
                                    {menu.href ? (
                                        <Link
                                            href={menu.href}
                                            className="px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-green-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {menu.label}
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col border-b border-slate-50 pb-2 mb-2">
                                            <div className="px-4 py-2 text-sm font-bold text-slate-400 uppercase tracking-wider mt-2">
                                                {menu.label}
                                            </div>
                                            {menu.items?.map(item => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="px-4 py-2 text-slate-700 hover:text-desa-primary rounded-lg hover:bg-green-50"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Button className="w-full rounded-xl py-6 text-lg gap-2" variant="default">
                                <UserCircle2 className="w-5 h-5" />
                                Login E-Mandiri
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
