"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { pb } from "@/lib/pb";

interface LabelRecord {
    label_key: string;
    label: string;
    section: string;
    is_visible: boolean;
}

interface UiLabelsContextType {
    labels: Record<string, LabelRecord>;
    loading: boolean;
    getLabel: (key: string, fallback: string) => string;
    isVisible: (key: string) => boolean;
}

const UiLabelsContext = createContext<UiLabelsContextType>({
    labels: {},
    loading: true,
    getLabel: (_, fallback) => fallback,
    isVisible: () => true,
});

export function useUiLabels() {
    return useContext(UiLabelsContext);
}

export function UiLabelsProvider({ children }: { children: React.ReactNode }) {
    const [labels, setLabels] = useState<Record<string, LabelRecord>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                // Fetch all labels (~50 max, lightweight)
                const records = await pb.collection('ui_labels').getFullList<LabelRecord>({
                    sort: 'label_key',
                });

                // Convert to Map for O(1) access
                const labelMap: Record<string, LabelRecord> = {};
                records.forEach(r => {
                    labelMap[r.label_key] = r;
                });

                setLabels(labelMap);
            } catch (e: any) {
                if (e.status === 404) {
                    console.info("UI Labels collection not found. Using defaults.");
                    setLabels({});
                } else {
                    console.error("Failed to load UI Labels", e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLabels();
    }, []);

    const getLabel = (key: string, fallback: string) => {
        if (loading) return fallback;
        return labels[key]?.label || fallback;
    };

    const isVisible = (key: string) => {
        if (loading) return true; // Default show while loading to prevent layout shift of hiding
        // If key exists, return its visibility. If not exists, assume visible (fallback mode).
        return labels[key] ? labels[key].is_visible : true;
    };

    return (
        <UiLabelsContext.Provider value={{ labels, loading, getLabel, isVisible }}>
            {children}
        </UiLabelsContext.Provider>
    );
}
