"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";
import { pb } from "@/lib/pb";

// Simple Tiktok Icon for brand consistency
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

export function ModernFooter() {
    const [contactInfo, setContactInfo] = useState({
        address: "Jl. Raya Sumberanyar No. 1, Sumberanyar, Lumajang",
        phone: "0812-3456-7890",
        email: "desa@sumberanyar.id",
        companyName: "Pemerintah Desa Sumberanyar",
        logoSecondary: "" as string | null,
        nib: "",
        legal_bh: "",
        socials: {
            facebook: "#",
            instagram: "#",
            youtube: "#",
            tiktok: "#"
        }
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await pb.collection('site_config').getFirstListItem("");
                if (config) {
                    setContactInfo({
                        address: config.address || "Jl. Raya Sumberanyar No. 1, Sumberanyar, Lumajang",
                        phone: config.phone_wa || "0812-3456-7890",
                        email: config.email_official || "desa@sumberanyar.id",
                        companyName: config.company_name || "Pemerintah Desa Sumberanyar",
                        logoSecondary: config.logo_secondary ? pb.files.getURL(config, config.logo_secondary) : null,
                        nib: config.nib || "",
                        legal_bh: config.legal_bh || "",
                        socials: {
                            facebook: config.social_links?.facebook || "#",
                            instagram: config.social_links?.instagram || "#",
                            youtube: config.social_links?.youtube || "#",
                            tiktok: config.social_links?.tiktok || "#"
                        }
                    });
                }
            } catch (e) {
                console.error("Footer config fetch error", e);
            }
        };
        fetchConfig();
    }, []);

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-desa-primary/30">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Contact */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white">
                            <div className="bg-desa-primary/20 p-2 rounded-lg backdrop-blur-sm border border-desa-primary-light/30">
                                {contactInfo.logoSecondary ? (
                                    <img src={contactInfo.logoSecondary} alt="Logo" className="w-8 h-8 object-contain" />
                                ) : (
                                    <Home className="w-6 h-6 text-desa-primary-light" />
                                )}
                            </div>
                            <span className="font-bold text-xl tracking-tight">{contactInfo.companyName}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-slate-500 font-mono">
                            {contactInfo.legal_bh && <p>{contactInfo.legal_bh}</p>}
                            {contactInfo.nib && <p>NIB: {contactInfo.nib}</p>}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sistem Informasi Desa Sumberanyar. Melayani warga dengan amanah, transparan, dan profesional untuk pembangunan desa yang mandiri.
                        </p>
                        <ul className="space-y-4 pt-2">
                            <li className="flex items-start gap-3 text-emerald-100/80">
                                <MapPin className="w-5 h-5 flex-shrink-0 text-desa-accent mt-0.5" />
                                <span className="text-sm leading-relaxed">
                                    {contactInfo.address}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-100/80">
                                <Mail className="w-5 h-5 flex-shrink-0 text-desa-accent" />
                                <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-white transition-colors">
                                    {contactInfo.email}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-emerald-100/80">
                                <Phone className="w-5 h-5 text-desa-primary-light shrink-0" />
                                <a
                                    href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-desa-primary-light transition-colors"
                                >
                                    {contactInfo.phone} <span className="text-xs opacity-60 ml-1">(WhatsApp)</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-desa-primary rounded-full"></span>
                            Navigasi Desa
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/tentang-kami" className="hover:text-desa-primary-light transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Tentang Kami</Link></li>
                            <li><Link href="/berita" className="hover:text-desa-primary-light transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Berita & Kegiatan</Link></li>
                            <li><Link href="/layanan" className="hover:text-desa-primary-light transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Layanan Desa</Link></li>
                            <li><Link href="/kontak" className="hover:text-desa-primary-light transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Kontak & Lokasi</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Products */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-desa-accent rounded-full"></span>
                            Layanan Publik
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/layanan" className="hover:text-desa-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Layanan Surat</Link></li>
                            <li><Link href="/transparan" className="hover:text-desa-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Transparansi APBDes</Link></li>
                            <li><Link href="/pengaduan" className="hover:text-desa-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Pengaduan Warga</Link></li>
                            <li><Link href="/berita" className="hover:text-desa-accent transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Agenda Desa</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter / Social */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Sosial Media</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Ikuti perkembangan terbaru kami melalui kanal sosial media resmi.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href={contactInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors group">
                                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href={contactInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors group">
                                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href={contactInfo.socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black transition-colors group">
                                <TiktokIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href={contactInfo.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors group">
                                <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Legal & Copyright */}
            <div className="bg-slate-950 py-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs text-slate-500">
                        <p className="text-center md:text-left">
                            © developed by sagamuda.id
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <Link href="/legal" className="text-xs hover:text-desa-accent underline decoration-dotted transition-colors">
                            Legal & Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
