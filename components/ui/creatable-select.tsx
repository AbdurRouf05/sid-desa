"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Option {
    id: string;
    nama: string;
}

interface CreatableSelectProps {
    options: Option[];
    value?: string;
    onChange: (id: string) => void;
    onCreate: (name: string) => Promise<void>;
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
}

export function CreatableSelect({
    options,
    value,
    onChange,
    onCreate,
    placeholder = "Pilih opsi...",
    isLoading = false,
    className
}: CreatableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedOption = React.useMemo(() => 
        options.find((opt) => opt.id === value),
        [options, value]
    );

    const filteredOptions = React.useMemo(() => {
        if (!search) return options;
        return options.filter((opt) => 
            opt.nama.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const exactMatch = React.useMemo(() => 
        options.some((opt) => opt.nama.toLowerCase() === search.toLowerCase().trim()),
        [options, search]
    );

    const handleCreate = async () => {
        if (!search.trim() || isLoading) return;
        try {
            await onCreate(search.trim());
            setSearch(""); // Reset search after creation
        } catch (error) {
            console.error("Failed to create option:", error);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex h-12 w-full items-center justify-between rounded-xl border bg-slate-50/50 px-5 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
                        !value && "text-slate-400",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.nama : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl overflow-hidden border-slate-100 shadow-2xl" align="start">
                <div className="flex flex-col">
                    {/* Search Input */}
                    <div className="flex items-center border-b px-4 bg-slate-50/50">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                        <input
                            placeholder="Cari atau tambah baru..."
                            className="flex h-12 w-full bg-transparent py-3 text-sm font-bold outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors",
                                        value === option.id 
                                            ? "bg-emerald-50 text-emerald-700" 
                                            : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mr-3 h-4 w-4",
                                            value === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.nama}
                                </button>
                            ))
                        ) : (
                            <div className="py-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                                Tidak ditemukan
                            </div>
                        )}
                    </div>

                    {/* Creatable Action */}
                    {search.trim() && !exactMatch && (
                        <div className="p-2 border-t bg-slate-50/50">
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={isLoading}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-emerald-600 hover:bg-emerald-100 transition-all uppercase tracking-wider group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                                )}
                                Tambah "{search}"
                            </button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
