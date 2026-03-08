# Bug Fix: Nominal Input BKU Transaksi

## Masalah yang Ditemukan

### Bug #1: Input nominal hanya menyimpan angka pertama sebelum titik
**Gejala:** User mengetik `22.000.000` tapi yang tersimpan di database adalah `22`

**Status:** ✅ FIXED

---

## Root Cause Analysis

### Flow Data yang Salah

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLOW INPUT NOMINAL (SEBELUM FIX)                     │
└─────────────────────────────────────────────────────────────────────────┘

1. USER INPUT
   User mengetik: "22.000.000" (dengan format ribuan)
   
2. FormInput Component (components/ui/form-input.tsx)
   ├─ cleanNumber("22.000.000") → "22000000" ✓ (hapus titik)
   ├─ formatThousand("22000000") → "22.000.000" (untuk display) ✓
   └─  value yang dikirim ke onChange: "22000000" ✓

3. React Hook Form
   ├─ setValueAs dipanggil: parseInt("22000000", 10) → 22000000 ✓
   └─ Data tersimpan di form state: 22000000 (number) ✓

4. Submit Handler (form.tsx)
   ├─ data.nominal = 22000000 (number) ✓
   └─ Submit ke backend: "22000000" ✓

5. Backend / Database
   └─ ❌ TERSIMPAN: 22 (SALAH!)

┌─────────────────────────────────────────────────────────────────────────┐
│                         MENGAPA BUG TERJADI?                            │
└─────────────────────────────────────────────────────────────────────────┘

MASALAH ADA DI formatThousand FUNCTION!

Kode lama di lib/number-utils.ts:
```typescript
export function formatThousand(value: number | string | undefined | null): string {
    if (value === undefined || value === null || value === "") return "";

    const parts = value.toString().split(".");  // ❌ BUG DI SINI!
    const residue = parts.length > 1 ? "." + parts[1] : "";
    const integerPart = parts[0];  // ❌ "22" jika input "22.000.000"

    const cleanInteger = integerPart.replace(/\D/g, "");  // ❌ "22"
    const number = parseInt(cleanInteger, 10);  // ❌ 22
    return number.toLocaleString("id-ID") + residue;  // ❌ "22"
}
```

**Penjelasan Bug:**

Ketika `formatThousand` menerima string `"22.000.000"` (dari user input atau re-render):
1. `value.toString()` → `"22.000.000"`
2. `.split(".")` → `["22", "000", "000"]` ← **MASALAH!**
3. `parts[0]` → `"22"` ← Hanya mengambil angka pertama!
4. `parseInt("22", 10)` → `22`
5. Return: `"22"` ← Ini yang ditampilkan dan akhirnya tersimpan!

**Kenapa bisa terjadi?**
- Function ini menggunakan `.split(".")` yang mengasumsikan titik adalah desimal
- Padahal format Indonesia menggunakan titik sebagai pemisah ribuan
- Akibatnya: `"22.000.000"` dianggap sebagai `"22"` dengan desimal `.000.000`

---

## Solusi yang Diterapkan

### Fix: formatThousand Function

**File:** `lib/number-utils.ts`

**Perubahan:**
```typescript
// SEBELUM (BUG):
export function formatThousand(value: number | string | undefined | null): string {
    const parts = value.toString().split(".");  // ❌ Split by dot!
    const residue = parts.length > 1 ? "." + parts[1] : "";
    const integerPart = parts[0];  // ❌ "22" from "22.000.000"
    const cleanInteger = integerPart.replace(/\D/g, "");
    const number = parseInt(cleanInteger, 10);
    return number.toLocaleString("id-ID") + residue;
}

// SESUDAH (FIX):
export function formatThousand(value: number | string | undefined | null): string {
    if (value === undefined || value === null || value === "") return "";

    // Convert to string
    const stringValue = value.toString();
    
    // CRITICAL FIX: Remove ALL dots first (Indonesian thousand separators)
    const withoutDots = stringValue.replace(/\./g, "");  // ✅ "22.000.000" → "22000000"
    
    // Remove any non-digit characters
    const cleanInteger = withoutDots.replace(/\D/g, "");  // ✅ "22000000"

    if (cleanInteger === "") return "";

    const number = parseInt(cleanInteger, 10);  // ✅ 22000000
    if (isNaN(number)) return "";

    return number.toLocaleString("id-ID");  // ✅ "22.000.000"
}
```

**Penjelasan:**
1. Hapus SEMUA titik dari input terlebih dahulu: `"22.000.000"` → `"22000000"`
2. Hapus karakter non-digit (untuk safety)
3. Parse ke integer: `"22000000"` → `22000000`
4. Format dengan locale Indonesia: `22000000` → `"22.000.000"`

### Fix Tambahan: FormInput Component

**File:** `components/ui/form-input.tsx`

**Perubahan:**
```typescript
// Kirim ke react-hook-form dengan parsing yang benar:
const syntheticEvent = {
    ...e,
    target: {
        ...e.target,
        value: cleaned === "" ? "" : parseInt(cleaned, 10).toString(),  // ✅Parsed!
        name: e.target.name
    }
};
```

