"use client";

import React, { useState } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { TactileButton } from "@/components/ui/tactile-button";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { FormInput } from "@/components/ui/form-input";
import { StatsWidget } from "@/components/widgets/stats-widget";
import { NewsWidget } from "@/components/widgets/news-widget";
import { QuickActions } from "@/components/widgets/quick-actions";
import { NavList } from "@/components/widgets/nav-list";
import { Download, BookOpen, Wallet, Palette, Type, MousePointer2, User } from "lucide-react";

export default function MasterUIKit() {
    const [amount, setAmount] = useState("");

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 antialiased overflow-x-hidden">
            <ModernNavbar />

            {/* Hero Section */}
            <header className="relative bg-primary overflow-hidden">
                {/* Arabesque Grid Texture */}
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-30 pointer-events-none"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wide">
                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                MASTER UI KIT
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                                Modern Arabesque <br />
                                <span className="text-gold">Fintech Experience</span>
                            </h1>
                            <p className="text-lg text-green-50 max-w-xl leading-relaxed opacity-90">
                                A premium design system featuring geometric textures, tactile interactions, and deep emerald tones tailored for SID Sumberanyar.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <TactileButton variant="secondary" icon={<Download className="w-5 h-5" />}>
                                    Download Kit
                                </TactileButton>
                                <button className="btn-tactile inline-flex items-center justify-center h-12 px-8 py-2 text-base font-bold text-white transition-all duration-200 bg-white/10 border-b-4 border-black/20 hover:bg-white/20 rounded-xl backdrop-blur-sm">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Documentation
                                </button>
                            </div>
                        </div>

                        {/* Hero Visual / Mockup */}
                        <div className="flex-1 w-full max-w-md relative z-10">
                            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border-b-4 border-gold rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Balance</p>
                                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Rp 124.500.000</h3>
                                    </div>
                                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-primary">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="h-24 w-full rounded-lg bg-gray-50 mb-4 overflow-hidden relative">
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-100 to-transparent opacity-50"></div>
                                    <svg className="absolute bottom-0 left-0 right-0 w-full h-16 text-primary" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0 30 Q 10 20 20 25 T 40 15 T 60 20 T 80 5 T 100 15 V 40 H 0 Z" fill="currentColor" fillOpacity="0.2"></path>
                                        <path d="M0 30 Q 10 20 20 25 T 40 15 T 60 20 T 80 5 T 100 15" fill="none" stroke="currentColor" strokeWidth="2"></path>
                                    </svg>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">Top Up</button>
                                    <button className="flex-1 py-2.5 bg-green-50 text-primary-dark text-sm font-bold rounded-lg hover:bg-green-100 transition-colors">Transfer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Arch Divider */}
                    <div className="absolute -bottom-1 left-0 w-full overflow-hidden pointer-events-none">
                        <div className="arch-divider"></div>
                    </div>
                </div>
            </header>

            {/* Main Content: Bento Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Component Library</h2>
                    <p className="text-gray-500 mt-2">Core building blocks of the Modern Arabesque design system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* 1. Color Palette Card */}
                    <ArabesqueCard variant="gold-border" title="Brand Colors" icon={<Palette className="w-6 h-6" />}>
                        <div className="space-y-4">
                            <ColorRow color="bg-primary" label="Emerald Green" hex="#15803d" text="text-white" />
                            <ColorRow color="bg-gold" label="Sun Gold" hex="#FACC15" text="text-primary-dark" />
                            <ColorRow color="bg-primary-dark" label="Deep Forest" hex="#14532d" text="text-white" />
                        </div>
                    </ArabesqueCard>

                    {/* 2. Typography Card */}
                    <ArabesqueCard variant="gold-border" title="Typography" icon={<Type className="w-6 h-6" />}>
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Display H1</h1>
                                <p className="text-xs text-gray-400 mt-1">Manrope Bold / 30px / Tracking Tight</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Heading H2</h2>
                                <p className="text-xs text-gray-400 mt-1">Manrope Bold / 20px / Tracking Tight</p>
                            </div>
                            <div>
                                <p className="text-base font-normal text-gray-600 leading-relaxed">
                                    Body text designed for high legibility in financial contexts. Uses standard tracking and relaxed line height.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Manrope Regular / 16px</p>
                            </div>
                        </div>
                    </ArabesqueCard>

                    {/* 3. Tactile Buttons Card */}
                    <ArabesqueCard variant="gold-border" title="Tactile Buttons" icon={<MousePointer2 className="w-6 h-6" />}>
                        <div className="flex flex-col gap-4">
                            <TactileButton fullWidth>Primary Action</TactileButton>
                            <TactileButton variant="secondary" fullWidth icon={<span className="text-sm">⚡</span>}>Secondary Action</TactileButton>
                            <TactileButton variant="tertiary" fullWidth>Tertiary / Cancel</TactileButton>
                        </div>
                    </ArabesqueCard>

                    {/* 4. Form Elements Card */}
                    <div className="md:col-span-2">
                        <ArabesqueCard variant="gold-border" title="Form Inputs" icon={<Type className="text-emerald-700 w-6 h-6" />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Full Name" placeholder="Enter your full name" icon={<User className="text-gray-400 w-5 h-5" />} />
                                <FormInput
                                    label="Amount (IDR)"
                                    placeholder="0"
                                    currencyPrefix="Rp"
                                    numeric
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <div className="md:col-span-2">
                                    <label className="block space-y-1.5">
                                        <span className="text-gray-700 font-medium block">Transaction Note</span>
                                        <textarea
                                            className="block w-full rounded-lg border-gray-200 bg-slate-50 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all p-3 min-h-[100px]"
                                            placeholder="Add a note..."
                                        ></textarea>
                                    </label>
                                </div>
                            </div>
                        </ArabesqueCard>
                    </div>

                    {/* 5. Navigation List */}
                    <NavList />

                    {/* 6. Widgets Section Header */}
                    <div className="md:col-span-2 lg:col-span-3 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 rounded-full bg-gold block"></span>
                            Example Widgets
                        </h3>
                    </div>

                    <NewsWidget />
                    <StatsWidget />
                    <QuickActions />

                </div>
            </main>

            <ModernFooter />
        </div>
    );
}

function ColorRow({ color, label, hex, text }: { color: string, label: string, hex: string, text: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`h - 14 w - 14 rounded - xl ${color} shadow - sm flex items - center justify - center ${text} `}>
                <span className="text-xs font-medium opacity-50">Aa</span>
            </div>
            <div>
                <p className="font-bold text-gray-900">{label}</p>
                <p className="text-sm font-mono text-gray-500">{hex}</p>
            </div>
        </div>
    );
}
