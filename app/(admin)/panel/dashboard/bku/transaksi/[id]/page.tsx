"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { BkuTransaksi } from "@/types";
import { BkuTransaksiForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";
import { Loader2 } from "lucide-react";

export default function EditBkuTransaksiPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<BkuTransaksi | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const record = await pb.collection("bku_transaksi").getOne<BkuTransaksi>(params.id as string);
                setData(record);
            } catch (error) {
                console.error("Failed to load record", error);
                router.push("/panel/dashboard/bku/transaksi");
            } finally {
                setLoading(false);
            }
        };
        if (params?.id) {
            fetchRecord();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <main>
            <div className="mb-8">
                <SectionHeading
                    align="left"
                    title="Ubah Log Transaksi"
                    subtitle="Koreksi nominal atau dokumen bukti dari transaksi BKU."
                />
            </div>
            <BkuTransaksiForm initialData={data} />
        </main>
    );
}
