import { notFound } from "next/navigation";
import { pb } from "@/lib/pb";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { TactileButton } from "@/components/ui/tactile-button";
import {
    ArrowLeft, CheckCircle2, Phone, ShieldCheck, Wallet,
    PiggyBank, CreditCard, Banknote, Landmark, Coins, DollarSign,
    TrendingUp, Briefcase, Building, Home, Car, GraduationCap,
    Plane, Umbrella, Vote, Users, ShoppingBag, Smartphone, Download
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { formatRupiah } from "@/lib/number-utils";

export const revalidate = 60; // Revalidate every minute

async function getProduct(slug: string) {
    try {
        // Try finding by slug first
        const record = await pb.collection('products').getFirstListItem(`slug="${slug}" && published = true`);
        return record;
    } catch (e) {
        // Fallback: Try finding by ID directly
        try {
            const record = await pb.collection('products').getOne(slug);
            return record.published ? record : null;
        } catch (idErr) {
            return null;
        }
    }
}

import { ProductContactButton } from "@/components/products/product-contact-button";

import { getAssetUrl } from "@/lib/cdn";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const decodedSlug = decodeURIComponent(params.slug);
    const product = await getProduct(decodedSlug);
    if (!product) return { title: "Produk Tidak Ditemukan" };

    const title = `${product.name} - BMT NU Lumajang`;
    const description = product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Detail produk ${product.name}`;

    // Determine image URL
    // Start with a default or construct one
    let imageUrl = "https://bmtnu-lumajang.id/og-default.jpg"; // Fallback

    if (product.icon) {
        // If it is a filename (not just an icon name like 'ShieldCheck')
        if (!product.icon.match(/^[A-Z][a-zA-Z]+$/)) {
            imageUrl = getAssetUrl(product, product.icon);
        }
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            images: [{
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: product.name
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        }
    };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const decodedSlug = decodeURIComponent(params.slug);
    const [product, siteConfig] = await Promise.all([
        getProduct(decodedSlug),
        pb.collection('site_config').getFirstListItem("").catch(() => null)
    ]);

    if (!product) {
        notFound();
    }

    // Helper to map technical schema to friendly terms
    const getSchemaLabel = (type: string) => {
        if (product.sharia_contract) return product.sharia_contract;
        if (!type) return "Produk Syariah";
        const normalized = type.trim();
        const mapping: Record<string, string> = {
            "SavingsAccount": "Simpanan Syariah",
            "LoanOrCredit": "Pembiayaan Syariah",
            "DepositAccount": "Simpanan Berjangka",
            "FinancialProduct": "Produk Syariah"
        };
        return mapping[normalized] || normalized;
    };

    // Use formatRupiah for consistent currency presentation
    const displayPrice = product.min_deposit ? formatRupiah(product.min_deposit) : null;

    const isSimpanan = product.product_type === "simpanan";
    const whatsappMessage = `Assalamualaikum, saya ingin bertanya tentang produk ${product.name}.`;

    // Get phone from config or fallback
    const rawPhone = siteConfig?.contact_wa || siteConfig?.phone_wa || "6281234567890";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

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
                            {product.icon ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${product.collectionId}/${product.id}/${product.icon}`}
                                    alt={product.name}
                                    className="w-24 h-24 object-contain brightness-0 invert opacity-50"
                                />
                            ) : (() => {
                                const IconMap: any = {
                                    PiggyBank, CreditCard, Wallet, Banknote, Landmark, Coins, DollarSign,
                                    TrendingUp, ShieldCheck, Briefcase, Building, Home, Car, GraduationCap,
                                    Plane, Umbrella, Vote, Users, ShoppingBag, Smartphone
                                };
                                const IconComponent = product.icon_name && IconMap[product.icon_name]
                                    ? IconMap[product.icon_name]
                                    : ShieldCheck;

                                return <IconComponent className="w-24 h-24 text-emerald-800/50" />;
                            })()}
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
                                    <span className="font-bold text-slate-800">{getSchemaLabel(product.schema_type)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-slate-500 text-sm">
                                        {isSimpanan ? "Setoran Awal" : "Plafond Minimal"}
                                    </span>
                                    <span className="font-bold text-emerald-700 text-xl tracking-tight">
                                        {displayPrice || "Menyesuaikan"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <ProductContactButton
                                    whatsappLink={whatsappLink}
                                    label={isSimpanan ? "Buka Rekening" : "Ajukan Pembiayaan"}
                                />

                                {product.brochure_pdf && (
                                    <TactileButton
                                        as="a"
                                        href={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${product.collectionId}/${product.id}/${product.brochure_pdf}`}
                                        target="_blank"
                                        variant="tertiary"
                                        fullWidth
                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download Brosur (PDF)
                                    </TactileButton>
                                )}
                            </div>

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
