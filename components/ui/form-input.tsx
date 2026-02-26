"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatThousand, cleanNumber } from "@/lib/number-utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    currencyPrefix?: string;
    numeric?: boolean;
    error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ className, label, icon, currencyPrefix, numeric, error, value, onChange, ...props }, ref) => {

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (numeric) {
                // Get the raw input
                const rawInput = e.target.value;

                // Clean it to get just numbers
                const cleaned = cleanNumber(rawInput);

                // Special handling for "0" and leading zeros logic
                // If the cleaned string is "05", we want "5". 
                // We use parseInt to strip leading zeros, unless it IS just "0" and we want to allow typing? 
                // User said: "saat diketik di depan angka nol maka akan otomatis tampil normal tanpa nol di depannya"
                // E.g. [0] -> type 5 at front -> [50]. Correct.
                // E.g. [0] -> type 5 at back -> [05] -> should be [5].

                let finalValue = cleaned;
                if (cleaned.length > 1 && cleaned.startsWith("0")) {
                    finalValue = parseInt(cleaned, 10).toString();
                } else if (cleaned === "0" && rawInput.length > 1) {
                    // If user typed something to make "0" become "05" or "50"?
                    // Wait, cleanNumber("05") is "05".
                    // The logic above `parseInt` handles "05" -> "5".
                }

                // Create a synthetic event with the cleaned value to send to parent
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: finalValue,
                        name: e.target.name // preserve name
                    }
                };

                onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            } else {
                onChange?.(e);
            }
        };

        // Determine display value
        // If numeric, we format the incoming value (which should be raw from parent state)
        // If the user is typing "1000", parent state gets "1000", we display "1.000".
        const displayValue = numeric ? formatThousand(value as string | number) : value;

        return (
            <label className="block space-y-1.5">
                {label && <span className="text-gray-700 font-medium block">{label}</span>}
                <div className="relative">
                    {(icon || currencyPrefix) && (
                        <span className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            currencyPrefix ? "text-primary font-bold" : "text-gray-400"
                        )}>
                            {currencyPrefix || icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        value={displayValue}
                        onChange={handleChange}
                        className={cn(
                            "block w-full py-3 rounded-lg border-gray-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                            (icon || currencyPrefix) ? "pl-10" : "px-3",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{error}</span>}
            </label>
        );
    }
);
FormInput.displayName = "FormInput";
