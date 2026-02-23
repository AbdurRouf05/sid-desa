"use client";

import React, { useEffect, useState } from "react";
import { BranchForm } from "../form";
import { pb } from "@/lib/pb";
import { Loader2 } from "lucide-react";

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { id } = await params;
                const record = await pb.collection('branches').getOne(id);
                setData(record);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params]);

    if (loading) return <div className="text-center py-20 text-slate-500"><Loader2 className="animate-spin w-8 h-8 mx-auto" />Memuat data...</div>;
    if (!data) return <div>Data tidak ditemukan</div>;

    return (
        <main>
            <BranchForm initialData={data} isEdit />
        </main>
    );
}
