"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const records = await pb.collection('profil_desa').getList(1, 1);
                if (records.items.length > 0) {
                    const data = records.items[0];
                    if (data.logo_secondary) {
                        setLogoUrl(pb.files.getUrl(data, data.logo_secondary));
                    } else if (data.logo_primary) {
                        setLogoUrl(pb.files.getUrl(data, data.logo_primary));
                    }
                }
            } catch (e) {
                // Ignore error, fallback to icon
            }
        };
        fetchLogo();
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginInputs) => {
        setIsLoading(true);
        setError("");

        try {
            // Try regular users collection first
            await pb.collection('users').authWithPassword(data.email, data.password);
            document.cookie = `pb_auth=${pb.authStore.token}; path=/; max-age=86400; SameSite=Strict`;
            router.push("/panel/dashboard");
        } catch (err: any) {
            // Only log if it's not a 400 (Bad Request / Invalid Credentials) error
            if (err.status !== 400) {
                console.error("Login Error:", err);
            }

            // Fallback: Try Super User Auth (PocketBase v0.25+)
            try {
                await pb.collection('_superusers').authWithPassword(data.email, data.password);
                document.cookie = `pb_auth=${pb.authStore.token}; path=/; max-age=86400; SameSite=Strict`;
                router.push("/panel/dashboard");
            } catch (adminErr) {
                setError("Email atau password salah.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 gap-6">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-desa-primary to-desa-primary-dark p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 w-full h-24 flex items-center justify-center mx-auto mb-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-full object-contain" />
                        ) : (
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <ShieldCheck className="w-8 h-8 text-desa-accent" />
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight mb-1 relative z-10">Admin Panel</h1>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all",
                                        errors.email ? "border-red-500 bg-red-50" : "border-slate-200"
                                    )}
                                    placeholder="admin@sumberanyar.id"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className={cn(
                                        "w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all",
                                        errors.password ? "border-red-500 bg-red-50" : "border-slate-200"
                                    )}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.02 1.29-.05" /><path d="M22 2 2 22" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-desa-primary hover:bg-desa-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-desa-primary/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk ke Dashboard"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pb-8">
                        <p className="text-xs text-slate-400">
                            Halaman Admin kelola website desa sumberanyar.id
                        </p>
                    </div>
                </div>
            </div>

            {/* External License Info */}
            <div className="text-center">
                <p className="text-[10px] text-slate-400 font-mono tracking-wide opacity-70">
                    Sistem Informasi Desa Sumberanyar &copy; 2026
                </p>
            </div>
        </main>
    );
}
