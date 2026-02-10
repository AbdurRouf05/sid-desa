import type { Metadata } from "next";

import { Suspense } from "react";
import { Inter, Plus_Jakarta_Sans, Manrope } from "next/font/google";
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
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const title = config?.company_name || "BMT NU Lumajang";
  const desc = "KSPPS BMT NU Lumajang: Mitra Keuangan Syariah Terpercaya. Melayani Simpanan, Pembiayaan, dan Haji Umroh dengan prinsip syariah yang transparan dan amanah.";

  return {
    metadataBase: new URL("https://bmtnulmj.id"), // Start of dynamic URL or use canonical
    title: {
      template: `%s | ${title}`,
      default: `${title} - Mudah, Murah, Berkah`,
    },
    description: desc,
    keywords: ["BMT NU", "Koperasi Syariah Lumajang", "Simpanan Syariah", "Pembiayaan UMKM", "Tabungan Haji Lumajang", title],
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://bmtnu-lumajang.id",
      siteName: title,
      title: `${title} - Mudah, Murah, Berkah`,
      description: desc,
      images: [{
        url: config?.og_image ? pb.files.getURL(config, config.og_image) : "https://bmtnu-lumajang.id/og-image.jpg",
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
    name: config?.company_name || "KSPPS BMT NU Lumajang",
    alternateName: "BMT NU Lumajang",
    url: "https://bmtnu-lumajang.id",
    logo: "https://bmtnu-lumajang.id/logo.png",
    description: "Lembaga keuangan syariah yang mandiri, sehat, dan kuat milik PCNU Lumajang.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: config?.phone_wa || "+62-812-3456-7890",
      contactType: "Customer Service",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "Javanese"]
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: config?.address || "Jln. Alun-alun Timur No. 3, Jogotrunan",
      addressLocality: "Lumajang",
      addressRegion: "Jawa Timur",
      postalCode: "67316",
      addressCountry: "ID"
    },
    sameAs: config?.social_links ? Object.values(config.social_links) : [
      "https://facebook.com/bmtnulumajang",
      "https://instagram.com/bmtnulumajang",
      "https://youtube.com/@bmtnulumajang"
    ]
  };

  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={cn(
        inter.variable,
        jakarta.variable,
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
