import { SuratKeluar } from "@/types";

export function TemplateSKTM({ data }: { data: SuratKeluar }) {
    return (
        <div className="w-full font-serif flex-1 flex flex-col items-center">
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase underline tracking-wider mb-1">
                    Surat Keterangan Tidak Mampu
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
                            <td className="py-1">NIK</td>
                            <td>:</td>
                            <td>{data.nik_pemohon}</td>
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
                    Berdasarkan pendataan dari petugas dan Ketua RT/RW setempat, orang tersebut di atas adalah warga Desa Sumberanyar yang keadaan keadaan ekonomi rumah tangganya termasuk dalam <strong>Keluarga Kurang / Tidak Mampu (Pra-Sejahtera)</strong>.
                </p>

                <p>
                    Surat Keterangan Tidak Mampu (SKTM) ini diberikan untuk dipergunakan sebagai persyaratan:
                </p>
                
                <p className="font-bold italic text-center my-4">
                    "{data.keterangan || "Pengajuan Pembebasan Biaya Perawatan / Keringanan Biaya Pendidikan / Beasiswa"}"
                </p>

                <p>
                    Demikian surat keterangan ini kami buat dengan mengingat sumpah jabatan dan untuk dapat dipergunakan seperlunya oleh instansi yang berwenang.
                </p>
            </div>
        </div>
    );
}
