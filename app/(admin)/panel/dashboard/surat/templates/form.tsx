"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, Code, FileText, Settings, Info, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const templateSchema = z.object({
    nama_surat: z.string().min(1, "Nama surat tidak boleh kosong"),
    kode_surat: z.string().min(1, "Kode surat tidak boleh kosong"),
    template_html: z.string().min(1, "Template HTML tidak boleh kosong"),
    fields_config: z.any().optional(),
});

type TemplateInputs = z.infer<typeof templateSchema>;

export default function TemplateEditorPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = isEdit ? useParams() : null;
    const [isLoading, setIsLoading] = useState(false);
    const [fields, setFields] = useState<{ name: string; label: string; type: string }[]>([]);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<TemplateInputs>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            nama_surat: "",
            kode_surat: "",
            template_html: "<h1>SURAT KETERANGAN</h1><p>Diberikan kepada:</p><p>Nama: {{nama_lengkap}}</p>",
            fields_config: {}
        }
    });

    // Fetch data if edit
    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchTemplate = async () => {
                try {
                    const record = await pb.collection('surat_templates').getOne(params.id as string);
                    setValue("nama_surat", record.nama_surat);
                    setValue("kode_surat", record.kode_surat);
                    setValue("template_html", record.template_html);
                    
                    if (record.fields_config) {
                        const config = typeof record.fields_config === 'string' 
                            ? JSON.parse(record.fields_config) 
                            : record.fields_config;
                        
                        const fieldList = Object.entries(config).map(([name, detail]: [string, any]) => ({
                            name,
                            label: detail.label || name,
                            type: detail.type || 'text'
                        }));
                        setFields(fieldList);
                    }
                } catch (e) {
                    console.error("Failed to load template", e);
                    alert("Gagal memuat template");
                    router.push("/panel/dashboard/surat/templates");
                }
            };
            fetchTemplate();
        }
    }, [isEdit, params, setValue, router]);

    const addField = () => {
        setFields([...fields, { name: "", label: "", type: "text" }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, key: string, value: string) => {
        const newFields = [...fields];
        (newFields[index] as any)[key] = value;
        setFields(newFields);
    };

    const onSubmit = async (data: TemplateInputs) => {
        setIsLoading(true);
        try {
            // Convert field list back to JSON config
            const config: any = {};
            fields.forEach(f => {
                if (f.name) {
                    config[f.name] = { label: f.label, type: f.type };
                }
            });

            const finalData = {
                ...data,
                fields_config: config
            };

            if (isEdit && params?.id) {
                await pb.collection('surat_templates').update(params.id as string, finalData);
            } else {
                await pb.collection('surat_templates').create(finalData);
            }

            router.push("/panel/dashboard/surat/templates");
            router.refresh();
        } catch (e) {
            console.error("Save failed", e);
            alert("Gagal menyimpan template.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto pb-20 p-4 md:p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-4 md:-mx-8 px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/surat/templates"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Template Surat" : "Buat Template Baru"}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-500">
                                Rancang format surat dan tentukan variabel data yang diperlukan.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span>Simpan Template</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Editor & Config (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Surat</label>
                                <input
                                    {...register("nama_surat")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    placeholder="Contoh: Surat Keterangan Domisili"
                                />
                                {errors.nama_surat && <p className="text-xs text-red-500 mt-1">{errors.nama_surat.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Kode Surat</label>
                                <input
                                    {...register("kode_surat")}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase"
                                    placeholder="Contoh: SKU"
                                />
                                {errors.kode_surat && <p className="text-xs text-red-500 mt-1">{errors.kode_surat.message}</p>}
                            </div>
                        </div>

                        {/* Template HTML Editor */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Code className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-800">HTML Template</h3>
                                </div>
                                <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                    Gunakan <code>{"{{variabel}}"}</code> untuk menyisipkan data.
                                </div>
                            </div>
                            <textarea
                                {...register("template_html")}
                                className="w-full h-[500px] p-4 font-mono text-sm bg-slate-900 text-emerald-400 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none border border-slate-800"
                                placeholder="<html>...</html>"
                            />
                            {errors.template_html && <p className="text-xs text-red-500 mt-1">{errors.template_html.message}</p>}
                        </div>
                    </div>

                    {/* Right: Dynamic Fields (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-800">Variabel Kustom</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <p className="text-xs text-slate-400 mb-4">
                                Tambahkan variabel kustom yang tidak ada di Data Penduduk (misal: "Keperluan", "Tujuan").
                            </p>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {fields.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                                        <Info className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                                        <p className="text-xs text-slate-300">Belum ada variabel kustom</p>
                                    </div>
                                )}
                                {fields.map((field, idx) => (
                                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeField(idx)}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        <input
                                            value={field.name}
                                            onChange={(e) => updateField(idx, 'name', e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 outline-none"
                                            placeholder="Nama Variabel (slug)"
                                        />
                                        <input
                                            value={field.label}
                                            onChange={(e) => updateField(idx, 'label', e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 outline-none"
                                            placeholder="Label (untuk form)"
                                        />
                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(idx, 'type', e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-emerald-500 outline-none"
                                        >
                                            <option value="text">Teks Pendek</option>
                                            <option value="textarea">Teks Panjang</option>
                                            <option value="date">Tanggal</option>
                                            <option value="number">Angka</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Variabel Sistem (Otomatis)</h4>
                                <div className="space-y-1.5">
                                    {['nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'rt', 'rw', 'agama', 'pekerjaan'].map(v => (
                                        <div key={v} className="flex items-center justify-between text-[11px] bg-emerald-50/50 text-emerald-700 px-2 py-1 rounded border border-emerald-100/50">
                                            <span>{v}</span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const current = watch("template_html");
                                                    setValue("template_html", current + `{{${v}}}`);
                                                }}
                                                className="hover:text-emerald-900 font-bold"
                                            >
                                                Sisipkan
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
