import { formatDate } from "@/lib/number-utils";

interface FooterSuratProps {
    tanggal: string; // ISO Date String
    jabatanPenandatangan?: string;
    namaPenandatangan?: string;
}

export function FooterSurat({ 
    tanggal, 
    jabatanPenandatangan = "Kepala Desa Sumberanyar",
    namaPenandatangan = "H. Moh. Toha" 
}: FooterSuratProps) {
    return (
        <div className="w-full mt-12 flex justify-end font-serif">
            <div className="w-64 text-center">
                <p className="mb-1">
                    Sumberanyar, {formatDate(tanggal, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="font-bold mb-24">{jabatanPenandatangan}</p>
                
                <p className="font-bold underline uppercase">{namaPenandatangan}</p>
            </div>
        </div>
    );
}
