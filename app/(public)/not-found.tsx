import Link from 'next/link';
import { Amiri } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ModernNavbar } from '@/components/layout/modern-navbar';
import { ModernFooter } from '@/components/layout/modern-footer';

const amiri = Amiri({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-amiri',
    display: 'swap',
});

export default function NotFound() {
    return (
        <div className={cn(
            "min-h-screen flex flex-col relative overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-300",
            amiri.variable
        )}>
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 bg-arabesque dark:bg-arabesque-dark pointer-events-none opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl dark:bg-primary/20"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl dark:bg-secondary/20"></div>
            </div>

            <ModernNavbar />

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-12 pt-24">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Section */}
                    <div className="order-2 md:order-1 text-center md:text-left space-y-6">
                        <div className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold tracking-wide border border-red-200 dark:border-red-800 mb-2 font-sans">
                            ERROR 404
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight font-heading">
                            <span className="block text-slate-900 dark:text-white mb-2">Halaman Tidak</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bmt-green-700 to-bmt-gold-500">Ditemukan</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                            Mohon maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau sedang tidak tersedia saat ini.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bmt-green-700 hover:bg-bmt-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group font-sans">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Kembali ke Beranda
                            </Link>
                            <Link href="/kontak" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-sans">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-bmt-green-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>

                    {/* Graphic Section */}
                    <div className="order-1 md:order-2 flex justify-center items-center relative h-full min-h-[300px]">
                        <div className="absolute w-80 h-80 border-2 border-dashed border-bmt-green-700/20 rounded-full animate-spin-slow dark:border-bmt-gold-400/20"></div>
                        <div className="absolute w-64 h-64 border border-bmt-green-700/10 rounded-full animate-spin-slow flex items-center justify-center" style={{ animationDirection: 'reverse' }}>
                            <div className="w-40 h-40 bg-bmt-gold-400/5 rounded-full filter blur-xl"></div>
                        </div>

                        <div className="relative z-10 animate-float">
                            <div className={cn(
                                "text-[10rem] md:text-[12rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-bmt-green-700 via-emerald-600 to-bmt-gold-400 relative select-none font-serif",
                                amiri.className
                            )}>
                                404
                                <div className="absolute inset-0 bg-arabesque opacity-20 bg-repeat mix-blend-multiply dark:mix-blend-overlay pointer-events-none"></div>
                            </div>

                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-bmt-gold-400 rounded-lg rotate-12 opacity-80 shadow-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 0 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>

                            <div className="absolute -bottom-6 -left-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-gray-500">path_not_found</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <ModernFooter />
        </div>
    );
}
