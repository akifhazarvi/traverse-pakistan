import type { Metadata, Viewport } from "next";
import { plusJakartaSans } from "@/styles/fonts";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { AwardStrip } from "@/components/layout/AwardStrip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  combineSchemas,
} from "@/lib/seo/schema";
import { SITE } from "@/lib/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Traverse Pakistan — Pakistan's Highest-Rated Tourism Company",
    template: "%s | Traverse Pakistan",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Travel",
  keywords: [
    "Pakistan tours",
    "Hunza tour",
    "Skardu tour",
    "Pakistan travel",
    "Pakistan tour packages",
    "K2 Base Camp trek",
    "Fairy Meadows",
    "Karakoram Highway",
    "Gilgit-Baltistan tours",
    "Chitral Kalash tour",
    "Pakistan honeymoon",
    "cherry blossom Hunza",
    "Traverse Pakistan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: "Traverse Pakistan — Pakistan's Highest-Rated Tourism Company",
    description: SITE.description,
    url: SITE.url,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — tours across Hunza, Skardu, and Chitral`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traverse Pakistan — Pakistan's Highest-Rated Tourism Company",
    description: SITE.description,
    images: [SITE.ogImage],
    creator: "@traversepakistan",
    site: "@traversepakistan",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1B19" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchema = combineSchemas(organizationSchema(), websiteSchema());

  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tp-theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://traversepakistan.com" />
        <link rel="dns-prefetch" href="https://traversepakistan.com" />
        <JsonLd data={rootSchema} id="root-jsonld" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AwardStrip />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFAB />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
