"use client";

import { useEffect } from "react";

export function ClientGuard() {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S)
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault();
                return;
            }

            // Ctrl + Shift + I (Inspect) or J (Console) or C (Elements)
            if (
                e.ctrlKey &&
                e.shiftKey &&
                (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
            ) {
                e.preventDefault();
                return;
            }

            // Ctrl + U (View Source)
            if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
                e.preventDefault();
                return;
            }

            // Ctrl + S (Save Page)
            if (e.ctrlKey && (e.key === "S" || e.key === "s")) {
                e.preventDefault();
                return;
            }
        };

        // 3. Disable Image Dragging
        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("dragstart", handleDragStart);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("dragstart", handleDragStart);
        };
    }, []);

    return null; // Render nothing visually
}
