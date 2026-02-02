import React from "react";
import { Info, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsWidgetProps {
    label?: string;
    value?: string;
    subtext?: string;
    limit?: string;
    percentage?: number;
    className?: string;
}

export function StatsWidget({
    label = "Daily Limit",
    value = "Rp 10.000.000",
    subtext = "Rp 6.500.000 Used",
    percentage = 65,
    className
}: StatsWidgetProps) {
    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border-b-4 border-yellow-400 p-5 md:p-6 hover:shadow-lg transition-all duration-300 w-full",
            className
        )}>
            {/* Mobile: Flex-col | Desktop: Flex-row (between) */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                {/* Label & Icon Header */}
                <div className="flex items-center justify-between w-full md:w-auto md:mb-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-950">{label}</h3>
                    </div>
                    {/* Info icon shown on mobile right */}
                    <Info className="w-5 h-5 text-gray-300 md:hidden" />
                </div>

                {/* Value Section */}
                <div className="text-left md:text-right">
                    <p className="text-2xl md:text-3xl font-black text-emerald-900 tracking-tight">{value}</p>
                    <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">{subtext}</p>
                </div>
            </div>

            {/* Progress Bar (Always full width) */}
            <div className="mt-6">
                <div className="flex mb-2 items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600">{percentage}% Used</span>
                    <span className="text-gray-400">Reset at 00:00</span>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
                    <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600 rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)", backgroundSize: "1rem 1rem" }}></div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-gray-50">
                <button className="w-full flex items-center justify-center gap-2 py-2 text-emerald-700 font-bold text-sm hover:bg-emerald-50 rounded-lg transition-colors active:scale-95 duration-200">
                    Adjust Limit <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
