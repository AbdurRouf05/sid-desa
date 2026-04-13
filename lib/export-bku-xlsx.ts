"use client";

import * as XLSX from "xlsx";
import { BkuTransaksi, PajakLog } from "@/types";

const MONTH_NAMES = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface ExportBkuParams {
    transactions: BkuTransaksi[];
    pajakData: PajakLog[];
    bulan: string;  // "01"-"12"
    tahun: string;  // "2026"
}

export function exportBkuToXlsx({ transactions, pajakData, bulan, tahun }: ExportBkuParams) {
    const isAllMonth = bulan === "Semua";
    const isAllYear = tahun === "Semua";
    const monthName = isAllMonth ? "Semua Bulan" : MONTH_NAMES[parseInt(bulan)];
    const yearName = isAllYear ? "Semua Tahun" : tahun;
    const period = `${monthName} ${yearName}`;

    // Filter transactions by the selected period
    const filtered = transactions.filter(item => {
        const d = new Date(item.tanggal);
        const matchesMonth = isAllMonth || String(d.getMonth() + 1).padStart(2, '0') === bulan;
        const matchesYear = isAllYear || String(d.getFullYear()) === tahun;
        return matchesMonth && matchesYear;
    });

    if (filtered.length === 0) {
        alert("Tidak ada transaksi pada periode ini untuk diekspor.");
        return;
    }

    // Filter pajak by the same period (via expand bku_id date)
    const filteredPajak = pajakData.filter(p => {
        const bkuDate = p.expand?.bku_id?.tanggal;
        if (!bkuDate) return false;
        const d = new Date(bkuDate);
        const matchesMonth = isAllMonth || String(d.getMonth() + 1).padStart(2, '0') === bulan;
        const matchesYear = isAllYear || String(d.getFullYear()) === tahun;
        return matchesMonth && matchesYear;
    });

    // Calculate previous months' running balance as "Kas Awal"
    // If "All Time" selected, Kas Awal is 0
    let kasAwal = 0;
    if (!isAllMonth || !isAllYear) {
        const startDate = (isAllMonth && !isAllYear) 
            ? new Date(parseInt(tahun), 0, 1) 
            : (!isAllMonth && !isAllYear) 
                ? new Date(parseInt(tahun), parseInt(bulan) - 1, 1)
                : null;

        if (startDate) {
            const allBefore = transactions.filter(item => new Date(item.tanggal) < startDate);
            allBefore.forEach(item => {
                if (item.tipe_transaksi === "Masuk") kasAwal += item.nominal;
                else if (item.tipe_transaksi === "Keluar") kasAwal -= item.nominal;
            });
        }
    }


    // Sort filtered by date
    const sorted = [...filtered].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    // Build sheet data
    const rows: any[][] = [];

    // Header rows
    rows.push(["BUKU KAS UMUM (BKU) - DESA SUMBERANYAR"]);
    rows.push([`Periode: ${period}`]);
    rows.push([]);

    // Table header
    rows.push([
        "No.", "Tanggal", "Uraian", "Tipe",
        "Rekening Sumber", "Rekening Tujuan",
        "Penerimaan (Rp)", "Pengeluaran (Rp)", "Saldo Berjalan (Rp)"
    ]);

    // Kas Awal row
    rows.push(["", "", "SALDO AWAL BULAN", "", "", "", "", "", kasAwal]);

    let saldo = kasAwal;
    let totalMasuk = 0;
    let totalKeluar = 0;

    sorted.forEach((item, idx) => {
        const dateStr = new Date(item.tanggal).toLocaleDateString('id-ID', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });

        const rekSumber = item.expand?.rekening_sumber_id?.nama_rekening || "-";
        const rekTujuan = item.expand?.rekening_tujuan_id?.nama_rekening || "-";

        let penerimaan: number | string = "";
        let pengeluaran: number | string = "";

        if (item.tipe_transaksi === "Masuk") {
            penerimaan = item.nominal;
            totalMasuk += item.nominal;
            saldo += item.nominal;
        } else if (item.tipe_transaksi === "Keluar") {
            pengeluaran = item.nominal;
            totalKeluar += item.nominal;
            saldo -= item.nominal;
        } else if (item.tipe_transaksi === "Pindah Buku") {
            // Display as internal movement, net-zero on saldo
            penerimaan = item.nominal;
            pengeluaran = item.nominal;
        }

        rows.push([
            idx + 1,
            dateStr,
            item.uraian,
            item.tipe_transaksi,
            rekSumber,
            rekTujuan,
            penerimaan,
            pengeluaran,
            saldo
        ]);
    });

    // Totals
    rows.push([]);
    rows.push(["", "", "TOTAL MUTASI BULAN INI", "", "", "", totalMasuk, totalKeluar, ""]);
    rows.push(["", "", "SALDO AKHIR BULAN", "", "", "", "", "", saldo]);

    // Pajak section
    if (filteredPajak.length > 0) {
        rows.push([]);
        rows.push(["REKAP PAJAK BULAN INI"]);
        rows.push(["No.", "Uraian BKU Asal", "Jenis Pajak", "Nominal Pajak (Rp)", "Status", "NTPN"]);

        let totalPajakBelum = 0;
        let totalPajakSudah = 0;

        filteredPajak.forEach((p, idx) => {
            const uraianBku = p.expand?.bku_id?.uraian || "-";
            rows.push([
                idx + 1,
                uraianBku,
                p.jenis_pajak,
                p.nominal_pajak,
                p.status,
                p.ntpn || "-"
            ]);
            if (p.status === "Sudah Disetor") totalPajakSudah += p.nominal_pajak;
            else totalPajakBelum += p.nominal_pajak;
        });

        rows.push([]);
        rows.push(["", "", "Total Pajak Sudah Disetor", totalPajakSudah, "", ""]);
        rows.push(["", "", "Total Pajak Belum Disetor", totalPajakBelum, "", ""]);
    }

    // Summary
    rows.push([]);
    rows.push(["RINGKASAN ARUS KAS"]);
    rows.push(["Kas Awal Bulan", kasAwal]);
    rows.push(["(+) Total Penerimaan", totalMasuk]);
    rows.push(["(-) Total Pengeluaran", totalKeluar]);
    rows.push(["(=) Saldo Akhir Bulan", saldo]);

    // Create workbook
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Column widths
    ws["!cols"] = [
        { wch: 5 },   // No
        { wch: 14 },  // Tanggal
        { wch: 40 },  // Uraian
        { wch: 14 },  // Tipe
        { wch: 18 },  // Rek Sumber
        { wch: 18 },  // Rek Tujuan
        { wch: 18 },  // Penerimaan
        { wch: 18 },  // Pengeluaran
        { wch: 20 },  // Saldo
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `BKU ${monthName} ${tahun}`);

    XLSX.writeFile(wb, `BKU_${monthName}_${tahun}.xlsx`);
}
