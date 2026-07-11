import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Passport to Tombstone — Step Into the Real Old West",
    template: "%s | Passport to Tombstone",
  },
  description:
    "Tombstone, Arizona isn't a museum. It's alive. Experience the authentic Old West — or bring your entire team for an unforgettable retreat. Corporate retreats, festivals, weddings, and the real stories of a town too tough to die.",
  keywords: [
    "Tombstone Arizona",
    "Old West travel",
    "Tombstone events",
    "corporate retreat Arizona",
    "Tombstone lodging",
    "authentic Old West experience",
  ],
  openGraph: {
    title: "Passport to Tombstone",
    description:
      "Step into the real Old West. A town too tough to die. Bring your people here — we'll host them right.",
    type: "website",
  },
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
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
