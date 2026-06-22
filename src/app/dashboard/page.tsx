"use client";

import { useWalletStore } from "@/store/wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Network, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";

export default function DashboardPage() {
  const { address, connect } = useWalletStore();
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      const horizonServer = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      horizonServer.loadAccount(address)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((acc: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const xlmBalance = acc.balances.find((b: any) => b.asset_type === "native");
          if (xlmBalance) setBalance(xlmBalance.balance);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          console.error("Failed to load account:", err);
          setBalance("0");
        })
        .finally(() => setLoading(false));
    }
  }, [address]);

  if (!address) {
    return (
      <div className="section flex flex-col items-center justify-center min-h-[60vh] space-y-4 rounded-[16px] md:rounded-[32px] border-4 border-border-default mb-8 md:mb-20 mt-3 md:mt-6 p-8 text-center">
        <Wallet className="h-16 w-16 text-body-subtle" />
        <h2 className="text-2xl font-heading font-bold text-heading">Wallet Not Connected</h2>
        <p className="text-body-subtle max-w-xs">Connect your wallet to view the dashboard and manage certificates.</p>
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="section min-h-[80vh] rounded-[16px] md:rounded-[32px] border-4 border-border-default shadow-sticker mb-8 md:mb-20 mt-3 md:mt-6">
      <div className="section-content max-w-5xl mx-auto space-y-8 p-4 md:p-8 py-8 md:py-12">
        <div className="space-y-4">
          <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-[18px] text-body-subtle">Overview of your Stellar wallet and metrics.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-neutral-secondary-soft">
              <CardTitle className="text-[18px] font-heading font-medium">Wallet Address</CardTitle>
              <Wallet className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-[20px] font-bold font-mono text-heading truncate" title={address}>
                {address.slice(0, 8)}...{address.slice(-8)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-neutral-secondary-soft">
              <CardTitle className="text-[18px] font-heading font-medium">XLM Balance</CardTitle>
              <Activity className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-[28px] font-bold text-heading">
                {loading ? "..." : balance} XLM
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-neutral-secondary-soft">
              <CardTitle className="text-[18px] font-heading font-medium">Network</CardTitle>
              <Network className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-[28px] font-bold text-heading">
                {process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
