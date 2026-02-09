"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { SectionHeading } from "@/components/ui/section-heading";
import { MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle2, Clock, Archive } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { formatDate } from "@/lib/number-utils";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'contacted' | 'resolved' | 'archived';
    sent_at: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const records = await pb.collection('inquiries').getList<Inquiry>(1, 50, {
                sort: '-sent_at',
            });
            setInquiries(records.items);
        } catch (e) {
            console.error("Error loading inquiries", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const updateStatus = async (id: string, status: Inquiry['status']) => {
        if (!confirm(`Ubah status menjadi ${status}?`)) return;
        try {
            await pb.collection('inquiries').update(id, { status });
            fetchInquiries(); // Refresh
        } catch (e) {
            alert("Gagal update status");
        }
    };

    const deleteInquiry = async (id: string) => {
        if (!confirm("Hapus pesan ini permanen?")) return;
        try {
            await pb.collection('inquiries').delete(id);
            setInquiries(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Gagal menghapus pesan");
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1"><Clock className="w-3 h-3" /> Baru</span>;
            case 'contacted': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1"><Phone className="w-3 h-3" /> Dihubungi</span>;
            case 'resolved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1"><Archive className="w-3 h-3" /> Arsip</span>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat pesan...</div>;

    return (
        <main>
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Pesan Masuk</h1>
                        <p className="text-emerald-100 mt-2">Daftar pertanyaan dan pesan dari formulir kontak website.</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Belum ada pesan masuk</h3>
                    <p className="text-slate-500">Pesan dari formulir kontak akan muncul di sini.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {inquiries.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
                            {/* Status Indicator Stripe */}
                            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${item.status === 'new' ? 'bg-blue-500' : 'bg-slate-200'}`}></div>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Header / Meta */}
                                <div className="md:w-1/4 space-y-3 pl-4">
                                    <h3 className="font-bold text-slate-900 line-clamp-1" title={item.name}>{item.name}</h3>
                                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3 shrink-0" />
                                            <span className="truncate" title={item.email}>{item.email || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3 h-3 shrink-0" />
                                            <span>{item.phone || "-"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 shrink-0" />
                                            <span>{formatDate(item.sent_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        {statusBadge(item.status)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 md:border-l md:border-slate-100 md:pl-6 space-y-3">
                                    <h4 className="font-semibold text-slate-800 text-sm">Subjek: {item.subject}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 md:w-32 md:border-l md:border-slate-100 md:pl-6 justify-center">
                                    {item.status === 'new' && (
                                        <TactileButton variant="primary" className="h-8 px-3 text-xs" onClick={() => updateStatus(item.id, 'contacted')}>
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Proses
                                        </TactileButton>
                                    )}
                                    {item.status === 'contacted' && (
                                        <TactileButton variant="secondary" className="h-8 px-3 text-xs" onClick={() => updateStatus(item.id, 'resolved')}>
                                            Selesai
                                        </TactileButton>
                                    )}
                                    <button
                                        onClick={() => deleteInquiry(item.id)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
