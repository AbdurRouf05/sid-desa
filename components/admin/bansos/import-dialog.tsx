"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { pb } from "@/lib/pb";
import { 
    FileSpreadsheet, Download, Upload, Loader2, 
    CheckCircle2, AlertCircle, X, Info 
} from "lucide-react";
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogTrigger, DialogDescription 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImportBansosDialogProps {
    onComplete: () => void;
}

export function ImportBansosDialog({ onComplete }: ImportBansosDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResults(null);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                "NIK": "1234567890123456",
                "Nama Lengkap": "CONTOH NAMA WARGA",
                "Jenis Bantuan": "PKH",
                "Tahun": 2026
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template Bansos");
        XLSX.writeFile(wb, "Template_Import_Bansos.xlsx");
    };

    const processImport = async () => {
        if (!file) return;

        setIsUploading(true);
        setResults(null);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

            if (jsonData.length === 0) {
                toast.error("File Excel kosong atau format tidak sesuai.");
                setIsUploading(false);
                return;
            }

            // Fetch existing categories to map names to IDs
            const kategoriRecords = await pb.collection("kategori_bantuan").getFullList();
            const kategoriMap = new Map(kategoriRecords.map(k => [k.nama.toLowerCase(), k.id]));

            let successCount = 0;
            let failedCount = 0;
            const errorLogs: string[] = [];

            for (const row of jsonData) {
                try {
                    // Mapping columns (flexible naming)
                    const rawNik = String(row["NIK"] || row["nik"] || "").trim();
                    const nama = String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim();
                    const rawJenis = String(row["Jenis Bantuan"] || row["Jenis"] || row["jenis"] || "").trim();
                    const tahun = Number(row["Tahun"] || row["tahun"] || new Date().getFullYear());

                    // Validation
                    if (!rawNik || rawNik.length !== 16) {
                        throw new Error(`NIK '${rawNik}' tidak valid (harus 16 digit)`);
                    }
                    if (!nama) {
                        throw new Error(`Nama untuk NIK ${rawNik} kosong`);
                    }

                    // Handle Category
                    let jenisBantuanId = kategoriMap.get(rawJenis.toLowerCase());
                    if (!jenisBantuanId && rawJenis) {
                        const newCat = await pb.collection("kategori_bantuan").create({ nama: rawJenis });
                        jenisBantuanId = newCat.id;
                        kategoriMap.set(rawJenis.toLowerCase(), jenisBantuanId);
                    }

                    // Check for existing NIK (Upsert logic - here we overwrite if exists)
                    const existing = await pb.collection("penerima_bansos").getList(1, 1, {
                        filter: `nik = "${rawNik}"`
                    });

                    const payload = {
                        nik: rawNik,
                        nama: nama.toUpperCase(),
                        jenis_bantuan: jenisBantuanId,
                        tahun_penerimaan: tahun
                    };

                    if (existing.items.length > 0) {
                        await pb.collection("penerima_bansos").update(existing.items[0].id, payload);
                    } else {
                        await pb.collection("penerima_bansos").create(payload);
                    }

                    successCount++;
                } catch (err: any) {
                    failedCount++;
                    errorLogs.push(err.message || "Gagal memproses baris");
                }
            }

            setResults({
                success: successCount,
                failed: failedCount,
                errors: errorLogs.slice(0, 5) // Only show first 5 errors to avoid clutter
            });

            if (successCount > 0) {
                toast.success(`Berhasil mengimpor ${successCount} data.`);
                onComplete();
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan teknis saat membaca file.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setFile(null);
                setResults(null);
            }
        }}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm border border-slate-200">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Import Excel
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">Import Data Bansos</DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Unggah file .xlsx untuk pembaruan data massal.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Template Card */}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm">
                                <Info className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Belum punya formatnya?</p>
                                <p className="text-[9px] text-emerald-600/70 font-bold uppercase mt-0.5">Gunakan template standar kami.</p>
                            </div>
                        </div>
                        <button 
                            onClick={downloadTemplate}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-900/10"
                            title="Unduh Template"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "cursor-pointer border-2 border-dashed rounded-[1.5rem] p-8 transition-all flex flex-col items-center gap-3",
                            file ? "bg-slate-50 border-emerald-300" : "bg-slate-50/50 border-slate-200 hover:border-emerald-400 hover:bg-white"
                        )}
                    >
                        <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        {file ? (
                            <>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <FileSpreadsheet className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{file.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Klik untuk unggah file</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Hanya mendukung format .xlsx</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Results / Error Log */}
                    {results && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <div>
                                        <p className="text-[14px] font-black text-emerald-700 leading-none">{results.success}</p>
                                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Berhasil</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-4 h-4 text-rose-600" />
                                    <div>
                                        <p className="text-[14px] font-black text-rose-700 leading-none">{results.failed}</p>
                                        <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mt-1">Gagal</p>
                                    </div>
                                </div>
                            </div>
                            {results.errors.length > 0 && (
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Log Kesalahan (Terbatas):</p>
                                    {results.errors.map((err, i) => (
                                        <div key={i} className="flex gap-2 items-start text-[9px] font-bold text-rose-600 uppercase tracking-tight leading-relaxed">
                                            <span className="w-1 h-1 rounded-full bg-rose-300 mt-1.5 shrink-0" />
                                            {err}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Tutup
                    </button>
                    <button 
                        onClick={processImport}
                        disabled={!file || isUploading}
                        className="flex-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Mulai Import
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
