"use client";

import { useParams } from "next/navigation";
import { RekeningKasForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function EditRekeningPage() {
    const params = useParams();

    return (
        <main>
            <div className="mb-8">
                <SectionHeading
                    align="left"
                    title="Ubah Dompet Kas"
                    subtitle="Perbarui data rekening buku kas umum"
                />
            </div>
            <RekeningKasForm id={params.id as string} />
        </main>
    );
}
