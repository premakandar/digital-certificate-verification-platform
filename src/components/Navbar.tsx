"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWalletStore, initWalletKit } from "@/store/wallet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Activity, FileCheck, History, LayoutDashboard, Menu, X, Wallet } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app", label: "Certificates", icon: FileCheck },
  { href: "/history", label: "History", icon: History },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Navbar() {
  const { address, connect, disconnect } = useWalletStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    initWalletKit();
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="border-b-[4px] border-border-default bg-panel sticky top-0 z-50">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <FileCheck className="h-7 w-7 md:h-8 md:w-8 text-brand" />
          <span className="font-heading text-[20px] md:text-[24px] font-bold text-heading">CertVerify</span>
        </Link>

        {/* Desktop Nav */}
        {mounted && (
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center text-[15px] font-medium transition-colors ${
                  pathname === href
                    ? "text-heading"
                    : "text-body-subtle hover:text-heading"
                }`}
              >
                <Icon className="mr-1.5 h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {mounted && address ? (
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-[12px] md:text-[14px] font-mono font-medium text-heading bg-neutral-secondary-soft border-[2px] border-border-default px-2 md:px-4 py-1.5 md:py-2 rounded-lg hidden sm:inline-block">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Button variant="tertiary" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : mounted ? (
            <Button size="sm" onClick={connect}>
              <Wallet className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </Button>
          ) : null}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border-2 border-border-default bg-neutral-secondary-soft text-heading"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && mounted && (
        <div className="md:hidden border-t-2 border-border-default bg-panel px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                pathname === href
                  ? "bg-neutral-secondary-soft text-heading"
                  : "text-body-subtle hover:bg-neutral-secondary-soft hover:text-heading"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          {/* Mobile wallet address */}
          {address && (
            <div className="pt-3 mt-3 border-t border-border-light">
              <p className="text-[12px] font-mono text-body-subtle px-3 pb-1">Connected wallet</p>
              <p className="text-[13px] font-mono font-medium text-heading px-3">
                {address.slice(0, 10)}...{address.slice(-6)}
              </p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
