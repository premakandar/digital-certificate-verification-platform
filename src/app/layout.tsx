import type { Metadata } from "next";
import { DynaPuff, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const dynaPuff = DynaPuff({ 
  subsets: ["latin"],
  variable: "--font-dynapuff",
  weight: ["400", "500", "600"],
});

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Certificate Verification Platform",
  description: "Verify digital certificates securely on the Stellar network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className={`${geistSans.variable} ${geistMono.variable} ${dynaPuff.variable} min-h-screen bg-neutral-primary-soft text-body font-sans antialiased`}
      >
        <Navbar />
        <main className="container mx-auto py-4 md:py-6 px-3 md:px-4">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
