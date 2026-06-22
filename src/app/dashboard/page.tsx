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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wallet className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to view the dashboard.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate" title={address}>
              {address.slice(0, 8)}...{address.slice(-8)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XLM Balance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : balance} XLM
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
