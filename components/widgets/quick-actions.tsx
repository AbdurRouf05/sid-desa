import React from "react";
import { QrCode, Receipt, CreditCard, MoreHorizontal } from "lucide-react";

export function QuickActions() {
    const actions = [
        { icon: <QrCode className="w-6 h-6 text-gold" />, label: "QRIS" },
        { icon: <Receipt className="w-6 h-6 text-gold" />, label: "History" },
        { icon: <CreditCard className="w-6 h-6 text-gold" />, label: "Top Up" },
        { icon: <MoreHorizontal className="w-6 h-6 text-gold" />, label: "More" },
    ];

    return (
        <div className="bg-primary rounded-xl shadow-lg border-b-4 border-primary-dark p-6 text-white relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-6">Quick Access</h3>
                <div className="grid grid-cols-2 gap-4">
                    {actions.map((action, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
                            {action.icon}
                            <span className="text-xs font-bold">{action.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
