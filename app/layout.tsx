import type { Metadata } from "next";
import { Geist, Inter, Instrument_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = { title: "Hirely" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${inter.variable} ${instrument.variable} bg-[#0f0f13] font-sans text-[#ededef] antialiased`}
      >
        <Navbar></Navbar>
        {children}
        <Footer />
      </body>
    </html>
  );
}