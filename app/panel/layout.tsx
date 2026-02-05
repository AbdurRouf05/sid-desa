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

    // Skip auth check for login page
    const isLoginPage = pathname === "/panel/login";

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
    if (!isAuthorized) {
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
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={cn(
                "flex-1 p-8 transition-all duration-300",
                collapsed ? "ml-20" : "ml-64"
            )}>
                {children}
            </div>
        </div>
    );
}
