
"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { pb } from "@/lib/pb";

// Common predefined routes
const STATIC_ROUTES = [
    { value: "/", label: "Beranda" },
    { value: "/tentang-kami", label: "Tentang Desa" },
    { value: "/layanan", label: "Layanan Desa" },
    { value: "/berita", label: "Berita & Pengumuman" },
    { value: "/kontak", label: "Kontak & Lokasi" },
    { value: "/transparansi", label: "Transparansi APBDes" },
    { value: "/pengaduan", label: "Pengaduan Warga" },
    { value: "#", label: "Link Kosong (#)" },
];

interface SmartLinkInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function SmartLinkInput({ value, onChange }: SmartLinkInputProps) {
    const [open, setOpen] = useState(false);
    const [news, setNews] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchDynamicLinks = async () => {
            setLoading(true);
            try {
                const newsResult = await pb.collection('news').getList(1, 10, {
                    sort: '-created',
                    filter: 'published = true',
                    fields: 'id,title,slug'
                });

                const newsLinks = newsResult.items.map((item: any) => ({
                    value: `/berita/${item.slug}`,
                    label: item.title
                }));
                setNews(newsLinks);
            } catch (e) {
                console.error("Failed to fetch dynamic links", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDynamicLinks();
    }, [open]);

    // Check if current value matches a known option label
    const combinedOptions = [...STATIC_ROUTES, ...news];
    const selectedItem = combinedOptions.find((opt) => opt.value === value);
    const selectedLabel = selectedItem ? selectedItem.label : value;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal text-left h-auto min-h-[42px] px-3 py-2"
                >
                    <span className="truncate block max-w-[90%]">
                        {value ? (
                            <span className="flex flex-col text-left">
                                <span className="font-medium text-slate-900 truncate">
                                    {selectedLabel === value ? "Custom Link" : selectedLabel}
                                </span>
                                <span className="text-xs text-slate-500 font-mono truncate">{value}</span>
                            </span>
                        ) : (
                            <span className="text-slate-400">Pilih atau ketik link tujuan...</span>
                        )}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari halaman atau berita..." />
                    <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty>Link tidak ditemukan.</CommandEmpty>

                        <CommandGroup heading="Halaman Utama">
                            {STATIC_ROUTES.map((route) => (
                                <CommandItem
                                    key={route.value}
                                    value={route.label + " " + route.value}
                                    onSelect={() => {
                                        onChange(route.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === route.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                        <span>{route.label}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{route.value}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>



                        <CommandGroup heading="Berita Terbaru">
                            {news.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                        <span>{item.label}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{item.value}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
