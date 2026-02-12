"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_LIST = [
    "MapPin", "Clock", "Phone", "Mail", "Globe",
    "Building", "Home", "User", "Users", "Shield",
    "Star", "Heart", "CheckCircle", "AlertCircle",
    "Info", "Calendar", "ArrowRight", "Target",
    "Briefcase", "DollarSign", "CreditCard", "Wallet"
];

interface IconPickerProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = ICON_LIST.filter(iconName =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={cn("border rounded-xl p-3 bg-white", className)}>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search icon..."
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {filteredIcons.map((iconName) => {
                    const Icon = (LucideIcons as any)[iconName];
                    const isSelected = value === iconName;

                    if (!Icon) return null;

                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => onChange(iconName)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:scale-105 active:scale-95 aspect-square",
                                isSelected
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                    : "bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                            title={iconName}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-[9px] truncate w-full text-center opacity-80">{iconName}</span>
                        </button>
                    );
                })}
            </div>
            {filteredIcons.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-4">
                    No icons found
                </div>
            )}

            {value && (
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-slate-500">
                    <span>Selected:</span>
                    <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">{value}</span>
                </div>
            )}
        </div>
    );
}
