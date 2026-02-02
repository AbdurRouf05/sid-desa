import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "BMT NU Lumajang - Amanah & Syariah",
  description: "Lembaga Keuangan Syariah Terpercaya di Lumajang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={cn(
        inter.variable,
        jakarta.variable,
        manrope.variable,
        "font-sans bg-background text-foreground antialiased"
      )}>
        {children}
      </body>
    </html>
  );
}
