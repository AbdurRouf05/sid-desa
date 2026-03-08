"use client";

import { useParams } from "next/navigation";
import { BkuTransaksiForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function EditBkuTransaksiPage() {
    const params = useParams();

    return (
        <main>
            <div className="mb-8">
                <SectionHeading
                    align="left"
                    title="Ubah Log Transaksi"
                    subtitle="Koreksi nominal atau dokumen bukti dari transaksi BKU."
                />
            </div>
            <BkuTransaksiForm id={params.id as string} />
        </main>
    );
}
