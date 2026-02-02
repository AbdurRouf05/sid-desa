import React from "react";
import { LayoutDashboard, Wallet, ArrowLeftRight, Settings, ChevronRight } from "lucide-react";

export function NavList() {
    return (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b-4 border-gold p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    <MenuIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg text-primary-dark">Navigation List</h3>
                </div>
            </div>
            <div className="flex-1 p-3 space-y-1">
                {/* Active Item - Glassy */}
                <div className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-white border border-emerald-100/50 shadow-sm cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full my-1 ml-0.5"></div>
                    <div className="flex items-center gap-3 pl-2">
                        <div className="p-1.5 bg-white rounded-md shadow-sm text-primary">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-primary-dark">Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
                </div>

                {/* Inactive Items */}
                <NavItem icon={<Wallet className="w-5 h-5" />} label="My Accounts" />
                <NavItem icon={<ArrowLeftRight className="w-5 h-5" />} label="Transfers" />
                <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
            </div>
        </div>
    );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-all duration-300 hover:translate-x-1 hover:shadow-sm border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3">
                <span className="text-gray-400 group-hover:text-primary transition-colors duration-300 transform group-hover:scale-110">{icon}</span>
                <span className="font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
        </div>
    );
}

function MenuIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
    );
}
