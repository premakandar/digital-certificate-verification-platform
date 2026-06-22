"use client";

import { useWalletStore } from "@/store/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { address } = useWalletStore();

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <HistoryIcon className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to view your transaction history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">View your recent contract interactions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your transactions are recorded on the Stellar Testnet. 
            For a complete history, please view your account on the Stellar Explorer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <HistoryIcon className="h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-center max-w-md">
            Local transaction tracking is limited in this version. You can view all your on-chain activity directly on Stellar Expert.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${address}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on Stellar Expert <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
