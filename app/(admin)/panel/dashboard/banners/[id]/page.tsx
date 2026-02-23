"use client";

import React, { useEffect, useState } from "react";
import { BannerForm } from "../form";
import { pb } from "@/lib/pb";
import { Loader2 } from "lucide-react";

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { id } = await params;
                const record = await pb.collection('hero_banners').getOne(id);
                setData(record);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params]);

    if (loading) return <div className="text-center py-20 text-slate-500"><Loader2 className="animate-spin w-8 h-8 mx-auto" />Memuat banner...</div>;
    if (!data) return <div>Banner tidak ditemukan</div>;

    return (
        <main>
            <BannerForm initialData={data} isEdit />
        </main>
    );
}
