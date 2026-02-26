import { SuratKeluar } from "@/types";

export function TemplateSKU({ data }: { data: SuratKeluar }) {
    return (
        <div className="w-full font-serif flex-1 flex flex-col items-center">
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase underline tracking-wider mb-1">
                    Surat Keterangan Usaha (SKU)
                </h1>
                <p className="text-sm">
                    Nomor: {data.nomor_agenda}
                </p>
            </div>

            <div className="w-full text-justify text-[12pt] leading-relaxed space-y-4">
                <p>
                    Yang bertanda tangan di bawah ini Kepala Desa Sumberanyar, Kecamatan Modung, Kabupaten Bangkalan, dengan ini menerangkan bahwa:
                </p>

                <table className="w-full ml-8 mb-4">
                    <tbody>
                        <tr>
                            <td className="w-48 py-1">Nama Lengkap</td>
                            <td className="w-4">:</td>
                            <td className="font-bold uppercase">{data.nama_pemohon}</td>
                        </tr>
                        <tr>
                            <td className="py-1">NIK</td>
                            <td>:</td>
                            <td>{data.nik_pemohon}</td>
                        </tr>
                        <tr>
                            <td className="py-1 align-top">Alamat Domisili</td>
                            <td className="align-top">:</td>
                            <td>............................................................</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    Berdasarkan pengamatan kami, bahwa nama tersebut di atas benar-benar memiliki usaha / kegiatan ekonomi produktif di wilayah Desa Sumberanyar berupa:
                </p>

                <table className="w-full ml-8 mb-4">
                    <tbody>
                        <tr>
                            <td className="w-48 py-1">Nama / Jenis Usaha</td>
                            <td className="w-4">:</td>
                            <td className="font-bold">{data.keterangan || "............................................................"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 align-top">Alamat Lokasi Usaha</td>
                            <td className="align-top">:</td>
                            <td>............................................................<br/>............................................................</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    Surat Keterangan Usaha ini diberikan semata-mata untuk keperluan pelengkap administrasi pengajuan kredit permodalan usaha (KUR) / Izin Lanjutan / Pencairan Dana Bantuan. Surat ini <strong>bukan</strong> merupakan izin resmi operasional usaha.
                </p>

                <p>
                    Demikian surat keterangan ini kami buat agar dapat dipergunakan sebagaimana mestinya oleh instansi/bank yang berkepentingan.
                </p>
            </div>
        </div>
    );
}
