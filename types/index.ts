export interface MetaConfig {
    id: string;
    site_name: string;
    address: string;
    phone: string;
    whatsapp_number: string;
    nib_number: string;
    social_links: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
    };
}

export interface HeroBanner {
    id: string;
    title: string;
    image: string; // Filename
    cta_link: string;
    active: boolean;
    order: number;
}

export interface News {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail: string;
    category: string;
    published: boolean;
    created: string; // ISO Date
}

export interface ApbdesRealisasi {
    id: string;
    tahun_anggaran: number;
    kategori: 'Pendapatan' | 'Belanja' | 'Pembiayaan';
    nama_bidang: string;
    anggaran: number;
    realisasi: number;
    created: string;
    updated: string;
}

export interface PermohonanSuratOnline {
    id: string;
    nik: string;
    nama: string;
    jenis_surat: string;
    alamat_rantau?: string;
    no_wa: string;
    bukti_syarat?: string;
    status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditolak';
    created: string;
    updated: string;
}

export interface LayananDesa {
    id: string;
    nama_layanan: string;
    deskripsi: string;
    konten?: string;
    icon?: string;
    tipe: 'panduan' | 'lapor' | 'bansos' | 'link_eksternal' | 'halaman_statis';
    aksi_url?: string;
    is_active?: boolean;
    urutan?: number;
    created: string;
    updated: string;
}

export interface PengaduanWarga {
    id: string;
    nama_pelapor: string;
    tempat_tinggal: string;
    isi_laporan: string;
    status: 'Baru' | 'Diproses' | 'Selesai';
    created: string;
    updated: string;
}

export interface MutasiPenduduk {
    id: string;
    nik?: string;
    nama_lengkap: string;
    jenis_mutasi: 'Lahir' | 'Mati' | 'Datang' | 'Pergi';
    tanggal_mutasi: string;
    keterangan?: string;
    dokumen_bukti?: string;
    created: string;
    updated: string;
}

export interface SuratKeluar {
    id: string;
    nomor_agenda: string;
    nik_pemohon: string;
    nama_pemohon: string;
    jenis_surat: 'Pengantar' | 'SKTM' | 'Domisili' | 'Keterangan Usaha' | 'Lainnya';
    tanggal_dibuat: string;
    keterangan?: string;
    file_pdf?: string;
    created: string;
    updated: string;
}

export interface RekeningKas {
    id: string;
    nama_rekening: string;
    jenis: 'Tunai' | 'Bank';
    created: string;
    updated: string;
}

export interface BkuTransaksi {
    id: string;
    tipe_transaksi: 'Masuk' | 'Keluar' | 'Pindah Buku';
    tanggal: string;
    rekening_sumber_id?: string;
    rekening_tujuan_id?: string;
    nominal: number;
    uraian: string;
    bukti_file?: string;
    created: string;
    updated: string;
    expand?: {
        rekening_sumber_id?: RekeningKas;
        rekening_tujuan_id?: RekeningKas;
    };
}

export interface PajakLog {
    id: string;
    bku_id: string;
    jenis_pajak: string;
    nominal_pajak: number;
    status: 'Belum Disetor' | 'Sudah Disetor';
    ntpn?: string;
    bukti_setor?: string;
    created: string;
    updated: string;
    expand?: {
        bku_id?: BkuTransaksi;
    };
}

export interface InventarisDesa {
    id: string;
    nama_barang: string;
    kategori: 'Bangunan' | 'Kendaraan' | 'Elektronik' | 'Mebel' | 'Lainnya';
    tahun_perolehan: number;
    kuantitas: number;
    kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Dihapus/Lelang';
    created: string;
    updated: string;
}

export interface PenerimaBansos {
    id: string;
    nama: string;
    nik: string;
    jenis_bantuan: string;
    tahun_penerimaan: number;
    created: string;
    updated: string;
    expand?: {
        jenis_bantuan?: {
            id: string;
            nama: string;
        };
    };
}
