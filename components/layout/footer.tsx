"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSiteConfig } from "@/lib/pb";

export async function Footer() {
    const currentYear = new Date().getFullYear();
    const config = await getSiteConfig();

    // Parse social links (they are stored as JSON in profil_desa)
    // db-audit shows: "social_links" type: "json"
    // Expected format: { instagram: "url", facebook: "url", youtube: "url", tiktok: "url" }
    const socials = config.social_links || {};

    // Format WA Number for Link (remove + or 0, ensure 62)
    // Assuming config.whatsapp_number is stored plain or with symbols
    const waRaw = config.kontak_telp?.replace(/\D/g, '') || "6282334812239"; 
    const waLink = `https://wa.me/${waRaw}`;

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 text-sm relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-desa-primary via-desa-accent to-desa-primary"></div>

            {/* WhatsApp Floating Button (Only visible on Mobile usually, but here requested as "Footer Button") */}
            {/* Actually user asked for "tombol whatsapp di footer bawah juga benar-benar bisa di tekan" */}

            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xl font-heading">
                            <div className="w-10 h-10 bg-desa-primary rounded-lg flex items-center justify-center shadow-lg shadow-desa-primary-dark/20">
                                <span className="text-desa-accent font-serif">S</span>
                            </div>
                            <span className="font-display tracking-tight">SID Sumberanyar</span>
                        </div>
                        <p className="leading-relaxed text-slate-400">
                            Sistem Informasi Desa Sumberanyar memberikan keterbukaan informasi dan pelayanan terbaik bagi warga.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {!!socials?.instagram && (
                                <Link href={socials.instagram} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110">
                                    <Instagram size={18} />
                                </Link>
                            )}
                            {!!socials?.facebook && (
                                <Link href={socials.facebook} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                    <Facebook size={18} />
                                </Link>
                            )}
                            {!!socials?.youtube && (
                                <Link href={socials.youtube} target="_blank" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
                                    <Youtube size={18} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg font-heading">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            <li><Link href="/layanan" className="hover:text-desa-accent transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-desa-accent rounded-full"></span>Layanan & Program</Link></li>
                            <li><Link href="/berita" className="hover:text-desa-accent transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-desa-accent rounded-full"></span>Kabar Desa</Link></li>
                            <li><Link href="/tentang-kami" className="hover:text-desa-accent transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-desa-accent rounded-full"></span>Profil Desa</Link></li>
                            <li><Link href="/kontak" className="hover:text-desa-accent transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-desa-accent rounded-full"></span>Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg font-heading">Pemerintahan</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><strong className="text-slate-300">Kepala Desa:</strong> {config.kepala_desa || "-"}</li>
                            <li><strong className="text-slate-300">Kecamatan:</strong> Rowokangkung</li>
                            <li><strong className="text-slate-300">Kabupaten:</strong> Lumajang</li>
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
                        <h3 className="text-white font-bold text-lg font-heading">Kantor Desa</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <MapPin className="shrink-0 text-desa-accent mt-1" size={18} />
                                <span className="text-slate-400 leading-snug">{config.alamat_lengkap || "Rowokangkung, Lumajang, Jawa Timur"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="shrink-0 text-desa-accent" size={18} />
                                <span className="text-slate-400">{config.kontak_telp || "-"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="shrink-0 text-desa-accent" size={18} />
                                <span className="text-slate-400">{config.kontak_email || "desa-sumberanyar@lumajangkab.go.id"}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Clock className="shrink-0 text-desa-accent" size={18} />
                                <span className="text-slate-400">Senin - Jumat: 08:00 - 15:00</span>
                            </li>
                        </ul>

                        <a
                            href={waLink}
                            target="_blank"
                            className="mt-4 flex items-center justify-center gap-2 w-full bg-desa-primary hover:bg-desa-primary-light text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-desa-primary/20"
                        >
                            <Phone className="w-5 h-5" />
                            Hubungi via WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {currentYear} Pemerintah Desa Sumberanyar. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <span className="opacity-50">v2.0 • Powered by SID Digital</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
