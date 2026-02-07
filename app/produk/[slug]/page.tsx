import { notFound } from "next/navigation";
import { pb } from "@/lib/pb";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { TactileButton } from "@/components/ui/tactile-button";
import { ArrowLeft, CheckCircle2, Phone, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

async function getProduct(slug: string) {
    try {
        const record = await pb.collection('products').getFirstListItem(`slug="${slug}"`, {
            filter: 'published = true'
        });
        return record;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await getProduct(params.slug);
    if (!product) return { title: "Produk Tidak Ditemukan" };

    return {
        title: `${product.name} - BMT NU Lumajang`,
        description: product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Detail produk ${product.name}`,
    };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    const isSimpanan = product.product_type === "simpanan";
    const whatsappMessage = `Assalamualaikum, saya ingin bertanya tentang produk ${product.name}.`;
    const whatsappLink = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`; // TODO: Get from site_config

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <JsonLd
                type="FinancialProduct"
                data={{
                    name: product.name,
                    description: product.description ? product.description.replace(/<[^>]*>/g, '') : "Produk BMT NU Lumajang",
                    provider: {
                        "@type": "Organization",
                        name: "BMT NU Lumajang"
                    },
                    amount: {
                        "@type": "MonetaryAmount",
                        currency: "IDR",
                        value: product.min_deposit ? product.min_deposit.replace(/\D/g, '') : "0"
                    },
                    category: isSimpanan ? "SavingsAccount" : "LoanOrCredit"
                }}
            />

            <ModernNavbar />

            {/* Header */}
            <header className="bg-emerald-900 text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/produk" className="inline-flex items-center text-emerald-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Produk
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${isSimpanan ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                }`}>
                                {isSimpanan ? "SIMPANAN SYARIAH" : "PEMBIAYAAN SYARIAH"}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight">{product.name}</h1>
                        </div>
                        <div className="hidden md:block">
                            {/* Icon Placeholder or vector art could go here */}
                            <ShieldCheck className="w-24 h-24 text-emerald-800/50" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 -mt-10 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tentang Produk</h2>
                            <div
                                className="prose prose-slate max-w-none prose-lg"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        {/* Requirements */}
                        {product.requirements && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Syarat & Ketentuan</h2>
                                <div
                                    className="prose prose-slate max-w-none prose-ul:list-disc prose-li:marker:text-emerald-500"
                                    dangerouslySetInnerHTML={{ __html: product.requirements }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Key Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg border-t-4 border-gold p-6 sticky top-24">
                            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-gold-600" />
                                Ringkasan Akad
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-slate-500 text-sm">Jenis Akad</span>
                                    <span className="font-bold text-slate-800">{product.schema_type || "Syariah"}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-slate-500 text-sm">
                                        {isSimpanan ? "Setoran Awal" : "Plafond Minimal"}
                                    </span>
                                    <span className="font-bold text-emerald-700 text-lg">
                                        {product.min_deposit ? `Rp ${product.min_deposit}` : "Menyesuaikan"}
                                    </span>
                                </div>
                            </div>

                            <TactileButton
                                className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                onClick={() => window.open(whatsappLink, '_blank')}
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                {isSimpanan ? "Buka Rekening" : "Ajukan Pembiayaan"}
                            </TactileButton>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                Hubungi CS kami via WhatsApp untuk informasi lebih lanjut.
                            </p>
                        </div>

                        {/* Trust Card */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Dijamin Aman
                            </h4>
                            <ul className="space-y-2">
                                {[
                                    "Diawasi Dewan Pengawas Syariah",
                                    "Transparan & Tanpa Riba",
                                    "Dana Dikelola Profesional"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <ModernFooter />
        </div>
    );
}
