/**
 * Formats a number or string into a standard Indonesian currency format (dots as thousands separator).
 * Example: 10000 -> "10.000"
 */
export function formatThousand(value: number | string | undefined | null): string {
    if (value === undefined || value === null || value === "") return "";

    // Convert to string and split decimal if needed (though usually for simple IDR input we might restrict to integers)
    const parts = value.toString().split(".");
    const residue = parts.length > 1 ? "." + parts[1] : "";
    const integerPart = parts[0];

    // Remove non-digit characters to be safe
    const cleanInteger = integerPart.replace(/\D/g, "");

    // If empty or zero-like issues tailored by specific requirements, handle here.
    // Standard Intl implementation:
    // return new Intl.NumberFormat("id-ID").format(Number(cleanInteger)); 

    // Manual implementation for strict control over "user friendly" typing (e.g. handling "0" vs "")
    if (cleanInteger === "") return "";

    // Logic: Leading zero removal is handled by parsing, but if we format "05", parseInt handles it.
    const number = parseInt(cleanInteger, 10);
    if (isNaN(number)) return "";

    return number.toLocaleString("id-ID") + residue;
}

/**
 * Cleans a formatted string back to a raw numeric string.
 * Example: "10.000" -> "10000"
 */
export function cleanNumber(value: string): string {
    // Remove all non-numeric characters (except dot if we want decimals? Usually IDR uses comma for decimal).
    // Assuming strict integer IDR for now based on user "ribuan" context, or basic float.
    // For standard "number" input, usually we want just digits.
    return value.replace(/\./g, "").replace(/[^0-9]/g, "");
}

/**
 * Formats a number into Rupiah currency string.
 * Example: 10000 -> "Rp 10.000"
 */
export function formatRupiah(value: number | string): string {
    if (!value && value !== 0) return "";
    const num = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(num)) return "";
    return "Rp " + formatThousand(num);
}

/**
 * Formats a date string into an Indonesian date format with fail-safe measures.
 * Example: "2024-02-09" -> "9 Februari 2024"
 */
export function formatDate(
    dateStr: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
    // 1. Critical Fallback
    if (!dateStr || dateStr === "" || dateStr === "undefined" || dateStr === "null") {
        return "Baru Saja";
    }

    try {
        let date: Date;

        // 2. Handle Date Object directly
        if (dateStr instanceof Date) {
            date = dateStr;
        } else {
            // 3. String Parsing with normalization
            const s = String(dateStr).trim();

            // Try ISO format with T replacement
            date = new Date(s.replace(' ', 'T'));

            // 4. Manual Regex Fallback if standard parsing fails
            if (isNaN(date.getTime())) {
                const m = s.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
                if (m) {
                    date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
                }
            }
        }

        // 5. Final check for valid date object
        if (!date || isNaN(date.getTime())) {
            // LAST RESORT: String Manipulation without Date Object
            // If we have "2024-02-09", just format it manually
            const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) {
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                const year = m[1];
                const monthIdx = parseInt(m[2]) - 1;
                const day = parseInt(m[3]);

                if (months[monthIdx]) {
                    return `${day} ${months[monthIdx]} ${year}`;
                }
            }
            return "Baru Saja";
        }

        // 6. Formatting with Locale Fallback
        try {
            // Attempt standard locale formatting
            return date.toLocaleDateString("id-ID", options);
        } catch (localeErr) {
            // Manual fallbacks for environments without id-ID locale support (e.g. some server runtimes)
            const d = date.getDate();
            const y = date.getFullYear();

            // Determine format based on options
            const isShort = options.month === 'short';
            const months = isShort
                ? ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
                : ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            const m = months[date.getMonth()];

            // Include time if options suggest it (H/M/S)
            if (options.hour || options.minute) {
                const hrs = String(date.getHours()).padStart(2, '0');
                const min = String(date.getMinutes()).padStart(2, '0');
                return `${d} ${m} ${y}, ${hrs}:${min}`;
            }

            return `${d} ${m} ${y}`;
        }
    } catch (e) {
        console.error("formatDate catastrophic failure:", e);
        return "Baru Saja";
    }
}
