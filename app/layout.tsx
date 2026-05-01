import type { Metadata } from "next";

import { Suspense } from "react";
import { Inter, Outfit, Manrope } from "next/font/google";
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
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit" 
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const title = "Website Resmi Desa Sumberanyar";
  const desc = config?.meta_description || "Website Resmi Desa Sumberanyar, Kecamatan Rowokangkung, Kabupaten Lumajang, Jawa Timur. Layanan publik digital, transparansi APBDes, dan berita terkini.";

  const iconUrl = config?.favicon_url || (config?.favicon ? pb.files.getURL(config, config.favicon) : "/logo3-removebg-preview.png");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000"),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: desc,
    keywords: [
      "Website Resmi Desa Sumberanyar", 
      "Desa Sumberanyar", 
      "Rowokangkung", 
      "Lumajang", 
      "Website Desa", 
      "Web Desa", 
      "Portal Desa Sumberanyar",
      "Kecamatan Rowokangkung",
      "Kabupaten Lumajang",
      "Pemerintah Desa Sumberanyar",
      "Layanan Desa Online",
      "Berita Desa Sumberanyar",
      "Rowokangkung Lumajang",
      "Desa Rowokangkung",
      "Sistem Informasi Desa Lumajang"
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000",
      siteName: title,
      title: title,
      description: desc,
      images: [{
        url: config?.og_image ? pb.files.getURL(config, config.og_image) : "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: title
      }],
    },
    icons: {
      icon: [
        { url: iconUrl },
        { url: iconUrl, sizes: '32x32', type: 'image/png' },
        { url: iconUrl, sizes: '16x16', type: 'image/png' },
      ],
      shortcut: iconUrl,
      apple: [
        { url: iconUrl },
        { url: iconUrl, sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: iconUrl,
        },
      ],
    },
    manifest: "/site.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  const orgSchema = {
    name: "Website Resmi Desa Sumberanyar",
    alternateName: "Pemerintah Desa Sumberanyar",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://sumberanyar.local:3000",
    logo: "/logo.png",
    description: config?.meta_description || "Portal resmi Sistem Informasi Desa (SID) Sumberanyar, Kecamatan Rowokangkung, Kabupaten Lumajang, Jawa Timur.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: config?.kontak_telp || "+62-812-3456-7890",
      contactType: "Pelayanan Masyarakat",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "Javanese"]
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: config?.alamat_lengkap || "Jl. Raya Sumberanyar No. 1",
      addressLocality: config?.kecamatan || "Rowokangkung",
      addressRegion: config?.kabupaten || "Lumajang",
      postalCode: config?.kode_pos || "67359",
      addressCountry: "ID"
    },
    sameAs: config?.social_links ? Object.values(config.social_links) : []
  };

  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        outfit.variable,
        manrope.variable,
        "font-sans bg-background text-foreground antialiased"
      )} suppressHydrationWarning>
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
