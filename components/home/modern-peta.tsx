"use client";

import React from "react";
import { Map, MapPin, Navigation, Info, Building2 } from "lucide-react";

export function ModernPeta() {
    return (
        <div className="animate-in fade-in duration-500 pb-12 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <Map className="w-8 h-8 text-blue-600" /> Peta Wilayah Desa
                    </h2>
                    <p className="text-slate-500 mt-2">Batas geografis, navigasi, dan letak Desa Sumberanyar, Rowokangkung.</p>
                </div>
                <a href="https://maps.google.com/?q=Sumberanyar,Rowokangkung,Lumajang" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition">
                    <Navigation className="w-4 h-4" /> Buka di Google Maps
                </a>
            </div>

            {/* Map Frame - Wilayah Desa */}
            <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Peta Wilayah Desa Sumberanyar
                </h3>
                <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100" style={{ position: 'relative', paddingBottom: '50%', height: 0 }}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15797.433434685984!2d113.2921508!3d-8.1666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd65e00b84c8bfb%3A0x5027a76e3565980!2sSumberanyar%2C%20Kec.%20Rowokangkung%2C%20Kabupaten%20Lumajang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Peta Wilayah Desa Sumberanyar"
                    ></iframe>
                </div>
            </div>

            {/* Map Frame - Kantor Desa */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" /> Lokasi Kantor Desa Sumberanyar
                </h3>
                <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-blue-200 bg-blue-50" style={{ position: 'relative', paddingBottom: '40%', height: 0 }}>
                    <iframe 
                        src="https://maps.google.com/maps?q=Kantor+Desa+Sumberanyar+Rowokangkung+Lumajang+Jawa+Timur&t=&z=16&ie=UTF8&iwloc=B&output=embed" 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Kantor Desa Sumberanyar"
                    ></iframe>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">* Titik peta menunjukkan lokasi Kantor/Balai Desa Sumberanyar, Kec. Rowokangkung, Kab. Lumajang, Jawa Timur.</p>
            </div>

            {/* Profile Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><MapPin className="w-5 h-5"/></div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Provinsi</h4>
                        <p className="font-semibold text-slate-800">Jawa Timur</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><MapPin className="w-5 h-5"/></div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Kabupaten</h4>
                        <p className="font-semibold text-slate-800">Lumajang</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><MapPin className="w-5 h-5"/></div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Kecamatan</h4>
                        <p className="font-semibold text-slate-800">Rowokangkung</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Info className="w-5 h-5"/></div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Luas Wilayah</h4>
                        <p className="font-semibold text-slate-800">± 560 Hektar</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
