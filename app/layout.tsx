import type { Metadata } from "next";
import { Inter, Source_Serif_4, Atkinson_Hyperlegible_Next } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const puzzle = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-puzzle", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ilovewordsearch.com"),
  title: {
    default: "I Love Word Search | Free Printable and Online Word Search Puzzles",
    template: "%s | I Love Word Search"
  },
  description: "Find free printable and online word search puzzles, browse curated topics, or create a custom seeded puzzle.",
  applicationName: "I Love Word Search",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "I Love Word Search",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${puzzle.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
