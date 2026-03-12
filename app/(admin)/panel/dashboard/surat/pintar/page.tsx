"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { 
    Search, 
    User, 
    FileText, 
    ArrowRight, 
    Printer, 
    FileDown,
    ChevronLeft,
    Check,
    Settings,
    UserCircle,
    Copy,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SmartLetterWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Resident Selection
    const [searchResident, setSearchResident] = useState("");
    const [residents, setResidents] = useState<any[]>([]);
    const [selectedResident, setSelectedResident] = useState<any>(null);

    // Step 2: Template Selection
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    // Step 3: Fill Variables & Preview
    const [variables, setVariables] = useState<any>({});
    const [previewHtml, setPreviewHtml] = useState("");
    const printRef = useRef<HTMLDivElement>(null);

    // Fetch Residents
    useEffect(() => {
        if (searchResident.length > 2) {
            const timeout = setTimeout(async () => {
                try {
                    const res = await pb.collection('data_penduduk').getList(1, 10, {
                        filter: `nama_lengkap ~ "${searchResident}" || nik ~ "${searchResident}"`
                    });
                    setResidents(res.items);
                } catch (e) {
                    console.error(e);
                }
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setResidents([]);
        }
    }, [searchResident]);

    // Fetch Templates
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await pb.collection('surat_templates').getFullList();
                setTemplates(res);
            } catch (e) {
                console.error(e);
            }
        };
        fetch();
    }, []);

    // Handle template selection
    useEffect(() => {
        if (selectedTemplate && selectedResident) {
            // Auto-fill system variables
            const sysVars: any = {
                nama_lengkap: selectedResident.nama_lengkap,
                nik: selectedResident.nik,
                tempat_lahir: selectedResident.tempat_lahir,
                tanggal_lahir: selectedResident.tanggal_lahir ? new Date(selectedResident.tanggal_lahir).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }) : "",
                alamat: selectedResident.alamat,
                rt: selectedResident.rt,
                rw: selectedResident.rw,
                agama: selectedResident.agama,
                pekerjaan: selectedResident.pekerjaan,
                status_kawin: selectedResident.status_kawin,
                pendidikan: selectedResident.pendidikan,
                no_kk: selectedResident.no_kk,
                // Current date
                tanggal_sekarang: new Date().toLocaleDateString('id-ID', {
                   day: 'numeric',
                   month: 'long',
                   year: 'numeric'
                })
            };

            // Initialize custom variables from template config
            const customVars: any = {};
            if (selectedTemplate.fields_config) {
                const config = typeof selectedTemplate.fields_config === 'string' 
                    ? JSON.parse(selectedTemplate.fields_config) 
                    : selectedTemplate.fields_config;
                    
                Object.keys(config).forEach(key => {
                    customVars[key] = "";
                });
            }

            setVariables({ ...sysVars, ...customVars });
        }
    }, [selectedTemplate, selectedResident]);

    // Live preview generator
    useEffect(() => {
        if (selectedTemplate && variables) {
            let html = selectedTemplate.template_html;
            Object.entries(variables).forEach(([key, val]: [string, any]) => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, val || `<span class="bg-yellow-100 text-yellow-800 border-b border-yellow-300 px-1">[${key}]</span>`);
            });
            setPreviewHtml(html);
        }
    }, [variables, selectedTemplate]);

    const handlePrint = () => {
        const content = printRef.current?.innerHTML;
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(`
                <html>
                    <head>
                        <title>Cetak Surat - ${selectedTemplate.nama_surat}</title>
                        <style>
                            @page { size: A4; margin: 2cm; }
                            body { 
                                font-family: "Times New Roman", Times, serif; 
                                font-size: 12pt; 
                                line-height: 1.5;
                                color: black;
                            }
                            h1, h2, h3 { text-align: center; margin-bottom: 0.5cm; }
                            .kop-surat { text-align: center; border-bottom: 3px double black; padding-bottom: 10px; margin-bottom: 20px; }
                            .nomor-surat { text-align: center; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                            td { vertical-align: top; padding: 2px 0; }
                            .signature-box { margin-top: 50px; margin-left: auto; width: 6cm; text-align: center; }
                            .signature-space { height: 2cm; }
                            * { box-sizing: border-box; }
                        </style>
                    </head>
                    <body>
                        ${content}
                    </body>
                </html>
            `);
            win.document.close();
            win.focus();
            setTimeout(() => {
                win.print();
            }, 500);
        }
    };

    return (
        <main className="max-w-6xl mx-auto pb-20 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-jakarta">Pembuat Surat Pintar</h1>
                    <p className="text-slate-500">Otomasi pelayanan surat warga dengan data terintegrasi.</p>
                </div>
            </div>

            {/* Stepper UI */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 1, label: "Pilih Warga", icon: UserCircle },
                    { id: 2, label: "Pilih Format", icon: FileText },
                    { id: 3, label: "Kustomisasi & Cetak", icon: Settings }
                ].map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 shrink-0">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            step === s.id ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110" : 
                            step > s.id ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-300 border border-slate-100"
                        )}>
                            {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[10px] uppercase tracking-widest font-bold",
                                step >= s.id ? "text-emerald-600" : "text-slate-300"
                            )}>Tahap 0{s.id}</span>
                            <span className={cn(
                                "text-sm font-bold",
                                step === s.id ? "text-slate-900" : "text-slate-400"
                            )}>{s.label}</span>
                        </div>
                        {i < 2 && <div className="w-12 h-px bg-slate-200 mx-2"></div>}
                    </div>
                ))}
            </div>

            {/* Step 1: Resident Search */}
            {step === 1 && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <UserCircle className="w-64 h-64" />
                    </div>
                    
                    <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">Identifikasi Pemohon</h2>
                            <p className="text-slate-500 text-sm">Masukkan NIK atau Nama warga untuk mengambil data otomatis.</p>
                        </div>
                        
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Cari NIK atau Nama..."
                                value={searchResident}
                                onChange={(e) => setSearchResident(e.target.value)}
                                autoFocus
                                className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xl shadow-inner font-jakarta"
                            />
                        </div>

                        <div className="space-y-3 text-left">
                            {residents.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => {
                                        setSelectedResident(r);
                                        setStep(2);
                                    }}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl border border-emerald-100 shadow-sm transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                            {r.nama_lengkap[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{r.nama_lengkap.toUpperCase()}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                <span className="font-mono">NIK: {r.nik}</span>
                                                <span>•</span>
                                                <span>RT {r.rt}/RW {r.rw}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </button>
                            ))}
                            {searchResident.length > 2 && residents.length === 0 && (
                                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 italic text-sm">Data warga tidak ditemukan.</p>
                                    <Link href="/panel/dashboard/penduduk/baru" className="text-emerald-600 font-bold text-xs mt-2 inline-block hover:underline">
                                        + Tambah Data Penduduk Baru
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Template Selection */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Pilih Format Surat</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                            Pilihan: {templates.length} Template
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(t => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setSelectedTemplate(t);
                                    setStep(3);
                                }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all text-left flex flex-col group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] -mr-4 -mt-4 transition-transform group-hover:scale-110">
                                    <FileText className="w-24 h-24" />
                                </div>
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-lg mb-1">{t.nama_surat}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t.kode_surat}</p>
                                
                                <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-emerald-600">
                                    <span>Gunakan Blangko Ini</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Customization & Preview */}
            {step === 3 && selectedTemplate && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Configuration Form */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Isi Data Surat</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedTemplate.nama_surat}</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {Object.entries(selectedTemplate.fields_config || {}).map(([key, detail]: [string, any]) => (
                                    <div key={key}>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                            {detail.label || key}
                                        </label>
                                        {detail.type === 'textarea' ? (
                                            <textarea 
                                                value={variables[key] || ""}
                                                onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm h-28 resize-none transition-all"
                                                placeholder={`Masukkan ${detail.label || key}...`}
                                            />
                                        ) : detail.type === 'date' ? (
                                            <input 
                                                type="date"
                                                value={variables[key] || ""}
                                                onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all"
                                            />
                                        ) : (
                                            <input 
                                                type="text"
                                                value={variables[key] || ""}
                                                onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm transition-all"
                                                placeholder={`Ketik ${detail.label || key}...`}
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* System Info (Auto-populated) */}
                                <div className="pt-8 border-t border-slate-50">
                                    <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Informasi Pemohon</h4>
                                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-medium tracking-tight">Nama</span>
                                            <span className="font-bold text-slate-700">{selectedResident.nama_lengkap.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-medium tracking-tight">NIK</span>
                                            <span className="font-mono text-slate-500 font-medium">{selectedResident.nik}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handlePrint}
                                className="w-full bg-emerald-600 text-white px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-4 shadow-xl shadow-emerald-700/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all group active:scale-95"
                            >
                                <Printer className="w-6 h-6 transition-transform group-hover:rotate-12" /> 
                                <span className="text-lg">Cetak Surat Sekarang</span>
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-white border border-slate-200 text-slate-600 px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-xs">
                                    <FileDown className="w-4 h-4" /> Download PDF
                                </button>
                                <button className="bg-white border border-slate-100 text-slate-400 px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-xs" title="Simpan sebagai draf di Agenda">
                                    <Save className="w-4 h-4" /> Simpan Agenda
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Real-time Interactive Preview */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <Printer className="w-4 h-4 text-emerald-500" />
                                Preview Cetak (A4)
                            </h3>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-800/90 backdrop-blur-sm p-4 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-700/50 flex justify-center items-start overflow-auto max-h-[85vh] custom-scrollbar">
                            <div 
                                ref={printRef}
                                className="bg-white w-[21cm] min-h-[29.7cm] shadow-2xl p-[2.5cm] origin-top md:scale-100 transition-transform duration-500"
                            >
                                <style jsx global>{`
                                    .prose-print {
                                        font-family: "Times New Roman", Times, serif;
                                        line-height: 1.6;
                                        color: black;
                                        font-size: 12pt;
                                    }
                                    .prose-print h1 { font-size: 16pt; font-weight: bold; }
                                    .prose-print p { margin-bottom: 1em; text-align: justify; }
                                    .prose-print table { border: none !important; }
                                    .prose-print td { border: none !important; padding: 2px 0; }
                                `}</style>
                                <div dangerouslySetInnerHTML={{ __html: previewHtml }} className="prose-print" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
