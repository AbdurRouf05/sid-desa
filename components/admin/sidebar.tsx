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
    FolderOpen
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    { href: "/panel/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/panel/dashboard/inquiries", icon: MessageSquare, label: "Pesan Masuk" },
    { href: "/panel/dashboard/berita", icon: Newspaper, label: "Berita & Artikel" },
    { href: "/panel/dashboard/produk", icon: ShoppingBag, label: "Produk & Layanan" },
    { href: "/panel/dashboard/cabang", icon: MapPin, label: "Kantor Cabang" },
    { href: "/panel/dashboard/banners", icon: ImageIcon, label: "Hero Banners" },
    { href: "/panel/dashboard/assets", icon: FolderOpen, label: "Manajemen Aset" },
    { href: "/panel/dashboard/settings", icon: Settings, label: "Pengaturan Situs" },
];

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-emerald-950 text-emerald-100 transition-all duration-300 z-50 flex flex-col font-sans overflow-hidden",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-5 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 bg-emerald-900/50 border-b border-emerald-800">
                    {!collapsed && <span className="font-bold text-lg tracking-tight text-white">Admin Panel</span>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-emerald-800 rounded-lg text-emerald-200 hover:text-white transition-colors"
                    >
                        {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        // Strict check for exactly dashboard, or subpaths for others
                        const isDashboard = item.href === "/panel/dashboard";
                        const isActive = isDashboard
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 group z-10",
                                    isActive
                                        ? "text-white"
                                        : "text-emerald-300 hover:text-white hover:bg-emerald-900/50"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-900/20 -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", isActive && "text-white")} />
                                {!collapsed && (
                                    <span className="font-medium truncate relative z-10">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / User */}
                <div className="p-4 border-t border-emerald-800 bg-emerald-925">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 font-bold border border-emerald-700">
                            A
                        </div>
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">Administrator</p>
                                <button
                                    onClick={() => {
                                        pb.authStore.clear();
                                        router.push("/panel/login");
                                    }}
                                    className="text-xs text-red-300 hover:text-red-200 flex items-center gap-1 mt-0.5 transition-colors"
                                >
                                    <LogOut className="w-3 h-3" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
