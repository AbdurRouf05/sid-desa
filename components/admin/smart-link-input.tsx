
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
    { value: "/", label: "Halaman Utama (Home)" },
    { value: "/tentang-kami", label: "Tentang Kami (Profil)" },
    { value: "/layanan", label: "Layanan & Produk" },
    { value: "/berita", label: "Berita & Artikel" },
    { value: "/kontak", label: "Hubungi Kami (Kontak)" },
    { value: "/galeri", label: "Galeri Foto/Video" },
    { value: "/karir", label: "Karir / Lowongan" },
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
        // Fetch dynamic content for suggestions (News & Products)
        const fetchDynamicLinks = async () => {
            setLoading(true);
            try {
                // Fetch recent news
                const newsResult = await pb.collection('news').getList(1, 5, {
                    sort: '-created',
                    filter: 'published = true'
                });

                const newsLinks = newsResult.items.map((item: any) => ({
                    value: `/berita/${item.slug}`,
                    label: `Berita: ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}`
                }));

                setNews(newsLinks);
            } catch (e) {
                console.error("Failed to fetch dynamic links", e);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchDynamicLinks();
        }
    }, [open]);

    // Check if current value matches a known option label
    const combinedOptions = [...STATIC_ROUTES, ...news];
    const selectedLabel = combinedOptions.find((opt) => opt.value === value)?.label || value;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal text-left h-auto min-h-[42px] px-3 py-2"
                >
                    <span className="truncate">
                        {value ? selectedLabel : "Pilih atau ketik link..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari halaman atau berita..." />
                    <CommandList>
                        <CommandEmpty>Link tidak ditemukan.</CommandEmpty>
                        <CommandGroup heading="Halaman Statis">
                            {STATIC_ROUTES.map((route) => (
                                <CommandItem
                                    key={route.value}
                                    value={route.label} // Search by label
                                    onSelect={() => {
                                        onChange(route.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === route.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {route.label}
                                    <span className="ml-auto text-xs text-slate-400 font-mono">{route.value}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Berita Terbaru">
                            {loading && <CommandItem disabled>Loading...</CommandItem>}
                            {news.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
