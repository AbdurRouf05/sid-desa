import React from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { CheckCircle, Clock, ChevronRight, FileText, FileSearch, HelpCircle, Smartphone, Building, CreditCard, Banknote, ArrowRight, MapPin } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />
            <JsonLd
                type="CollectionPage"
                data={{
                    name: "Layanan Desa Sumberanyar",
                    description: "Daftar lengkap layanan surat menyurat dan administrasi Desa Sumberanyar.",
                    hasPart: [
                        {
                            "@type": "Service",
                            name: "Layanan Surat Pengantar",
                            description: "Pengajuan surat pengantar KTP, KK, dan lainnya."
                        },
                        {
                            "@type": "GovernmentService",
                            name: "Surat Keterangan Tidak Mampu",
                            description: "Penerbitan SKTM untuk keperluan pendidikan dan kesehatan."
                        },
                        {
                            "@type": "GovernmentService",
                            name: "Pengaduan Warga",
                            description: "Layanan pengaduan dan aspirasi masyarakat."
                        }
                    ]
                }}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-display">
                        Layanan Kelurahan & Administrasi
                    </h1>
                    <p className="text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
                        Nikmati kemudahan layanan administrasi kependudukan dan persuratan di Balai Desa Sumberanyar.
                    </p>
                </div>
            </section>

            {/* Digital Services */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Persuratan Desa</span>
                        <h2 className="text-3xl font-bold text-slate-900">Kemudahan Dalam Genggaman</h2>
                        <p className="text-slate-600 mt-4">
                            Layanan transaksi digital untuk memenuhi kebutuhan harian Anda, kapan saja dan di mana saja.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ArabesqueCard title="Surat Pengantar RT/RW" icon={<FileText className="w-8 h-8 text-emerald-600" />}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Pengajuan surat pengantar ketua RT/RW setempat sebagai syarat utama pelayanan di Balai Desa.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Pengantar KTP / KK</li>
                                <li className="flex items-center gap-2">✅ Pengantar SKCK</li>
                                <li className="flex items-center gap-2">✅ Surat Domisili</li>
                            </ul>
                            <Link href="/layanan/persuratan">
                                <TactileButton variant="ghost" className="w-full justify-between group">
                                    Lihat Detail Persyaratan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </TactileButton>
                            </Link>
                        </ArabesqueCard>

                        <ArabesqueCard title="Surat Keterangan Usaha" icon={<Building className="w-8 h-8 text-blue-600" />}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Penerbitan SKU bagi warga yang memiliki usaha mikro/kecil untuk keperluan perbankan atau izin.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Cepat & Mudah</li>
                                <li className="flex items-center gap-2">✅ Gratis (Tanpa Pungutan)</li>
                                <li className="flex items-center gap-2">✅ Bisa ditunggu</li>
                            </ul>
                            <Link href="/layanan/persuratan#usaha">
                                <TactileButton variant="ghost" className="w-full justify-between group">
                                    Lihat Detail Persyaratan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </TactileButton>
                            </Link>
                        </ArabesqueCard>

                        <ArabesqueCard title="Surat Keterangan Tidak Mampu" icon={<FileText className="w-8 h-8 text-yellow-600" />}>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Penerbitan SKTM untuk keperluan pendidikan (KIP), pendaftaran BPJS Kesehatan, atau keringanan biaya.
                            </p>
                            <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                <li className="flex items-center gap-2">✅ Syarat KTP/KK</li>
                                <li className="flex items-center gap-2">✅ Foto Rumah</li>
                                <li className="flex items-center gap-2">✅ Verifikasi Cepat</li>
                            </ul>
                            <Link href="/layanan/persuratan#sktm">
                                <TactileButton variant="ghost" className="w-full justify-between group">
                                    Lihat Detail Persyaratan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </TactileButton>
                            </Link>
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
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pelayanan Tatap Muka di Balai Desa</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Kunjungi Balai Desa Sumberanyar untuk layanan administrasi kependudukan yang membutuhkan verifikasi langsung. Petugas kami siap membantu melayani keperluan Anda pada jam kerja.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700 flex-shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Perekaman E-KTP</h3>
                                        <p className="text-slate-600 text-sm">Layanan perekaman biometrik E-KTP baru bagi warga yang telah menginjak usia 17 tahun.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700 flex-shrink-0">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Konsultasi Pelayanan</h3>
                                        <p className="text-slate-600 text-sm">Konsultasi persyaratan pembuatan KK baru, akta kelahiran, dan perpindahan domisili.</p>
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
                                    src="https://images.pexels.com/photos/34528447/pexels-photo-34528447.jpeg"
                                    alt="Layanan Desa Sumberanyar"
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
                        Tim Customer Service kami siap menjawab pertanyaan Anda mengenai persyaratan administrasi atau pelaporan.
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
