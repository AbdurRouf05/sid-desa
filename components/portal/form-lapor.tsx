"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { pb } from "@/lib/pb";

export function FormLapor() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        nama_pelapor: '',
        tempat_tinggal: '',
        isi_laporan: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            await pb.collection('pengaduan_warga').create({
                ...formData,
                status: 'Baru',
                // PB Editor field usually accepts HTML string so we can pass text directly
            });
            setStatus('success');
            setFormData({ nama_pelapor: '', tempat_tinggal: '', isi_laporan: '' });
        } catch (error) {
             console.error(error);
             setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Laporan Terkirim!</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                    Terima kasih telah berpartisipasi. Laporan Anda telah masuk ke sistem kami dan akan segera ditindaklanjuti oleh aparatur desa.
                </p>
                <button onClick={() => setStatus('idle')} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
                    Kirim Laporan Lain
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                    type="text" 
                    required
                    maxLength={100}
                    value={formData.nama_pelapor}
                    onChange={(e) => setFormData({...formData, nama_pelapor: e.target.value})}
                    placeholder="Masukkan nama lengkap Anda" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-desa-primary focus:border-desa-primary outline-none text-slate-700" 
                />
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tempat Tinggal (Alamat / Dusun)</label>
                <input 
                    type="text" 
                    required
                    maxLength={150}
                    value={formData.tempat_tinggal}
                    onChange={(e) => setFormData({...formData, tempat_tinggal: e.target.value})}
                    placeholder="Contoh: Dusun Krajan RT 01 / RW 02" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-desa-primary focus:border-desa-primary outline-none text-slate-700" 
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Isi Keluhan atau Laporan</label>
                <textarea 
                    required
                    rows={5}
                    value={formData.isi_laporan}
                    onChange={(e) => setFormData({...formData, isi_laporan: e.target.value})}
                    placeholder="Ceritakan detail aduan, masukan, atau laporan kejadian..." 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-desa-primary focus:border-desa-primary outline-none text-slate-700 resize-none" 
                ></textarea>
            </div>

            {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    Terjadi kesalahan saat mengirim laporan. Silakan coba beberapa saat lagi.
                </div>
            )}

            <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-desa-primary hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === 'loading' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</>
                ) : (
                    <><Send className="w-5 h-5" /> Kirim Laporan</>
                )}
            </button>
        </form>
    );
}
