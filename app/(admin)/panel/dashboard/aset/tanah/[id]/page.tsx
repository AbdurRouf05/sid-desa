"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pb } from "@/lib/pb";
import { TanahDesaForm } from "../form";
import { Loader2 } from "lucide-react";

export default function EditTanahPage() {
    const params = useParams();
    const id = params.id as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pb.collection("tanah_desa").getOne(id)
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-slate-500">Data tanah tidak ditemukan.</div>;
    }

    return <TanahDesaForm initialData={data} />;
}
