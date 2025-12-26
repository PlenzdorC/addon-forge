import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://addon-forge.web.app'),
  title: {
    default: "AddOnForge - WoW AddOn Requests",
    template: "%s | AddOnForge"
  },
  description: "Community platform for World of Warcraft AddOn requests. Request, vote, and discover the best WoW AddOns. Inspired by WeakAuras.",
  keywords: [
    "World of Warcraft",
    "WoW",
    "AddOn",
    "WeakAuras",
    "Midnight",
    "UI",
    "Interface",
    "Gaming",
    "Community",
    "WoW UI",
    "Game AddOn",
    "WoW Mods"
  ],
  authors: [{ name: "AddOnForge Community" }],
  creator: "AddOnForge",
  publisher: "AddOnForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://addon-forge.web.app',
    siteName: 'AddOnForge',
    title: 'AddOnForge - WoW AddOn Requests',
    description: 'Community platform for World of Warcraft AddOn requests. Request, vote, and discover the best WoW AddOns.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AddOnForge - WoW AddOn Requests',
    description: 'Community platform for World of Warcraft AddOn requests',
  },
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
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://addon-forge.web.app';
  const canonicalUrl = `${baseUrl}/${locale}`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="de" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col wow-gradient`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

