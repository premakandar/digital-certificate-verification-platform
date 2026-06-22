"use client";

import { useWalletStore } from "@/store/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, ExternalLink, CheckCircle2, XCircle, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Transaction {
  id: string;
  successful: boolean;
  created_at: string;
  hash: string;
  source_account: string;
}

export default function HistoryPage() {
  const { address } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    
    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}/transactions?order=desc&limit=10`);
        const data = await res.json();
        if (data._embedded?.records) {
          setTransactions(data._embedded.records);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [address]);

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
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Clock className="h-8 w-8 animate-pulse text-muted-foreground" />
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <HistoryIcon className="h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-center max-w-md">
                No recent transactions found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    {tx.successful ? (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">Transaction</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                    </span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-2 flex items-center text-sm font-medium"
                    >
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-center border-t pt-6">
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              View Full History on Stellar Expert <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
