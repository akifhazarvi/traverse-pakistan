import type { Metadata } from "next";
import { plusJakartaSans } from "@/styles/fonts";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { AwardStrip } from "@/components/layout/AwardStrip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Traverse Pakistan — Pakistan's Highest-Rated Tourism Company",
    template: "%s | Traverse Pakistan",
  },
  description:
    "Explore Pakistan with the highest-rated tour operator. Book group tours, custom trips, hotels, and transport across Hunza, Skardu, Chitral, and beyond.",
  keywords: [
    "Pakistan tours",
    "Hunza tour",
    "Skardu tour",
    "K2 Base Camp",
    "Pakistan travel",
    "Traverse Pakistan",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Traverse Pakistan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tp-theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AwardStrip />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </ThemeProvider>
      </body>
    </html>
  );
}
