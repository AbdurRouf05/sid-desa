"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatThousand, cleanNumber } from "@/lib/number-utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    currencyPrefix?: string;
    numeric?: boolean;
    error?: string;
    onNumericChange?: (value: string) => void; // Callback for numeric values
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ className, label, icon, currencyPrefix, numeric, error, value, defaultValue, onChange, onNumericChange, ...props }, ref) => {

        // Use ref to track raw numeric value for controlled inputs
        const rawValueRef = useRef<string>("");
        
        const [localValue, setLocalValue] = useState<string>(() => {
            if (value !== undefined) {
                if (numeric) {
                    // If value is already a number, format it
                    const numVal = typeof value === 'number' ? value : parseInt(String(value), 10);
                    rawValueRef.current = String(numVal);
                    return formatThousand(numVal);
                }
                return String(value);
            }
            if (defaultValue !== undefined) {
                if (numeric) {
                    const numVal = typeof defaultValue === 'number' ? defaultValue : parseInt(String(defaultValue), 10);
                    rawValueRef.current = String(numVal);
                    return formatThousand(numVal);
                }
                return String(defaultValue);
            }
            return "";
        });

        useEffect(() => {
            if (value !== undefined) {
                if (numeric) {
                    const numVal = typeof value === 'number' ? value : parseInt(String(value), 10);
                    if (!isNaN(numVal)) {
                        rawValueRef.current = String(numVal);
                        setLocalValue(formatThousand(numVal));
                    }
                } else {
                    setLocalValue(String(value));
                }
            }
        }, [value, numeric]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (numeric) {
                const rawInput = e.target.value;
                
                // Get current raw value from ref, not from state
                const currentRaw = rawValueRef.current;
                
                // If input is empty, reset
                if (rawInput === "") {
                    rawValueRef.current = "";
                    setLocalValue("");
                    
                    // Call custom callback if provided (for setValue)
                    onNumericChange?.("");
                    
                    const syntheticEvent = {
                        ...e,
                        target: { ...e.target, value: "", name: e.target.name }
                    };
                    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
                    return;
                }
                
                // Clean the input (remove dots and non-digits)
                const cleaned = cleanNumber(rawInput);
                
                // Update raw value ref
                rawValueRef.current = cleaned;
                
                // Format for display
                const formatted = formatThousand(cleaned);
                setLocalValue(formatted);
                
                // Call custom callback if provided (for setValue)
                onNumericChange?.(cleaned);
                
                // Send raw numeric string to react-hook-form
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: cleaned,
                        name: e.target.name
                    }
                };
                onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            } else {
                setLocalValue(e.target.value);
                onChange?.(e);
            }
        };

        const displayValue = value !== undefined 
            ? (numeric ? formatThousand(typeof value === 'number' ? value : parseInt(String(value), 10)) : value) 
            : localValue;

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
