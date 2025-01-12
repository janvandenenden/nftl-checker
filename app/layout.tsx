import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import ClientProvider from "./ClientProvider";
import localFont from "next/font/local";

const fontSans = FontSans({ subsets: ["latin"] });

export const metadata = {
  title: "NFTL Claim Checker | Check Claimable NFTL for Nifty Degen NFTs",
  description:
    "Instantly check and compare claimable NFTL amounts for Nifty Degen NFTs. Find the best deals with our real-time price tracking and sorting features. Direct links to OpenSea and Blur marketplaces.",
  openGraph: {
    title: "NFTL Claim Checker | Check Claimable NFTL for Nifty Degen NFTs",
    description:
      "Instantly check and compare claimable NFTL amounts for Nifty Degen NFTs. Find the best deals with our real-time price tracking and sorting features.",
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com", // Replace with your actual domain
    siteName: "NFTL Claim Checker",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg", // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "NFTL Claim Checker Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NFTL Claim Checker | Check Claimable NFTL for Nifty Degen NFTs",
    description:
      "Instantly check and compare claimable NFTL amounts for Nifty Degen NFTs. Find the best deals with our real-time price tracking and sorting features.",
    images: ["https://your-domain.com/og-image.jpg"], // Replace with your actual OG image path
  },
  robots: "index, follow",
};

const font = localFont({
  src: [
    {
      path: "./fonts/Disket-Mono-Bold.ttf",
      style: "normal",
      weight: "700",
    },
    {
      path: "./fonts/Disket-Mono-Regular.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-disket",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 font-disket antialiased",
          font.variable
        )}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
