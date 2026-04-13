"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";
import {
    LayoutDashboard,
    MessageSquare,
    Newspaper,
    Image as ImageIcon,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    MapPin,
    FolderOpen,
    Users,
    FileText,
    PieChart,
    Wallet,
    Share2,
    Receipt,
    BarChart3,
    Map,
    Package
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_GROUPS = [
    {
        label: "Utama",
        items: [
            { href: "/panel/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
        ]
    },
    {
        label: "Layanan, Bantuan & Pengaduan",
        items: [
            { href: "/panel/dashboard/layanan", icon: LayoutDashboard, label: "Informasi & Syarat Layanan" },
            { href: "/panel/dashboard/inquiries", icon: MessageSquare, label: "Pengaduan Warga" },
            { href: "/panel/dashboard/surat/pintar", icon: FileText, label: "Buat Surat Pintar" },
            { href: "/panel/dashboard/surat", icon: FileText, label: "Agenda Surat Keluar", exact: true },
            { href: "/panel/dashboard/bansos", icon: Users, label: "Penerima Bantuan Sosial" },
        ]
    },
    {
        label: "Konten & Tampilan",
        items: [
            { href: "/panel/dashboard/profil", icon: FileText, label: "Profil & Sejarah Desa" },
            { href: "/panel/dashboard/berita", icon: Newspaper, label: "Berita Desa" },
            { href: "/panel/dashboard/banners", icon: ImageIcon, label: "Hero Banners" },
            // { href: "/panel/dashboard/assets", icon: FolderOpen, label: "File Manager" },
        ]
    },
    {
        label: "Kependudukan & Wilayah",
        items: [
            { href: "/panel/dashboard/penduduk", icon: Users, label: "Data Induk Penduduk" },
            { href: "/panel/dashboard/mutasi", icon: Users, label: "Mutasi Penduduk" },
            { href: "/panel/dashboard/perangkat-desa", icon: Users, label: "Perangkat Desa" },
            { href: "/panel/dashboard/demografi", icon: BarChart3, label: "Statistik Demografi" },
        ]
    },
    {
        label: "Aset & Inventaris",
        items: [
            { href: "/panel/dashboard/aset/tanah", icon: Map, label: "Aset Tanah Desa" },
            { href: "/panel/dashboard/aset/inventaris", icon: Package, label: "Inventaris Barang" },
        ]
    },
    {
        label: "Keuangan & Transparansi",
        items: [
            { href: "/panel/dashboard/bku/transaksi", icon: Wallet, label: "Log Transaksi BKU" },
            { href: "/panel/dashboard/bku/rekening", icon: FolderOpen, label: "Master Rekening Desa" },
            { href: "/panel/dashboard/bku/pajak", icon: Receipt, label: "Buku Pembantu Pajak" },
            { href: "/panel/dashboard/pbb", icon: Receipt, label: "Buku Pembantu PBB" },
            { href: "/panel/dashboard/apbdes", icon: PieChart, label: "Transparansi APBDes" },
        ]
    },
    // {
    //     label: "Media Sosial",
    //     items: [
    //         { href: "/panel/dashboard/socials", icon: Share2, label: "Social Feeds" },
    //     ]
    // },
    // {
    //     label: "Sistem",
    //     items: [
    //         { href: "/panel/dashboard/settings", icon: Settings, label: "Pengaturan Situs" },
    //         // { href: "/panel/dashboard/users", icon: Users, label: "Manajemen User" },
    //     ]
    // }
];

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed, mobileOpen = false, setMobileOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-[#F0F4F8] text-slate-700 transition-all duration-300 z-50 flex flex-col font-sans overflow-hidden border-r border-slate-200 shadow-xl",
                // Mobile behavior: Translate off-screen by default, slide in if open
                "md:translate-x-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
                // Width transition
                collapsed ? "w-20" : "w-64"
            )}>
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 bg-[#F0F4F8] border-b border-slate-200">
                        {!collapsed && (
                            <span className="font-black text-lg tracking-tight text-slate-800 flex items-center gap-2">
                                Admin Panel
                            </span>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:block p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors ml-auto"
                        >
                            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setMobileOpen && setMobileOpen(false)}
                            className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors ml-auto"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-4 overflow-y-auto custom-scrollbar">
                        {MENU_GROUPS.map((group, groupIdx) => (
                            <div key={groupIdx}>
                                 {!collapsed && (
                                    <h3 className={cn(
                                        "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-3 leading-tight",
                                        groupIdx > 0 && "mt-4"
                                    )}>
                                        {group.label}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item: any) => {
                                        // Strict check for exact match if specified, else prefix
                                        const isActive = item.exact
                                            ? pathname === item.href
                                            : pathname.startsWith(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group z-10",
                                                    isActive
                                                        ? "text-emerald-700 font-bold"
                                                        : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50"
                                                )}
                                                title={collapsed ? item.label : undefined}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-emerald-50 rounded-xl border border-emerald-100/50 shadow-sm -z-10"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <item.icon className={cn(
                                                    "w-5 h-5 flex-shrink-0 relative z-10 transition-colors",
                                                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                                                )} />
                                                {!collapsed && (
                                                    <span className="truncate relative z-10">{item.label}</span>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                                {/* Divider if not last */}
                                {!collapsed && groupIdx < MENU_GROUPS.length - 1 && (
                                    <div className="h-px bg-slate-100 mx-3 mt-4"></div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer / User */}
                    <div className="p-4 border-t border-slate-200 bg-[#E2E8F0]/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
                                A
                            </div>
                            {!collapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate" title={pb.authStore.model?.email}>
                                        {pb.authStore.model?.email ? (() => {
                                            const email = pb.authStore.model.email;
                                            if (email === "admin@sumberanyar.id") return "Admin Desa";
                                            const [name, domain] = email.split('@');
                                            const maskedName = name.length > 2
                                                ? `${name[0]}*****${name[name.length - 1]}`
                                                : name;
                                            const maskedDomain = domain.length > 3
                                                ? `${domain[0]}***${domain.substring(domain.lastIndexOf('.'))}`
                                                : domain;
                                            return `${maskedName}@${maskedDomain}`;
                                        })() : "Administrator"}
                                    </p>
                                    <button
                                        onClick={() => {
                                            pb.authStore.clear();
                                            document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                            router.push("/panel/login");
                                        }}
                                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-0.5 transition-colors font-medium px-2 py-1 -ml-2 rounded hover:bg-red-50"
                                    >
                                        <LogOut className="w-3 h-3" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
