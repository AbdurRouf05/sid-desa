import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="w-16 h-16 bg-bmt-green-700 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                        <Lock size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">BMT NU Admin</CardTitle>
                    <p className="text-sm text-slate-500">Silakan masuk untuk melanjutkan</p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            placeholder="admin@bmtnu.id"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bmt-green-700/20 focus:border-bmt-green-700 transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bmt-green-700/20 focus:border-bmt-green-700 transition"
                        />
                    </div>
                    <Button className="w-full bg-bmt-green-700 hover:bg-bmt-green-800">
                        Masuk Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
