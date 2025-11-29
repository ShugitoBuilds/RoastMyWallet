import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import FarcasterProvider from "@/components/FarcasterProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Roast My Base Wallet | Get Roasted by AI",
  description: "Connect your wallet and let AI ruthlessly roast your Base token holdings. The ultimate crypto roast experience.",
  openGraph: {
    title: "Roast My Base Wallet | Get Roasted by AI",
    description: "Connect your wallet and let AI ruthlessly roast your Base token holdings. The ultimate crypto roast experience.",
    url: "https://roastmybasewallet.vercel.app",
    siteName: "Roast My Base Wallet",
    images: [
      {
        url: "/roast-og.jpg",
        width: 1200,
        height: 630,
        alt: "Roast My Base Wallet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Base Wallet | Get Roasted by AI",
    description: "Connect your wallet and let AI ruthlessly roast your Base token holdings.",
    images: ["/roast-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <FarcasterProvider>
          <Providers>{children}</Providers>
        </FarcasterProvider>
      </body>
    </html>
  );
}

