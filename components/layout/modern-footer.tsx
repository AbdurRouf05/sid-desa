import React from "react";
import { Home } from "lucide-react";

export function ModernFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-white p-1 rounded-md">
                        <Home className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">BMT NU Lumajang</span>
                </div>
                <p className="text-gray-500 text-sm">© 2025 sagamuda.id. All rights reserved.</p>
            </div>
        </footer>
    );
}
