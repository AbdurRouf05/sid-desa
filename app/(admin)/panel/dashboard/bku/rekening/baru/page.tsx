import { RekeningKasForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function BaruRekeningPage() {
    return (
        <main>
            <div className="mb-8">
                <SectionHeading 
                    title="Registrasi Dompet Kas" 
                    subtitle="Tambahkan dompet/laci baru untuk mutasi buku kas umum" 
                />
            </div>
            <RekeningKasForm />
        </main>
    );
}
