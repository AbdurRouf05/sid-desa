"use client";

import React from "react";
import { ShieldCheck, Banknote, Users } from "lucide-react";
import { useUiLabels } from "@/components/providers/ui-labels-provider";

export function FeaturesGrid() {
    const { getLabel } = useUiLabels();

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">{getLabel('section_why_us_title', 'Kenapa Memilih BMT NU?')}</h2>
                <p className="text-lg text-slate-600 mb-12">
                    {getLabel('section_why_us_subtitle', 'Kami menggabungkan nilai-nilai luhur keislaman dengan profesionalisme manajemen modern untuk memberikan layanan finansial yang menenteramkan.')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-emerald-700">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_1_title', 'Bebas Riba')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_1_desc', 'Semua produk menggunakan akad yang jelas sesuai syariah (Mudharabah, Musyarokah, dll).')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
                            <Banknote className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_2_title', 'Tanpa Potongan')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_2_desc', 'Tabungan Anda utuh tanpa potongan administrasi bulanan sedikitpun.')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{getLabel('feature_3_title', 'Milik Umat')}</h3>
                        <p className="text-sm text-slate-500">{getLabel('feature_3_desc', 'Berdiri di bawah komando PCNU Lumajang untuk kemandirian ekonomi warga Nahdliyin.')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
