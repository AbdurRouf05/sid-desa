"use client";

import React, { useState, useEffect } from "react";
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
    ({ className, label, icon, currencyPrefix, numeric, error, value, defaultValue, onChange, ...props }, ref) => {

        const [localValue, setLocalValue] = useState<string>(() => {
            if (value !== undefined) return numeric ? formatThousand(value as string | number) : String(value);
            if (defaultValue !== undefined) return numeric ? formatThousand(defaultValue as string | number) : String(defaultValue);
            return "";
        });

        useEffect(() => {
            if (value !== undefined) {
                setLocalValue(numeric ? formatThousand(value as string | number) : String(value));
            }
        }, [value, numeric]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (numeric) {
                const rawInput = e.target.value;
                const cleaned = cleanNumber(rawInput);

                let finalValue = cleaned;
                if (cleaned.length > 1 && cleaned.startsWith("0")) {
                    finalValue = parseInt(cleaned, 10).toString();
                }

                setLocalValue(formatThousand(finalValue));

                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: finalValue,
                        name: e.target.name
                    }
                };

                onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            } else {
                setLocalValue(e.target.value);
                onChange?.(e);
            }
        };

        const displayValue = value !== undefined ? (numeric ? formatThousand(value as string | number) : value) : localValue;

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
