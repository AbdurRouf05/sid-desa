import React from "react";
import { Image as ImageIcon } from "lucide-react";

export function NewsWidget() {
    return (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b-4 border-gold overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-primary-dark">Latest Updates</h3>
                <a className="text-sm text-primary font-bold hover:underline" href="#">View All</a>
            </div>
            <div className="p-4 space-y-3">
                {[
                    {
                        tag: "PROMO",
                        tagColor: "bg-green-100 text-green-800",
                        title: "Special Financing Rates for Ramadan",
                        desc: "Get up to 2.5% margin reduction for all financing products.",
                        iconColor: "text-emerald-600",
                        bgIcon: "bg-emerald-50"
                    },
                    {
                        tag: "SYSTEM",
                        tagColor: "bg-blue-100 text-blue-800",
                        title: "Mobile Banking App Update v2.4",
                        desc: "New features including QRIS payments and scheduled transfers.",
                        iconColor: "text-yellow-600",
                        bgIcon: "bg-yellow-50"
                    }
                ].map((item, i) => (
                    <div key={i} className="group p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden">
                        {/* Glassy Background on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex gap-4 relative z-10">
                            <div className="h-16 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                                <div className={`w-full h-full ${item.bgIcon} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <ImageIcon className={item.iconColor} />
                                </div>
                            </div>
                            <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${item.tagColor}`}>{item.tag}</span>
                                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm md:text-base leading-tight">{item.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
