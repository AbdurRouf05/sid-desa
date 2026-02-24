import type { Metadata } from "next";

import { Suspense } from "react";
import { Inter, Merriweather, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/config";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { pb } from "@/lib/pb";
import { UiLabelsProvider } from "@/components/providers/ui-labels-provider";
import { Toaster } from "sonner";
import { ClientGuard } from "@/components/security/client-guard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather" 
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const title = config?.company_name || "SID Sumberanyar";
  const desc = "Sistem Informasi Desa (SID) Sumberanyar: Portal resmi Desa Sumberanyar, Kec. Nguling, Kab. Pasuruan. Layanan administrasi, informasi publik, dan transparansi pemerintahan desa.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000"),
    title: {
      template: `%s | ${title}`,
      default: `${title} - Portal Desa Digital`,
    },
    description: desc,
    keywords: ["SID Sumberanyar", "Desa Sumberanyar", "Pemerintah Desa", "Kecamatan Nguling", "Kabupaten Pasuruan", "Sistem Informasi Desa", title],
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000",
      siteName: title,
      title: `${title} - Portal Desa Digital`,
      description: desc,
      images: [{
        url: config?.og_image ? pb.files.getURL(config, config.og_image) : "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: title
      }],
    },
    icons: {
      icon: config?.favicon ? pb.files.getURL(config, config.favicon) : "/favicon.ico",
      shortcut: config?.favicon ? pb.files.getURL(config, config.favicon) : "/favicon.ico",
      apple: config?.favicon ? pb.files.getURL(config, config.favicon) : "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  const orgSchema = {
    name: config?.company_name || "Pemerintah Desa Sumberanyar",
    alternateName: "SID Sumberanyar",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000",
    logo: "/logo.png",
    description: "Portal resmi Sistem Informasi Desa (SID) Sumberanyar, Kecamatan Nguling, Kabupaten Pasuruan, Jawa Timur.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: config?.phone_wa || "+62-812-3456-7890",
      contactType: "Pelayanan Masyarakat",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "Javanese"]
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: config?.address || "Jl. Raya Sumberanyar No. 1",
      addressLocality: "Nguling",
      addressRegion: "Jawa Timur",
      postalCode: "67171",
      addressCountry: "ID"
    },
    sameAs: config?.social_links ? Object.values(config.social_links) : []
  };

  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={cn(
        inter.variable,
        merriweather.variable,
        manrope.variable,
        "font-sans bg-background text-foreground antialiased"
      )}>
        <JsonLd type="Organization" data={orgSchema} />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <UiLabelsProvider>
          <ClientGuard />
          {children}
        </UiLabelsProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
