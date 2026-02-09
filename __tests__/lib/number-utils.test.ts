import { formatRupiah, formatThousand, cleanNumber } from '@/lib/number-utils';

describe('Number Utils', () => {
    describe('formatRupiah', () => {
        it('formats number correctly', () => {
            expect(formatRupiah(10000)).toBe('Rp 10.000');
            expect(formatRupiah(0)).toBe('Rp 0');
        });

        it('handles string input', () => {
            expect(formatRupiah("50000")).toBe('Rp 50.000');
        });

        it('returns empty string for invalid input', () => {
            expect(formatRupiah("abc")).toBe("");
            // TypeScript protects us from null usually, but for coverage/JS usage:
            expect(formatRupiah(NaN)).toBe("");
        });
    });

    describe('cleanNumber', () => {
        it('removes non-digits', () => {
            expect(cleanNumber("Rp 10.000")).toBe("10000");
            expect(cleanNumber("10.000,00")).toBe("1000000"); // Based on implementation provided
        });
    });
});
