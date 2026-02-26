"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, Clock } from "lucide-react";
import { pb } from "@/lib/pb";
import { TactileButton } from "@/components/ui/tactile-button";
import { JsonLd } from "@/components/seo/json-ld";

interface InquiryForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const [config, setConfig] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cooldown, setCooldown] = useState<number | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<InquiryForm>();
    const messageContent = watch("message", "");

    const [branches, setBranches] = useState<any[]>([]);
    const [isLoadingBranches, setIsLoadingBranches] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingBranches(true);
            try {
                // Config
                const configRecords = await pb.collection('profil_desa').getList(1, 1);
                if (configRecords.items.length > 0) {
                    setConfig(configRecords.items[0]);
                }

                // Branches
                const branchRecords = await pb.collection('branches').getFullList({
                    sort: 'sort_order',
                    filter: 'is_active = true'
                });
                setBranches(branchRecords);
            } catch (e: any) {
                console.error("Error fetching data", e);
                setFetchError(e.message || "Gagal memuat data");
            } finally {
                setIsLoadingBranches(false);
            }
        };
        fetchData();

        // Check for cooldown on mount
        const lastSubmission = localStorage.getItem("last_inquiry_submission");
        if (lastSubmission) {
            const timePassed = Date.now() - parseInt(lastSubmission);
            const waitTime = 5 * 60 * 1000; // 5 minutes
            if (timePassed < waitTime) {
                setCooldown(Math.ceil((waitTime - timePassed) / 1000 / 60));
            }
        }
    }, []);

    const onSubmit = async (data: InquiryForm) => {
        // Double check cooldown
        const lastSubmission = localStorage.getItem("last_inquiry_submission");
        if (lastSubmission) {
            const timePassed = Date.now() - parseInt(lastSubmission);
            const waitTime = 5 * 60 * 1000;
            if (timePassed < waitTime) {
                alert(`Harap tunggu ${Math.ceil((waitTime - timePassed) / 1000 / 60)} menit lagi sebelum mengirim pesan baru.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await pb.collection('inquiries').create({
                ...data,
                status: 'new',
                sent_at: new Date().toISOString(),
                ip_address: 'LOGGED' // Real IP is captured by PB in logs anyway
            });

            localStorage.setItem("last_inquiry_submission", Date.now().toString());
            setIsSuccess(true);
            reset();
            // Start 5 min cooldown visual
            setCooldown(5);
            setTimeout(() => setIsSuccess(false), 10000);
        } catch (e: any) {
            console.error("Error submitting inquiry", e);
            alert("Gagal mengirim pesan: " + (e.message || "Pastikan semua data sesuai format."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const mapUrl = config?.social_links?.map_embed_url || config?.map_embed_url || "";
    const address = config?.address || "Jl. Alun-alun Timur No 3, Jogotrunan, Lumajang";
    const phone = config?.phone_wa || "081234567890";
    const email = config?.email_official || "info@bmtnu.id";

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />
            <JsonLd
                type="ContactPage"
                data={{
                    name: "Hubungi Kami - SID Sumberanyar",
                    description: "Hubungi layanan pelanggan SID Sumberanyar via WhatsApp, Email, atau kunjungi kantor cabang kami.",
                    mainEntity: {
                        "@type": "Organization",
                        name: "SID Sumberanyar",
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: address,
                            addressLocality: "Lumajang",
                            addressRegion: "Jawa Timur",
                            postalCode: "67316",
                            addressCountry: "ID"
                        },
                        contactPoint: {
                            "@type": "ContactPoint",
                            telephone: phone,
                            contactType: "customer service",
                            areaServed: "ID",
                            availableLanguage: "Indonesian"
                        }
                    }
                }}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-desa-primary to-desa-primary-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight font-display">
                        Hubungi Kami
                    </h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-light">
                        Kami siap membantu kebutuhan informasi dan layanan keuangan Anda.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Contact Info & Map */}
                    <div className="space-y-8">
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Alamat Kantor</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{address}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-slate-900 mb-1">WhatsApp Center</h3>
                                    <a
                                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-emerald-600 font-bold hover:underline"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 sm:col-span-2">
                                <div className="bg-yellow-100 p-3 rounded-full text-yellow-700">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Email Resmi</h3>
                                    <p className="text-sm text-slate-500">{email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="bg-slate-200 rounded-2xl overflow-hidden h-80 shadow-inner relative">
                            {mapUrl ? (
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                                    Peta belum dikonfigurasi
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Inquiry Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-fit sticky top-24">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h2>
                        <p className="text-slate-500 mb-6 text-sm">Tim kami akan segera menghubungi Anda kembali.</p>

                        {isSuccess ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 animate-in fade-in zoom-in">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-emerald-800">Pesan Terkirim!</h3>
                                <p className="text-sm text-emerald-700">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
                                <button onClick={() => setIsSuccess(false)} className="text-xs text-emerald-600 underline hover:text-emerald-800">Kirim pesan lagi</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate data-testid="contact-form">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                                        <input
                                            {...register("name", { required: true })}
                                            maxLength={100}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Nama Anda"
                                        />
                                        {errors.name && <span className="text-xs text-red-500">Wajib diisi</span>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">No. WhatsApp</label>
                                        <input
                                            {...register("phone", { required: true })}
                                            maxLength={20}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="08..."
                                        />
                                        {errors.phone && <span className="text-xs text-red-500">Wajib diisi</span>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Email (Opsional)</label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="nama@email.com"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Subjek</label>
                                    <input
                                        {...register("subject", { required: true })}
                                        maxLength={200}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Tanya Produk / Layanan..."
                                    />
                                    {errors.subject && <span className="text-xs text-red-500">Wajib diisi</span>}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-700">Pesan Anda</label>
                                        <span className={`text-[10px] ${messageContent.length > 2500 ? 'text-red-500' : 'text-slate-400'}`}>
                                            {messageContent.length} / 3000
                                        </span>
                                    </div>
                                    <textarea
                                        {...register("message", { required: true })}
                                        rows={4}
                                        maxLength={3000}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                                        placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                                    />
                                    {errors.message && <span className="text-xs text-red-500">Wajib diisi</span>}
                                </div>

                                {cooldown && (
                                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Anda baru saja mengirim pesan. Harap tunggu {cooldown} menit untuk mengirim lagi.
                                    </p>
                                )}

                                <TactileButton
                                    type="submit"
                                    fullWidth
                                    disabled={isSubmitting || cooldown !== null}
                                    icon={!isSubmitting && <Send className="w-4 h-4 ml-1" />}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Kirim Pesan Sekarang"}
                                </TactileButton>
                            </form>
                        )}
                    </div>
                </div>

                {/* Branch Locator Section */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Jaringan Kantor Layanan</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Temukan kantor serta pos pelayanan desa kami untuk mendapatkan informasi langsung secara tatap muka.
                            Kami hadir lebih dekat untuk melayani kebutuhan finansial Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingBranches ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-slate-400 bg-slate-50 rounded-xl animate-pulse">
                                Memuat data cabang...
                            </div>
                        ) : fetchError ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-red-400 bg-red-50 rounded-xl border border-red-100">
                                Gagal memuat data: {fetchError}. <br />
                                <span className="text-xs text-red-300">Pastikan API Rules untuk collection 'branches' sudah diatur Public.</span>
                            </div>
                        ) : branches.length > 0 ? (
                            branches.map((branch) => (
                                <div key={branch.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${branch.type === 'Pusat' ? 'bg-emerald-100 text-emerald-800' :
                                                branch.type === 'Kas' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {branch.type || "Cabang"}
                                            </span>
                                            <h3 className="font-bold text-lg text-slate-900">{branch.name}</h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-4 h-10 line-clamp-2" title={branch.address}>
                                        {branch.address}
                                    </p>

                                    {branch.phone_wa && (
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                            <Phone className="w-3 h-3" />
                                            <span>{branch.phone_wa}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href={`https://maps.google.com/maps?q=${encodeURIComponent(branch.name + " " + branch.address + " Lumajang")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors text-center flex items-center justify-center gap-2"
                                        >
                                            <MapPin className="w-3 h-3" /> Navigasi
                                        </a>
                                        {branch.phone_wa && (
                                            <a
                                                href={`https://wa.me/${branch.phone_wa.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors text-center flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-3 h-3" /> WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                                Belum ada data kantor cabang.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModernFooter />
        </main>
    );
}
