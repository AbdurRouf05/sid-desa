"use client";

import React from "react";
import { ShieldCheck, Banknote, Users } from "lucide-react";
import { useUiLabels } from "@/components/providers/ui-labels-provider";

export function FeaturesGrid() {
    const { getLabel } = useUiLabels();

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-desa-primary-dark mb-6 font-heading">{getLabel('section_why_us_title', 'Layanan Desa Digital & Mandiri')}</h2>
                <p className="text-lg text-slate-600 mb-12">
                    {getLabel('section_why_us_subtitle', 'Sistem Informasi Desa (SID) Sumberanyar hadir untuk memberikan kemudahan akses layanan administratif dan informasi publik secara transparan bagi seluruh warga.')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-desa-primary/10 rounded-full flex items-center justify-center mb-4 text-desa-primary">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_1_title', 'Layanan Mandiri')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_1_desc', 'Urus surat menyurat dan administrasi kependudukan cukup dari rumah secara digital.')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-desa-accent/10 rounded-full flex items-center justify-center mb-4 text-desa-accent-dark">
                            <Banknote className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_2_title', 'Transparansi Dana')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_2_desc', 'Pantau realisasi APBDes secara terbuka sebagai bentuk akuntabilitas publik desa kami.')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_3_title', 'Info Terpercaya')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_3_desc', 'Dapatkan informasi berita, agenda, dan pengumuman resmi terbaru langsung dari pemerintah desa.')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
