
"use client";

import { useState, useEffect } from "react";

export default function TestImage() {
    // URL from list-banners.mjs output
    const foregroundUrl = "/cdn/secure/pbc_1720951369/z7hl622t7qs1rk1/model_01_ducaseh20h.png";
    const desktopUrl = "/cdn/secure/pbc_1720951369/z7hl622t7qs1rk1/stock_foto_bmtnu_2_xa78pj0u4r.png";

    const [status, setStatus] = useState<string>("Loading...");

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">Image Test Page</h1>

            <div className="border p-4">
                <h2 className="font-bold">Foreground Image (The Problematic One)</h2>
                <div className="flex items-center gap-4 mt-2">
                    <img
                        src={foregroundUrl}
                        alt="Foreground"
                        className="h-32 object-contain border bg-slate-100"
                        onLoad={() => { }}
                        onError={(e) => {
                            console.error("Foreground Error", e);
                            setStatus("Foreground Error");
                        }}
                    />
                    <a href={foregroundUrl} target="_blank" className="text-blue-500 underline">Direct Link</a>
                </div>
            </div>

            <div className="border p-4">
                <h2 className="font-bold">Desktop Image (Known Good)</h2>
                <div className="flex items-center gap-4 mt-2">
                    <img
                        src={desktopUrl}
                        alt="Desktop"
                        className="h-32 object-contain border bg-slate-100"
                        onLoad={() => { }}
                        onError={(e) => console.error("Desktop Error", e)}
                    />
                    <a href={desktopUrl} target="_blank" className="text-blue-500 underline">Direct Link</a>
                </div>
            </div>

            <div>Status: {status}</div>
        </div>
    );
}
