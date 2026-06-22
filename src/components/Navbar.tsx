"use client";

import Link from "next/link";
import { useWalletStore } from "@/store/wallet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Activity, FileCheck, History, LayoutDashboard, Wallet } from "lucide-react";

export function Navbar() {
  const { address, connect, disconnect } = useWalletStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">CertVerify</span>
          </Link>
          {mounted && (
            <nav className="hidden gap-6 md:flex">
              <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Link>
              <Link href="/app" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <FileCheck className="mr-2 h-4 w-4" /> Certificates
              </Link>
              <Link href="/history" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <History className="mr-2 h-4 w-4" /> History
              </Link>
              <Link href="/activity" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <Activity className="mr-2 h-4 w-4" /> Activity
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {mounted && address ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-md hidden sm:inline-block">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connect}>
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
