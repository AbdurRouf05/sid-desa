"use client";

import { useParams } from "next/navigation";
import { RekeningKasForm } from "../form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function EditRekeningPage() {
    const params = useParams();

    return (
        <main className="animate-in fade-in duration-700">
            <RekeningKasForm id={params.id as string} />
        </main>
    );
}

