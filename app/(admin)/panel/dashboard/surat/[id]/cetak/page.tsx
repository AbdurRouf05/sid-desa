"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { SuratKeluar } from "@/types";
import { CetakWrapper } from "@/components/surat/cetak-wrapper";
import { KopSurat } from "@/components/surat/kop-surat";
import { FooterSurat } from "@/components/surat/footer-surat";
import { TemplatePengantar } from "@/components/surat/template/template-pengantar";
import { TemplateSKTM } from "@/components/surat/template/template-sktm";
import { TemplateDomisili } from "@/components/surat/template/template-domisili";
import { TemplateSKU } from "@/components/surat/template/template-sku";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";

export default function CetakSuratPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<SuratKeluar | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            if (params.id) {
                try {
                    const record = await pb.collection("surat_keluar").getOne<SuratKeluar>(params.id as string);
                    setData(record);
                } catch (error) {
                    console.error("Error fetching surat for print", error);
                    alert("Data surat tidak ditemukan!");
                    router.push("/panel/dashboard/surat");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRecord();
    }, [params.id, router]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center print:hidden">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Menyiapkan dokumen cetak...</p>
            </div>
        );
    }

    if (!data) return null;

    // Menentukan template berdasarkan jenis surat
    const renderTemplate = () => {
        switch (data.jenis_surat) {
            case "SKTM":
                return <TemplateSKTM data={data} />;
            case "Domisili":
                return <TemplateDomisili data={data} />;
            case "Keterangan Usaha":
                return <TemplateSKU data={data} />;
            case "Pengantar":
            case "Lainnya":
            default:
                return <TemplatePengantar data={data} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0 font-serif">
            {/* Top Toolbar - Hidden on Print */}
            <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center print:hidden px-4 md:px-0">
                <button 
                    onClick={() => router.push("/panel/dashboard/surat")}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-sans text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <TactileButton variant="primary" onClick={handlePrint} className="font-sans">
                    <Printer className="w-4 h-4 mr-2" /> Cetak Dokumen (A4)
                </TactileButton>
            </div>

            {/* Print Area Wrapper */}
            <CetakWrapper>
                <KopSurat />
                {renderTemplate()}
                <FooterSurat tanggal={data.tanggal_dibuat} />
            </CetakWrapper>
            
            {/* Instruction for user on screen only */}
            <div className="max-w-[210mm] mx-auto mt-8 text-center print:hidden text-slate-500 font-sans text-sm pb-8 px-4">
                <p>💡 Tip: Pastikan pengaturan printer diset ke kertas <strong>A4</strong>, skala <strong>Custom/100%</strong>, dan <strong>matikan Headers & Footers</strong> bawaan browser untuk hasil rapi.</p>
            </div>
        </div>
    );
}
