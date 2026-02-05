"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";
import { pb } from "@/lib/pb";

export function ModernFooter() {
    const [backToTopVisible, setBackToTopVisible] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        address: "Jl. Alun-alun Timur No 3, Jogotrunan, Lumajang",
        phone: "0812-3456-7890",
        email: "info@bmtnu-lumajang.id",
        companyName: "BMT NU Lumajang",
        logoSecondary: "" as string | null
    });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setBackToTopVisible(true);
            } else {
                setBackToTopVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        // Fetch dynamic contact info
        const fetchConfig = async () => {
            try {
                const config = await pb.collection('site_config').getFirstListItem("");
                if (config) {
                    setContactInfo({
                        address: config.address || "Jl. Alun-alun Timur No 3, Jogotrunan, Lumajang",
                        phone: config.phone_wa || "0812-3456-7890",
                        email: config.email_official || "info@bmtnu.id",
                        companyName: config.company_name || "BMT NU Lumajang",
                        logoSecondary: config.logo_secondary ? pb.files.getUrl(config, config.logo_secondary) : null
                    });
                }
            } catch (e) {
                console.error("Footer config fetch error", e);
            }
        };
        fetchConfig();

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-emerald-900/30">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Contact */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white">
                            <div className="bg-emerald-600/20 p-2 rounded-lg backdrop-blur-sm border border-emerald-500/30">
                                {contactInfo.logoSecondary ? (
                                    <img src={contactInfo.logoSecondary} alt="Logo" className="w-8 h-8 object-contain" />
                                ) : (
                                    <Home className="w-6 h-6 text-emerald-400" />
                                )}
                            </div>
                            <span className="font-bold text-xl tracking-tight">{contactInfo.companyName}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Mitra keuangan syariah terpercaya. Mudah, Murah, Berkah dengan cara Syariah untuk kemandirian ekonomi umat.
                        </p>
                        <ul className="space-y-4 pt-2">
                            <li className="flex items-start gap-3 text-emerald-100/80">
                                <MapPin className="w-5 h-5 flex-shrink-0 text-gold mt-0.5" />
                                <span className="text-sm leading-relaxed">
                                    {contactInfo.address}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-100/80">
                                <Mail className="w-5 h-5 flex-shrink-0 text-gold" />
                                <span className="text-sm hover:text-white transition-colors">
                                    {contactInfo.email}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-100/80">
                                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{contactInfo.phone} (WhatsApp Center)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                            Tentang Kami
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/tentang-kami" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Sejarah & Visi Misi</Link></li>
                            <li><Link href="/structure" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Struktur Pengurus</Link></li>
                            <li><Link href="/berita" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Berita & Kegiatan</Link></li>
                            <li><Link href="/laporan" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Laporan RAT</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Products */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gold rounded-full"></span>
                            Produk Unggulan
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/produk/sirela" className="hover:text-gold transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Tabungan SIRELA</Link></li>
                            <li><Link href="/produk/haji" className="hover:text-gold transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Simpanan Haji & Umroh</Link></li>
                            <li><Link href="/produk/pendidikan" className="hover:text-gold transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Simpanan Pendidikan</Link></li>
                            <li><Link href="/produk/pembiayaan" className="hover:text-gold transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Pembiayaan Modal Usaha</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter / Social */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Sosial Media</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Ikuti perkembangan terbaru kami melalui kanal sosial media resmi.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors group">
                                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors group">
                                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors group">
                                <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Legal & Copyright */}
            <div className="bg-slate-950 py-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 text-center md:text-left">
                        © {new Date().getFullYear()} {contactInfo.companyName}. All rights reserved. <br className="hidden md:block" />
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <Link href="/kebijakan-privasi" className="hover:text-emerald-400">Kebijakan Privasi</Link>
                        <Link href="/syarat-ketentuan" className="hover:text-emerald-400">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
