"use client";

import { motion } from "framer-motion";
import { Breadcrumb } from "../../../../components/ui/breadcrumb";
import { FileSignature, CheckCircle2, AlertCircle, Phone, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MapPin, CreditCard, Users, Briefcase, FileText } from "lucide-react";

export default function PersuratanPage() {
    const services = [
        {
            id: "sktm",
            title: "Surat Keterangan Tidak Mampu (SKTM)",
            icon: CreditCard,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100",
            description: "Surat pengantar bagi warga kurang mampu untuk keperluan pengajuan beasiswa, keringanan biaya rumah sakit, atau bantuan sosial.",
            requirements: [
                "Fotokopi KTP Pemohon (suami & istri jika sudah menikah)",
                "Fotokopi Kartu Keluarga (KK)",
                "Surat Pengantar dari RT/RW setempat",
                "Foto rumah tipe seluruh sisi (depan, belakang, samping, dalam)",
                "Fotokopi rekening pembayaran listrik bulan terakhir"
            ]
        },
        {
            id: "domisili",
            title: "Surat Keterangan Domisili",
            icon: MapPin,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
            description: "Surat yang menerangkan bahwa warga benar-benar bertempat tinggal sementara di wilayah Desa Sumberanyar.",
            requirements: [
                "Fotokopi KTP Asal",
                "Fotokopi Kartu Keluarga (KK) Asal",
                "Surat Keterangan Pindah (SKPWNI) jika pindah permanen",
                "Surat Pengantar dari RT/RW tempat tinggal saat ini di Sumberanyar"
            ]
        },
        {
            id: "usaha",
            title: "Surat Keterangan Usaha (SKU)",
            icon: Briefcase,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            description: "Surat legalitas tingkat desa yang menerangkan keberadaan usaha milik warga, biasanya untuk keperluan pencairan KUR atau izin lanjutan.",
            requirements: [
                "Fotokopi KTP Pemohon",
                "Fotokopi Kartu Keluarga (KK)",
                "Surat Pengantar dari RT/RW setempat dengan mencantumkan nama dan jenis usaha",
                "Foto tempat/kegiatan usaha (dicetak)",
                "Bukti pelunasan PBB tahun berjalan (opsional namun disarankan)"
            ]
        },
        {
            id: "kematian",
            title: "Surat Pengantar Kematian",
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100",
            description: "Syarat wajib untuk pelaporan akta kematian ke Dispendukcapil guna memperbarui data kependudukan ahli waris.",
            requirements: [
                "Surat Keterangan Kematian dari Dokter/Rumah Sakit (jika meninggal di RS)",
                "KTP Asli Almarhum/Almarhumah",
                "Kartu Keluarga (KK) Asli tempat Almarhum/Almarhumah terdaftar",
                "Fotokopi KTP Pelapor (Ahli waris/Keluarga)",
                "Fotokopi KTP 2 orang Saksi Kematian"
            ]
        },
        {
            id: "kelahiran",
            title: "Surat Keterangan Lahir",
            icon: FileText,
            color: "text-teal-500",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-100",
            description: "Syarat pengurusan Akta Kelahiran dan penambahan NIK bayi baru lahir ke dalam Kartu Keluarga.",
            requirements: [
                "Surat Keterangan Lahir dari Bidan/Dokter/Rumah Sakit Asli",
                "Fotokopi Buku Nikah / Akta Perkawinan Orang Tua (Legalisir KUA bila perlu)",
                "Kartu Keluarga (KK) Asli orang tua",
                "Fotokopi KTP kedua orang tua",
                "Fotokopi KTP 2 orang Saksi Kelahiran"
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header Section */}
            <section className="bg-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-emerald-900/90 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('/grain.png')] opacity-20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Breadcrumb
                            items={[
                                { label: "Beranda", href: "/" },
                                { label: "Layanan Desa", href: "/layanan" },
                                { label: "Persuratan", href: "/layanan/persuratan" },
                            ]}
                            className="justify-center mb-8 text-emerald-100"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 text-emerald-100 mb-6"
                        >
                            <FileSignature className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">Layanan Administrasi Publik</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight"
                        >
                            <span className="text-gold">Syarat & Layanan</span> Persuratan Desa
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg lg:text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto"
                        >
                            Informasi lengkap mengenai dokumen prasyarat yang harus Anda bawa ke balai desa untuk mengurus administrasi kependudukan dan surat pengantar lainnya.
                        </motion.p>
                    </div>
                </div>

                {/* Decorative Bottom Curve */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
            </section>

            {/* Main Content Area */}
            <section className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-12 shadow-sm flex gap-4 items-start">
                        <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0 mt-1">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-yellow-800 font-bold text-lg mb-2">Perhatian Sebelum ke Balai Desa</h3>
                            <p className="text-yellow-700 leading-relaxed">
                                Mohon pastikan <strong className="font-bold">seluruh persyaratan telah difotokopi</strong> (kecuali disebutkan Asli) dan dimasukkan ke dalam map sebelum diserahkan ke meja pelayanan/perangkat desa. Jam pelayanan operasional balai desa adalah Senin - Jumat (08.00 - 15.00 WIB). Layanan tidak dipungut biaya (Gratis).
                            </p>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {services.map((service, index) => (
                            <motion.div 
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                            >
                                <div className={cn("p-6 md:p-8 flex-1 border-b-[6px]", service.borderColor)}>
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", service.bgColor)}>
                                        <service.icon className={cn("w-7 h-7", service.color)} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight group-hover:text-emerald-700 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    
                                    <div className="mt-8">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            Syarat Berkas:
                                        </h4>
                                        <ul className="space-y-3">
                                            {service.requirements.map((req, i) => (
                                                <li key={i} className="flex gap-3 text-slate-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0 mt-2"></span>
                                                    <span className="text-sm">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Support */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border border-slate-200 shadow-sm max-w-4xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
                        
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Butuh Layanan Surat Lainnya?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                            Jika Anda membutuhkan jenis surat selain yang tercantum di atas, silakan datang langsung membawa KTP & KK Asli untuk berkonsultasi dengan Perangkat Desa kami di jam kerja.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/pengaduan" className="px-8 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/20">
                                Hubungi Via Pengaduan
                            </Link>
                            <a href="tel:+62811112222" className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                                <Phone className="w-5 h-5" /> 0811-1234-5678
                            </a>
                        </div>
                    </motion.div>

                </div>
            </section>
        </main>
    );
}
