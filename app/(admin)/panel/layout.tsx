"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { pb } from "@/lib/pb";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Skip auth check for login page
    const isLoginPage = pathname === "/panel/login";

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isLoginPage) {
            if (pb.authStore.isValid) {
                // If already logged in, go to dashboard
                router.push("/panel/dashboard");
            }
            setIsAuthorized(true);
            return;
        }

        // Strict Admin Check
        if (!pb.authStore.isValid) {
            router.push("/panel/login");
        } else {
            setIsAuthorized(true);
        }
    }, [pathname, router, isLoginPage]);

    // Show loading or blank while checking to prevent flash
    // We render the layout but with a loading spinner if not authorized yet
    // This allows hooks to run but content to be hidden
    if (!isAuthorized && !isLoginPage) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#E9EEF1] font-sans">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className={cn(
                "flex-1 transition-all duration-300 flex flex-col min-w-0",
                collapsed ? "md:ml-20" : "md:ml-64"
            )}>
                {/* Mobile Header Trigger */}
                <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-30 shadow-sm">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                    <span className="font-bold text-slate-800 ml-3">Admin Panel</span>
                </div>

                <div className="p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
