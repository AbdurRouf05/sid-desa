"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSiteConfig } from "@/lib/pb";

export async function Footer() {
    const currentYear = new Date().getFullYear();
    const config = await getSiteConfig();

    // Parse social links (they are stored as JSON in site_config)
    // db-audit shows: "social_links" type: "json"
    // Expected format: { instagram: "url", facebook: "url", youtube: "url", tiktok: "url" }
    const socials = config.social_links || {};

    // Format WA Number for Link (remove + or 0, ensure 62)
    // Assuming config.whatsapp_number is stored plain or with symbols
    const waRaw = config.whatsapp_number?.replace(/\D/g, '') || "6282334812239"; // Fallback to provided number
    const waLink = `https://wa.me/${waRaw}`;

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 text-sm relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bmt-green-500 via-gold to-bmt-green-500"></div>

            {/* WhatsApp Floating Button (Only visible on Mobile usually, but here requested as "Footer Button") */}
            {/* Actually user asked for "tombol whatsapp di footer bawah juga benar-benar bisa di tekan" */}

            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            <div className="w-10 h-10 bg-bmt-green-700 rounded-lg flex items-center justify-center shadow-lg shadow-bmt-green-900/50">
                                <span className="text-gold font-serif">NU</span>
                            </div>
                            <span className="font-display tracking-tight">BMT NU Lumajang</span>
                        </div>
                        <p className="leading-relaxed text-slate-400">
                            Lembaga Keuangan Syariah terpercaya, amanah, dan profesional untuk kemaslahatan umat.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {socials.instagram && (
                                <Link href={socials.instagram} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110">
                                    <Instagram size={18} />
                                </Link>
                            )}
                            {socials.facebook && (
                                <Link href={socials.facebook} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                    <Facebook size={18} />
                                </Link>
                            )}
                            {socials.youtube && (
                                <Link href={socials.youtube} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
                                    <Youtube size={18} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg font-display">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            <li><Link href="/produk" className="hover:text-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold rounded-full"></span>Produk & Layanan</Link></li>
                            <li><Link href="/berita" className="hover:text-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold rounded-full"></span>Berita Terkini</Link></li>
                            <li><Link href="/tentang-kami" className="hover:text-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold rounded-full"></span>Tentang Kami</Link></li>
                            <li><Link href="/karir" className="hover:text-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold rounded-full"></span>Karir</Link></li>
                            <li><Link href="/kontak" className="hover:text-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold rounded-full"></span>Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg font-display">Legalitas</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><strong className="text-slate-300">NIB:</strong> {config.nib_number || "-"}</li>
                            <li><strong className="text-slate-300">Badan Hukum:</strong> {config.legal_entity || "Koperasi Syariah"}</li>
                            <li>Diawasi oleh: Diskop UKM & OJK (On Process)</li>
                        </ul>
                        <div className="pt-4">
                            {/* Placeholder for OJK/Logo */}
                            <div className="flex items-center gap-2 opacity-60">
                                <div className="h-8 w-20 bg-slate-800 rounded"></div>
                                <div className="h-8 w-12 bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg font-display">Kantor Pusat</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <MapPin className="shrink-0 text-gold mt-1" size={18} />
                                <span className="text-slate-400 leading-snug">{config.address || "Lumajang, Jawa Timur"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="shrink-0 text-gold" size={18} />
                                <span className="text-slate-400">{config.phone || "-"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="shrink-0 text-gold" size={18} />
                                <span className="text-slate-400">{config.email || "info@bmtnu-lumajang.id"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Clock className="shrink-0 text-gold" size={18} />
                                <span className="text-slate-400">Senin - Jumat: 08:00 - 16:00</span>
                            </li>
                        </ul>

                        <a
                            href={waLink}
                            target="_blank"
                            className="mt-4 flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/40"
                        >
                            <Phone className="w-5 h-5" />
                            Chat WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {currentYear} BMT NU Lumajang. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <span className="opacity-50">v1.2.0 • Powered by Sagamuda</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
