import { SuratKeluar } from "@/types";

export function TemplatePengantar({ data }: { data: SuratKeluar }) {
    return (
        <div className="w-full font-serif flex-1 flex flex-col items-center">
            {/* Judul Surat */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase underline tracking-wider mb-1">
                    Surat Pengantar Biasa
                </h1>
                <p className="text-sm">
                    Nomor: {data.nomor_agenda}
                </p>
            </div>

            {/* Isi Surat */}
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
                            <td className="py-1">Jenis Kelamin</td>
                            <td>:</td>
                            <td>............................................................</td>
                        </tr>
                        <tr>
                            <td className="py-1">Tempat, Tanggal Lahir</td>
                            <td>:</td>
                            <td>............................................................</td>
                        </tr>
                        <tr>
                            <td className="py-1">Pekerjaan</td>
                            <td>:</td>
                            <td>............................................................</td>
                        </tr>
                        <tr>
                            <td className="py-1 align-top">Alamat Domisili</td>
                            <td className="align-top">:</td>
                            <td>............................................................<br/>............................................................</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    Orang tersebut di atas adalah benar-benar warga yang berdomisili di Desa Sumberanyar. Surat Pengantar ini diberikan kepada yang bersangkutan untuk keperluan:
                </p>
                
                <p className="font-bold underline text-center my-4 py-2">
                    {data.keterangan || "KEPERLUAN ADMINISTRASI UMUM / LAIN-LAIN"}
                </p>

                <p>
                    Demikian surat pengantar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
                </p>
            </div>
        </div>
    );
}
