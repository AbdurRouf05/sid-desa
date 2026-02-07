import React from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { Smartphone, Building, CreditCard, Banknote, ArrowRight, MapPin } from "lucide-react";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-display">
                        Layanan Prima BMT NU
                    </h1>
                    <p className="text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
                        Nikmati kemudahan bertransaksi baik secara digital maupun layanan personal di jaringan kantor kami.
                    </p>
                </div>
            </section>

            {/* Digital Services */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Digital Banking</span>
                        <h2 className="text-3xl font-bold text-slate-900">Kemudahan Dalam Genggaman</h2>
                        <p className="text-slate-600 mt-4">
                            Layanan transaksi digital untuk memenuhi kebutuhan harian Anda, kapan saja dan di mana saja.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ArabesqueCard title="BMT NU Mobile" icon={<Smartphone className="w-8 h-8 text-emerald-600" />}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Aplikasi mobile banking untuk cek saldo, mutasi rekening, dan transfer antar rekening BMT NU secara real-time.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Cek Saldo & Mutasi</li>
                                <li className="flex items-center gap-2">✅ Transfer Antar Anggota</li>
                                <li className="flex items-center gap-2">✅ Notifikasi WA Realcheck</li>
                            </ul>
                        </ArabesqueCard>

                        <ArabesqueCard title="PPOB & Pembayaran" icon={<CreditCard className="w-8 h-8 text-blue-600" />}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Bayar tagihan bulanan dan isi ulang pulsa/data dengan mudah lewat layanan PPOB kami.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Pulsa & Kuota Data</li>
                                <li className="flex items-center gap-2">✅ Token Listrik PLN</li>
                                <li className="flex items-center gap-2">✅ BPJS & PDAM</li>
                            </ul>
                        </ArabesqueCard>

                        <ArabesqueCard title="QRIS Merchant" icon={<span className="text-2xl font-bold">QR</span>}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Solusi pembayaran non-tunai untuk usaha Anda. Terima pembayaran dari semua e-wallet dengan satu kode QR.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Transaksi Cepat</li>
                                <li className="flex items-center gap-2">✅ Tanpa Uang Kembalian</li>
                                <li className="flex items-center gap-2">✅ Laporan Otomatis</li>
                            </ul>
                        </ArabesqueCard>
                    </div>
                </div>
            </section>

            {/* Office Services */}
            <section className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-2 block">Layanan Kantor</span>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pelayanan Personal Sepenuh Hati</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Kunjungi jaringan kantor kami untuk layanan perbankan yang lebih personal. Petugas kami siap membantu segala kebutuhan finansial Anda.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700 flex-shrink-0">
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Setor & Tarik Tunai</h3>
                                        <p className="text-slate-600 text-sm">Layanan kasir untuk transaksi tunai yang aman dan cepat di semua kantor cabang.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700 flex-shrink-0">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Pembukaan Rekening</h3>
                                        <p className="text-slate-600 text-sm">Proses mudah menjadi anggota dan membuka rekening tabungan atau deposito.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/kontak">
                                    <TactileButton className="bg-emerald-600 text-white hover:bg-emerald-700">
                                        Cari Kantor Terdekat <MapPin className="ml-2 w-4 h-4" />
                                    </TactileButton>
                                </Link>
                            </div>
                        </div>

                        {/* Image/Illustration */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-200">
                                {/* Placeholder for Office Service Image */}
                                <img
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070"
                                    alt="Layanan Kantor BMT NU"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Butuh Bantuan Lebih Lanjut?</h2>
                    <p className="text-emerald-100 max-w-2xl mx-auto mb-10">
                        Tim Customer Service kami siap menjawab pertanyaan Anda mengenai produk dan layanan BMT NU Lumajang.
                    </p>
                    <Link href="/kontak">
                        <TactileButton variant="secondary" className="px-8 py-4 h-auto text-lg">
                            Hubungi Kami
                        </TactileButton>
                    </Link>
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}
