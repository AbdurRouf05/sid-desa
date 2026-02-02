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
