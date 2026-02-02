import React from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { TactileButton } from "@/components/ui/tactile-button";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { Wallet, Briefcase, GraduationCap, Building2, Landmark, CheckCircle2 } from "lucide-react";

export default function ProductsPage() {
    return (
        <main className="min-h-screen flex flex-col bg-slate-50 font-display">
            <ModernNavbar />

            {/* Page Header */}
            <section className="pt-32 pb-16 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Produk & Layanan</h1>
                    <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                        Solusi keuangan syariah komprehensif untuk kebutuhan pribadi dan bisnis Anda.
                    </p>
                </div>
            </section>

            {/* Simpanan Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-1.5 h-8 bg-gold rounded-full"></span>
                        <h2 className="text-3xl font-bold text-emerald-950">Produk Simpanan</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Simpanan Cards */}
                        <ProductCard
                            title="Simpanan Wadi'ah"
                            desc="Titipan dana murni yang aman dan dapat diambil sewaktu-waktu. Bebas biaya administrasi bulanan."
                            icon={<Wallet className="text-emerald-600" />}
                            features={["Bebas Biaya Admin", "Aman & Dijamin", "Tarik Tunai Mudah"]}
                        />
                        <ProductCard
                            title="Simpanan Haji"
                            desc="Tabungan khusus untuk merencanakan ibadah haji dan umroh dengan tenang dan terkonsep."
                            icon={<Landmark className="text-emerald-600" />}
                            features={["Bagi Hasil Kompetitif", "Setoran Ringan", "Terhubung SISKOHAT"]}
                        />
                        <ProductCard
                            title="Simpanan Pendidikan"
                            desc="Persiapkan biaya pendidikan buah hati Anda mulai dari jenjang TK hingga Perguruan Tinggi."
                            icon={<GraduationCap className="text-emerald-600" />}
                            features={["Rencana Jangka Panjang", "Bonus Beasiswa", "Autodebet"]}
                        />
                    </div>
                </div>
            </section>

            {/* Pembiayaan Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-1.5 h-8 bg-gold rounded-full"></span>
                        <h2 className="text-3xl font-bold text-emerald-950">Produk Pembiayaan</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProductCard
                            title="Modal Usaha"
                            desc="Pembiayaan untuk pengembangan usaha mikro, kecil, dan menengah dengan skema Mudharabah/Musyarakah."
                            icon={<Briefcase className="text-gold-dark" />}
                            features={["Bagi Hasil Syariah", "Tanpa Riba", "Pendampingan Usaha"]}
                        />
                        <ProductCard
                            title="Pembiayaan Multiguna"
                            desc="Solusi untuk kebutuhan pembelian barang, renovasi rumah, atau kebutuhan konsumtif lainnya."
                            icon={<Building2 className="text-gold-dark" />}
                            features={["Skema Murabahah", "Angsuran Tetap", "Proses Cepat"]}
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-emerald-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-emerald-950 mb-6">Butuh Bantuan Memilih Produk?</h2>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Konsultasikan kebutuhan finansial Anda dengan customer service kami. Kami siap membantu memberikan solusi terbaik.</p>
                    <TactileButton className="h-12 px-8">Hubungi Customer Service</TactileButton>
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}

function ProductCard({ title, desc, icon, features }: { title: string, desc: string, icon: React.ReactNode, features: string[] }) {
    return (
        <ArabesqueCard variant="interactive" className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-950">{title}</h3>
            </div>
            <p className="text-slate-600 mb-6 flex-1 text-sm md:text-base">{desc}</p>

            <div className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-medium text-emerald-800/80">
                        <CheckCircle2 size={16} className="text-gold" />
                        {feature}
                    </div>
                ))}
            </div>

            <TactileButton variant="tertiary" fullWidth className="mt-auto">Lihat Detail</TactileButton>
        </ArabesqueCard>
    );
}