### Fix Tambahan: BKU Transaction Form

**File:** `app/(admin)/panel/dashboard/bku/transaksi/form.tsx`

**Perubahan:**
```typescript
// Gunakan setValueAs untuk transform value:
{...register("nominal", {
    setValueAs: (value) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? 0 : num;
    }
})}
```

**Diterapkan di 2 field:**
1. Field `nominal` (line ~324)
2. Field `nominal_pajak` (line ~372)

---

## Flow Diagram Setelah Fix

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FLOW INPUT NOMINAL (SETELAH FIX)                    │
└─────────────────────────────────────────────────────────────────────────┘

1. USER INPUT
   User mengetik: "22.000.000"
   
2. FormInput Component
   ├─ cleanNumber("22.000.000") → "22000000" ✓
   ├─ formatThousand("22000000") → "22.000.000" (display) ✓
   └─ ✅ parseInt("22000000", 10).toString() → "22000000" (untuk RHF)

3. React Hook Form
   ├─ setValueAs("22000000") → 22000000 ✓
   └─ Data tersimpan di form state: 22000000 (number) ✓

4. Submit Handler
   ├─ data.nominal = 22000000 (number) ✓
   └─ Submit ke backend: "22000000" ✓

5. Backend / Database
   └─ ✅ Tersimpan: 22000000 (BENAR!)

6. Display di Tabel Log Transaksi
   ├─ Fetch dari database: 22000000 ✓
   ├─ formatThousand(22000000) → "22.000.000" ✓
   └─ Display: "Rp 22.000.000" ✓
```

---

## Testing

### Test Case 1: Input Nominal Dasar
```
Input: 10000
Display: 10.000
Expected: 10000 tersimpan di database
Actual: ✅ PASS
```

### Test Case 2: Input dengan Ribuan
```
Input: 10.000 (display format)
Raw value: 10000
Expected: 10000 tersimpan di database
Actual: ✅ PASS
```

### Test Case 3: Input dengan Jutaan (CRITICAL TEST)
```
Input: 22.000.000
Display: 22.000.000
Raw value: 22000000
Expected: 22000000 tersimpan di database
Actual: ✅ PASS (PREVIOUSLY: 22 ❌)
```

### Test Case 4: Input dengan Puluhan Juta
```
Input: 123.456.789
Display: 123.456.789
Raw value: 123456789
Expected: 123456789 tersimpan di database
Actual: ✅ PASS
```

### Test Case 5: Input Nol/Kosong
```
Input: "" atau "0"
Expected: 0 tersimpan di database
Actual: ✅ PASS (fallback ke 0)
```

---

## File yang Diubah

1. **`lib/number-utils.ts`** - Fix `formatThousand` function untuk handle Indonesian format dengan benar (CRITICAL!)
2. **`components/ui/form-input.tsx`** - Fix handleChange untuk numeric input
3. **`app/(admin)/panel/dashboard/bku/transaksi/form.tsx`** - Fix register dengan setValueAs

---

## Build Status

```bash
pnpm run build
```

✅ **Compiled successfully** - No errors

---

## Catatan Penting untuk Developer

### Jika ada masalah serupa di masa depan:

1. **Cek formatThousand function** - Pastikan TIDAK menggunakan `.split(".")` karena format Indonesia menggunakan titik sebagai pemisah ribuan
2. **Cek FormInput component** - Pastikan `numeric` prop mengirim value yang benar
3. **Gunakan `setValueAs`** - Jangan gunakan `valueAsNumber` dengan custom `onChange`
4. **Test dengan console.log** - Tambahkan debug log di `onSubmit` untuk melihat actual value
5. **Cek database schema** - Pastikan field type di PocketBase adalah `number`

### Best Practices:

```typescript
// ✅ BENAR: Format thousand untuk Indonesia
export function formatThousand(value: number | string | undefined | null): string {
    if (!value && value !== 0) return "";
    
    // Hapus semua titik dulu (pemisah ribuan Indonesia)
    const withoutDots = value.toString().replace(/\./g, "");
    const cleanInteger = withoutDots.replace(/\D/g, "");
    
    const number = parseInt(cleanInteger, 10);
    if (isNaN(number)) return "";
    
    return number.toLocaleString("id-ID");
}

// ✅ BENAR: Untuk numeric input dengan FormInput
{...register("fieldName", {
    setValueAs: (value) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? 0 : num;
    }
})}

// ❌ SALAH: valueAsNumber tidak bekerja dengan custom onChange
{...register("fieldName", { valueAsNumber: true })}

// ❌ SALAH: Split by dot (asumsi desimal US)
const parts = value.toString().split("."); // Format Indonesia bukan desimal!
```

---

## Referensi

- [React Hook Form Documentation - setValueAs](https://react-hook-form.com/docs/useform/register#valuesas)
- [FormInput Component Source](../../../components/ui/form-input.tsx)
- [BKU Transaction Form Source](../../../app/(admin)/panel/dashboard/bku/transaksi/form.tsx)
