"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";
import {
    LayoutDashboard,
    MessageSquare,
    Newspaper,
    ShoppingBag,
    Image as ImageIcon,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    MapPin,
    FolderOpen,
    Share2,
    Users,
    FileText
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_GROUPS = [
    {
        label: "Utama",
        items: [
            { href: "/panel/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
            { href: "/panel/dashboard/inquiries", icon: MessageSquare, label: "Pesan Masuk" },
        ]
    },
    {
        label: "Konten & Tampilan",
        items: [
            { href: "/panel/dashboard/berita", icon: Newspaper, label: "Berita & Artikel" },
            { href: "/panel/dashboard/banners", icon: ImageIcon, label: "Hero Banners" },
            // { href: "/panel/dashboard/assets", icon: FolderOpen, label: "File Manager" },
        ]
    },
    {
        label: "Produk & Layanan",
        items: [
            { href: "/panel/dashboard/produk", icon: ShoppingBag, label: "Produk Keuangan" },
            { href: "/panel/dashboard/cabang", icon: MapPin, label: "Kantor Cabang" },
        ]
    },
    {
        label: "Media Sosial",
        items: [
            { href: "/panel/dashboard/socials", icon: Share2, label: "Social Feeds" },
        ]
    },
    {
        label: "Sistem",
        items: [
            { href: "/panel/dashboard/settings", icon: Settings, label: "Pengaturan Situs" },
            // { href: "/panel/dashboard/users", icon: Users, label: "Manajemen User" },
        ]
    }
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
                "fixed left-0 top-0 h-screen bg-emerald-950 text-emerald-100 transition-all duration-300 z-50 flex flex-col font-sans overflow-hidden border-r border-emerald-900 shadow-2xl",
                // Mobile behavior: Translate off-screen by default, slide in if open
                "md:translate-x-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
                // Width transition
                collapsed ? "w-20" : "w-64"
            )}>
                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-5 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 bg-emerald-900/50 border-b border-emerald-800 backdrop-blur-sm">
                        {!collapsed && <span className="font-bold text-lg tracking-tight text-white">BMT Panel</span>}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:block p-2 hover:bg-emerald-800 rounded-lg text-emerald-200 hover:text-white transition-colors ml-auto"
                        >
                            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setMobileOpen && setMobileOpen(false)}
                            className="md:hidden p-2 hover:bg-emerald-800 rounded-lg text-emerald-200 hover:text-white transition-colors ml-auto"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto custom-scrollbar">
                        {MENU_GROUPS.map((group, groupIdx) => (
                            <div key={groupIdx}>
                                {!collapsed && (
                                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 px-3">
                                        {group.label}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item) => {
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
                                                        ? "text-white font-medium"
                                                        : "text-emerald-300 hover:text-white hover:bg-emerald-900/40"
                                                )}
                                                title={collapsed ? item.label : undefined}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-emerald-700/80 rounded-xl border border-emerald-600 shadow-sm -z-10"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <item.icon className={cn(
                                                    "w-5 h-5 flex-shrink-0 relative z-10 transition-colors",
                                                    isActive ? "text-white" : "text-emerald-400 group-hover:text-emerald-200"
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
                                    <div className="h-px bg-emerald-900/50 mx-3 mt-4"></div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer / User */}
                    <div className="p-4 border-t border-emerald-800 bg-emerald-950">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 font-bold border border-emerald-700 shadow-inner">
                                A
                            </div>
                            {!collapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate" title={pb.authStore.model?.email}>
                                        {pb.authStore.model?.email ? (() => {
                                            const email = pb.authStore.model.email;
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
                                            router.push("/panel/login");
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5 transition-colors font-medium"
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
