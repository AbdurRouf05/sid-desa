
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSiteConfig } from '@/lib/config';

export const metadata = {
    title: 'Kebijakan Privasi & Lisensi | SID Sumberanyar',
    description: 'Ketentuan hukum, hak cipta, dan kebijakan privasi penggunaan sistem informasi SID Sumberanyar.',
    robots: 'noindex, nofollow' // Legal pages often don't need to be indexed
};

export default async function LegalPage() {
    const config = await getSiteConfig();
    const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Beranda
                    </Link>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">

                    {/* Header */}
                    <div className="bg-emerald-900 px-8 py-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-arabesque-grid opacity-10"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-heading tracking-tight">
                                Kebijakan Privasi, Hak Cipta & Lisensi
                            </h1>
                            <p className="text-emerald-200 text-lg font-medium">
                                Perjanjian Penggunaan Layanan Sistem Informasi Cerdas Desa Sumberanyar
                            </p>
                            <p className="text-emerald-400 text-sm mt-4 uppercase tracking-wider">
                                Terakhir Diperbarui: {currentDate}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-12 sm:px-12 prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-emerald-900 prose-a:text-emerald-600">

                        <p className="lead text-lg text-slate-600">
                            Dokumen ini mengatur hak kepemilikan intelektual, lisensi penggunaan perangkat lunak (software), serta kebijakan privasi data antara PENGEMBANG (Sagamuda.id) dan PENGGUNA (Desa Sumberanyar).
                        </p>

                        <hr className="border-slate-200 my-8" />

                        <section>
                            <h2>BAB I: DEFINISI & KEPEMILIKAN (Intellectual Property)</h2>

                            <h3>Pasal 1: Hak Kepemilikan Kode & Sistem</h3>
                            <p>
                                Seluruh Kode Sumber (Source Code), Arsitektur Sistem, Skema Database, Algoritma, dan Desain Antarmuka (UI/UX) yang terkandung dalam perangkat lunak ini adalah <strong>HAK MILIK EKSKLUSIF (Exclusive Intellectual Property Rights)</strong> dari Pengembang (Sagamuda.id). Klien tidak memiliki hak kepemilikan atas kode inti tersebut.
                            </p>

                            <h3>Pasal 2: Hak Kepemilikan Data Klien</h3>
                            <p>
                                Klien (Desa Sumberanyar) memegang <strong>HAK MENYELURUH</strong> atas seluruh Data Transaksi, Data Warga, Konten Berita, dan Informasi yang diinput ke dalam sistem. Pengembang tidak memiliki hak klaim atas data Klien.
                            </p>

                            <h3>Pasal 3: Perlindungan Hukum</h3>
                            <p>
                                Sistem ini dilindungi oleh Undang-Undang Republik Indonesia No. 28 Tahun 2014 tentang Hak Cipta. Hak Cipta atas kode program timbul secara otomatis sejak ciptaan diwujudkan, tanpa perlu pendaftaran formal. Pelanggaran atas hak ini dapat dikenakan sanksi pidana dan perdata.
                            </p>
                        </section>

                        <section>
                            <h2>BAB II: LISENSI PENGGUNAAN (Standar Paket 2)</h2>

                            <h3>Pasal 4: Ruang Lingkup Lisensi</h3>
                            <p>
                                Pengembang memberikan <strong>"Non-Exclusive, Non-Transferable, Limited License"</strong> (Lisensi Terbatas, Tidak Eksklusif, Tidak Dapat Dipindahtangankan) kepada Klien untuk menggunakan perangkat lunak ini semata-mata untuk keperluan operasional internal Desa Sumberanyar.
                            </p>

                            <h3>Pasal 5: Larangan Penjualan Kembali</h3>
                            <p>
                                Klien <strong>DILARANG KERAS</strong> untuk menjual kembali, menyewakan, mendistribusikan ulang, atau mengklaim perangkat lunak ini sebagai produk milik sendiri kepada pihak ketiga manapun tanpa izin tertulis dari Pengembang.
                            </p>

                            <h3>Pasal 6: Larangan Reverse Engineering</h3>
                            <p>
                                Klien dilarang melakukan teknik <em>Reverse Engineering</em>, Decompilation, atau Disassembly terhadap kode program untuk tujuan meniru, mencuri logika bisnis, atau membuat produk turunan yang serupa.
                            </p>
                        </section>

                        <section>
                            <h2>BAB III: PEMELIHARAAN & DUKUNGAN TEKNIS</h2>

                            <h3>Pasal 7: Batas Dukungan</h3>
                            <p>
                                Dukungan teknis dan pemeliharaan (maintenance) hanya berlaku selama periode kontrak aktif atau masa garansi yang telah disepakati. Di luar periode tersebut, dukungan bersifat <em>best-effort</em> atau berbayar.
                            </p>

                            <h3>Pasal 8: Biaya Sewa Server (Server Rental)</h3>
                            <p>
                                Klien wajib membayar biaya sewa server dan domain secara berkala (<em>Recurring Annually</em>) sebesar <strong>Rp 875.000,- / tahun</strong> (nominal dapat berubah sesuai tarif vendor) sebelum tanggal jatuh tempo.
                            </p>
                            <p>
                                Masa aktif domain <code>bmtnulumajang.id</code> dapat diperiksa secara publik melalui <strong>Pandi.id</strong> atau WHOIS.
                                <br />
                                <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded mt-2 inline-block border border-slate-200">
                                    Jatuh Tempo Berikutnya: 2027-02-05T23:59:59Z
                                </span>
                            </p>

                            <h3>Pasal 9: Biaya Pengembangan Tambahan</h3>
                            <p>
                                Permintaan fitur baru, perubahan alur sistem, atau modifikasi desain yang berada di luar spesifikasi awal "Paket 2" akan dikenakan <strong>Biaya Pengembangan Tambahan</strong> (Additional Development Cost) sesuai kesepakatan baru.
                            </p>

                            <h3>Pasal 10: Penolakan Tanggung Jawab</h3>
                            <p>
                                Sagamuda.id tidak bertanggung jawab atas kerusakan sistem, kehilangan data, atau kegagalan fungsi yang disebabkan oleh modifikasi kode secara tidak sah oleh pihak Klien, kesalahan penggunaan admin panel, atau gangguan pada server hosting pihak ketiga.
                            </p>
                        </section>

                        <section>
                            <h2>BAB IV: PEMUTUSAN LAYANAN</h2>

                            <h3>Pasal 11: Hak Suspend & Terminasi</h3>
                            <p>
                                Pengembang berhak menangguhkan atau memutuskan lisensi penggunaan jika:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Klien gagal memenuhi kewajiban pembayaran perpanjangan domain/hosting/maintenance.</li>
                                <li>Klien terbukti melanggar Hak Kekayaan Intelektual (misal: menjual kode ke pihak lain).</li>
                            </ul>

                            <h3>Pasal 12: Kewajiban Pasca Terminasi</h3>
                            <p>
                                Dalam hal pemutusan layanan, Klien wajib menghentikan segala penggunaan perangkat lunak. Klien tetap berhak mendapatkan salinan mentah data bisnis mereka (ekspor Excel/CSV/SQL) sebelum akses ditutup sepenuhnya.
                            </p>
                        </section>

                        <section>
                            <h2>BAB V: PRIVASI & KEAMANAN DATA</h2>

                            <h3>Pasal 13: Komitmen Kerahasiaan</h3>
                            <p>
                                Pengembang berkomitmen menjaga kerahasiaan data warga Desa Sumberanyar. Akses ke database hanya dilakukan atas izin Klien untuk keperluan perbaikan (debugging) atau pemeliharaan.
                            </p>

                            <h3>Pasal 14: Tidak Ada Penjualan Data</h3>
                            <p>
                                Pengembang menjamin <strong>TIDAK AKAN</strong> menjual, membagikan, atau menyewakan data pribadi warga kepada pihak ketiga manapun (Advertiser/Data Broker).
                            </p>
                        </section>

                    </div>

                    {/* Footer License Badge */}
                    <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
                        <div className="text-center sm:text-left">
                            <span className="block font-bold text-slate-700">Developed & Licensed by:</span>
                            <span>Sagamuda.id</span>
                        </div>
                        <div className="text-center sm:text-right">
                            <span className="block font-bold text-slate-700">Licensee:</span>
                            <span>Pemerintah Desa Sumberanyar - {new Date().getFullYear()}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
