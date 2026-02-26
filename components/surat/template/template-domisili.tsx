import { SuratKeluar } from "@/types";

export function TemplateDomisili({ data }: { data: SuratKeluar }) {
    return (
        <div className="w-full font-serif flex-1 flex flex-col items-center">
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase underline tracking-wider mb-1">
                    Surat Keterangan Domisili
                </h1>
                <p className="text-sm">
                    Nomor: {data.nomor_agenda}
                </p>
            </div>

            <div className="w-full text-justify text-[12pt] leading-relaxed space-y-4">
                <p>
                    Kepala Desa Sumberanyar, Kecamatan Modung, Kabupaten Bangkalan, menerangkan dengan sebenarnya bahwa:
                </p>

                <table className="w-full ml-8 mb-4">
                    <tbody>
                        <tr>
                            <td className="w-48 py-1">Nama Lengkap</td>
                            <td className="w-4">:</td>
                            <td className="font-bold uppercase">{data.nama_pemohon}</td>
                        </tr>
                        <tr>
                            <td className="py-1">NIK / No. KTP Asal</td>
                            <td>:</td>
                            <td>{data.nik_pemohon}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Pekerjaan</td>
                            <td>:</td>
                            <td>............................................................</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    Orang tersebut di atas merupakan penduduk yang saat surat ini diterbitkan <strong>benar-benar berdomisili / bertempat tinggal</strong> di wilayah Desa Sumberanyar pada alamat:
                </p>

                <div className="ml-8 mb-4 p-4 border border-dashed border-gray-400">
                    <p>Dusun / Jalan : ............................................................</p>
                    <p>RT / RW : ................... / ...................</p>
                    <p>Desa Sumberanyar, Kec. Modung, Kab. Bangkalan</p>
                </div>

                <p>
                    Surat keterangan ini diberikan atas permintaan yang bersangkutan untuk keperluan administrasi kependudukan sementara, melamar pekerjaan, atau urusan lain yang sah secara hukum. 
                </p>

                <p>
                    Demikian surat keterangan domisili ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
                </p>
            </div>
        </div>
    );
}
