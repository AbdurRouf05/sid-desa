"use client";

import React from "react";
import { Banknote, Users, ShieldCheck } from "lucide-react";
import { useUiLabels } from "@/components/providers/ui-labels-provider";

interface StatsDashboardProps {
    stats: {
        assets: string;
        members: string;
        branches: string;
    };
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
    const { getLabel } = useUiLabels();

    return (
        <section className="relative z-30 -mt-24 px-4 pb-12">
            <div className="container mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-b-4 border-gold">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="flex items-center gap-4 px-4">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                <Banknote className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{getLabel('stat_branches_label', 'Titik Layanan')}</p>
                                <h3 className="text-3xl font-black text-gray-900">{stats.branches} Kantor</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{getLabel('stat_members_label', 'Anggota')}</p>
                                <h3 className="text-3xl font-black text-gray-900">{stats.members} Orang</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{getLabel('stat_assets_label', 'Total Aset')}</p>
                                <h3 className="text-3xl font-black text-gray-900">{stats.assets}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
