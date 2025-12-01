import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AddOnForge - WoW AddOn Requests",
  description: "Community-Plattform für World of Warcraft AddOn-Anfragen. Inspiriert von WeakAuras.",
  keywords: ["World of Warcraft", "WoW", "AddOn", "WeakAuras", "Midnight", "UI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen flex flex-col wow-gradient`}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
