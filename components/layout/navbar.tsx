"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react"; // Will be available after pnpm add
import { usePathname } from "next/navigation";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Beranda" },
        { href: "/layanan", label: "Layanan" },
        { href: "/berita", label: "Berita" },
        { href: "/tentang-kami", label: "Tentang Desa" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-bmt-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("font-bold text-lg leading-none", isScrolled ? "text-bmt-green-900" : "text-bmt-green-900 md:text-white")}>
                            SID
                        </span>
                        <span className={cn("text-xs font-medium", isScrolled ? "text-bmt-green-700" : "text-bmt-green-200")}>
                            Sumberanyar
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-bmt-gold-500",
                                isActive(link.href)
                                    ? "text-bmt-gold-500 font-semibold"
                                    : isScrolled
                                        ? "text-slate-600"
                                        : "text-white/90"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Button variant={isScrolled ? "default" : "gold"} size="sm">
                        Kontak Desa
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-800"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu className={isScrolled ? "text-slate-800" : "text-white"} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t p-4 flex flex-col gap-4 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-slate-800 font-medium py-2 border-b border-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button className="w-full">Kontak Desa</Button>
                </div>
            )}
        </nav>
    );
}
