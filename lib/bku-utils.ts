import { pb } from "./pb";
import { BkuTransaksi } from "@/types";

/**
 * Menghitung saldo berjalan (running balance) dari sebuah dompet/rekening Kas Desa.
 * 
 * Aturan Agrerasi:
 * 1. Jika rekening tujuan adalah ID ini & Transaksi Masuk -> Saldo Bertambah
 * 2. Jika rekening tujuan adalah ID ini & Transaksi Pindah Buku -> Saldo Bertambah
 * 3. Jika rekening sumber adalah ID ini & Transaksi Keluar -> Saldo Berkurang
 * 4. Jika rekening sumber adalah ID ini & Transaksi Pindah Buku -> Saldo Berkurang
 */
export async function getSaldoRekening(rekeningId: string): Promise<number> {
    if (!rekeningId) return 0;

    try {
        // Fetch all transactions that either enter or leave this rekening.
        // Since PocketBase allows OR filters:
        const filter = `rekening_sumber_id="${rekeningId}" || rekening_tujuan_id="${rekeningId}"`;
        
        // We use getFullList because we need all historical transactions to calculate balance
        const records = await pb.collection("bku_transaksi").getFullList<BkuTransaksi>({
            filter: filter,
            // Optimization: we don't need sorting or expands, just nominals and types
            fields: "tipe_transaksi,nominal,rekening_sumber_id,rekening_tujuan_id"
        });

        let saldo = 0;

        for (const trx of records) {
            // Arus Masuk
            if (
                (trx.tipe_transaksi === "Masuk" && trx.rekening_tujuan_id === rekeningId) ||
                (trx.tipe_transaksi === "Pindah Buku" && trx.rekening_tujuan_id === rekeningId)
            ) {
                saldo += trx.nominal;
            }

            // Arus Keluar
            if (
                (trx.tipe_transaksi === "Keluar" && trx.rekening_sumber_id === rekeningId) ||
                (trx.tipe_transaksi === "Pindah Buku" && trx.rekening_sumber_id === rekeningId)
            ) {
                saldo -= trx.nominal;
            }
        }

        return saldo;

    } catch (e) {
        console.error("Gagal menghitung saldo berjalan:", e);
        return 0;
    }
}
