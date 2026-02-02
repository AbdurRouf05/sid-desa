"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MetaConfig } from "@/types";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

// Mock data for initial dev (will fetch from PB later)
const mockMeta: MetaConfig = {
    id: "main",
    site_name: "BMT NU Lumajang",
    address: "Jl. Kyai Ghozali No. 10, Lumajang, Jawa Timur",
    phone: "+62 812-3456-7890",
    whatsapp_number: "6281234567890",
    nib_number: "1234567890123",
    social_links: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
    },
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 text-sm">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            <div className="w-8 h-8 bg-bmt-green-700 rounded flex items-center justify-center">NU</div>
                            BMT NU Lumajang
                        </div>
                        <p className="leading-relaxed">
                            Lembaga Keuangan Syariah terpercaya, amanah, dan profesional untuk kemaslahatan umat.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href={mockMeta.social_links.instagram || "#"} className="hover:text-white transition-colors"><Instagram size={20} /></Link>
                            <Link href={mockMeta.social_links.facebook || "#"} className="hover:text-white transition-colors"><Facebook size={20} /></Link>
                            <Link href={mockMeta.social_links.youtube || "#"} className="hover:text-white transition-colors"><Youtube size={20} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            <li><Link href="/produk" className="hover:text-bmt-gold-400 transition-colors">Produk & Layanan</Link></li>
                            <li><Link href="/berita" className="hover:text-bmt-gold-400 transition-colors">Berita Terkini</Link></li>
                            <li><Link href="/tentang" className="hover:text-bmt-gold-400 transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/karir" className="hover:text-bmt-gold-400 transition-colors">Karir</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Legalitas</h3>
                        <ul className="space-y-2">
                            <li>NIB: {mockMeta.nib_number}</li>
                            <li>Diawasi oleh: Diskop UKM & OJK (On Process)</li>
                        </ul>
                        <div className="pt-2">
                            <img src="/placeholder-ojk.png" alt="OJK Logo" className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all" />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Hubungi Kami</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <MapPin className="shrink-0 text-bmt-green-500" size={18} />
                                <span>{mockMeta.address}</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="shrink-0 text-bmt-green-500" size={18} />
                                <span>{mockMeta.phone}</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="shrink-0 text-bmt-green-500" size={18} />
                                <span>info@bmtnu-lumajang.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {currentYear} BMT NU Lumajang. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
