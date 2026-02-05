import { SectionHeading } from "@/components/ui/section-heading";

export default function AssetsPage() {
    return (
        <main>
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-700 to-primary-dark text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-display">Manajemen Aset</h1>
                    <p className="text-emerald-100 mt-2">Kelola gambar, dokumen, dan file media lainnya.</p>
                </div>
            </div>

            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Segera Hadir</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Fitur manajemen aset terpusat sedang dalam pengembangan. Saat ini Anda dapat mengelola Logo & Branding melalui menu <strong>Pengaturan Situs</strong>.
                </p>
            </div>
        </main>
    );
}
