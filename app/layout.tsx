import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebMCP from "@/lib/webmcp";
import ShareButton from "@/lib/share-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://homeward.heyitsmejosh.com"),
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "./" },
  title: "Homeward",
  description: "Post and find lost or found pets in your area",
  openGraph: {
    type: "website",
    siteName: "Homeward",
    title: "Homeward",
    description: "Post and find lost or found pets in your area",
    url: "https://homeward.heyitsmejosh.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: "if(location.hostname==='pets.heyitsmejosh.com')location.replace('https://homeward.heyitsmejosh.com'+location.pathname+location.search+location.hash)" }} />
        <WebMCP />
        {children}
        <ShareButton />
        <script dangerouslySetInnerHTML={{ __html: "if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))" }} />
      </body>
    </html>
  );
}
