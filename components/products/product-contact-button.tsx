"use client";

import { TactileButton } from "@/components/ui/tactile-button";
import { Phone } from "lucide-react";

interface ProductContactButtonProps {
    whatsappLink: string;
    label: string;
}

export function ProductContactButton({ whatsappLink, label }: ProductContactButtonProps) {
    return (
        <TactileButton
            className="w-full justify-center bg-[#15803d] hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 text-white shadow-xl shadow-emerald-900/20 border-b-4 border-emerald-900 py-6"
            icon={<Phone className="w-6 h-6" />}
            onClick={() => window.open(whatsappLink, '_blank')}
        >
            <span className="text-xl tracking-tight font-black uppercase">{label}</span>
        </TactileButton>
    );
}
