import { BkuTransaksiForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function BaruBkuTransaksiPage() {
    return (
        <main>
            <div className="mb-8">
                <SectionHeading
                    align="left"
                    title="Jurnal Pencatatan Kas"
                    subtitle="Registrasi catatan realisasi anggaran pengeluaran atau pendapatan."
                />
            </div>
            <BkuTransaksiForm />
        </main>
    );
}
