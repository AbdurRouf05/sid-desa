import * as React from "react";
import { cn } from "@/lib/utils";

interface CetakWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CetakWrapper({ children, className, ...props }: CetakWrapperProps) {
    return (
        <div 
            className={cn(
                // Base A4 Styling for screen viewing
                "bg-white mx-auto shadow-xl print:shadow-none",
                "w-full max-w-[210mm] min-h-[297mm]",
                "p-[20mm] sm:p-[25mm]", // Standard margins
                "text-black bg-white",
                
                // Print specific overrides
                "print:m-0 print:p-0 print:w-auto print:max-w-none print:min-h-0",
                "print:bg-transparent",
                
                // Typography setup for official documents
                "font-serif text-[12pt] leading-relaxed",
                
                className
            )} 
            {...props}
        >
            {/* The actual printable area */}
            <div className="print:p-[20mm] mx-auto h-full flex flex-col">
                {children}
            </div>

            {/* Print Styles injected locally */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}} />
        </div>
    );
}
