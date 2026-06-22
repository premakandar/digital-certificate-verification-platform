import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

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
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Navbar />
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
