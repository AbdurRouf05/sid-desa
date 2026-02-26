import Image from "next/image";

export function KopSurat() {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between pb-2">
                <div className="w-24 h-28 relative flex-shrink-0">
                    {/* Placeholder for local Garuda/Kabupaten logo */}
                    <Image 
                        src="/logo_bangkalan.png" 
                        alt="Logo Kabupaten" 
                        fill
                        className="object-contain"
                        // Fallback if image doesn't exist yet
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
                
                <div className="flex-1 text-center font-serif leading-tight">
                    <h1 className="text-xl font-bold uppercase tracking-wide">
                        Pemerintah Kabupaten Bangkalan
                    </h1>
                    <h2 className="text-xl font-bold uppercase tracking-wide">
                        Kecamatan Modung
                    </h2>
                    <h3 className="text-2xl font-bold uppercase tracking-wider mt-1 mb-1">
                        Desa Sumberanyar
                    </h3>
                    <p className="text-sm font-normal">
                        Jalan Raya Sumberanyar No. 1, Kec. Modung, Kab. Bangkalan, Jawa Timur 69166
                    </p>
                    <p className="text-sm font-normal">
                        Website: sumberanyar.desa.id | Email: pemdes@sumberanyar.desa.id
                    </p>
                </div>

                <div className="w-24 h-28 flex-shrink-0 opacity-0">
                    {/* Invisible div purely for flexbox center alignment balance */}
                </div>
            </div>
            
            {/* Double solid border using two lines */}
            <div className="w-full border-b-[3px] border-black mt-2 mb-0.5"></div>
            <div className="w-full border-b-[1px] border-black mb-6"></div>
        </div>
    );
}
