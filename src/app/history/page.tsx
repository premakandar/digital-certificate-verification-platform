"use client";

import { useWalletStore } from "@/store/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, ExternalLink, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastTxIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!address) return;
    
    async function fetchHistory(isBackground = false) {
      try {
        if (!isBackground) setLoading(true);
        setIsRefreshing(true);
        const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}/transactions?order=desc&limit=10`);
        const data = await res.json();
        if (data._embedded?.records) {
          const newTxs = data._embedded.records;
          
          // Check for new transactions
          if (isBackground && newTxs.length > 0 && lastTxIdRef.current) {
            const latestTx = newTxs[0];
            if (latestTx.id !== lastTxIdRef.current) {
              toast.success("New on-chain transaction detected!", {
                description: `Tx Hash: ${latestTx.hash.substring(0, 8)}...`,
              });
            }
          }
          
          if (newTxs.length > 0) {
            lastTxIdRef.current = newTxs[0].id;
          }
          
          setTransactions(newTxs);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchHistory();
    
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchHistory(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [address]);

  if (!address) {
    return (
      <div className="section flex flex-col items-center justify-center min-h-[60vh] space-y-4 rounded-[16px] md:rounded-[32px] border-4 border-border-default mb-8 md:mb-20 mt-3 md:mt-6 p-8 text-center">
        <HistoryIcon className="h-16 w-16 text-body-subtle" />
        <h2 className="text-2xl font-heading font-bold text-heading">Wallet Not Connected</h2>
        <p className="text-body-subtle max-w-xs">Connect your wallet to view your transaction history.</p>
      </div>
    );
  }
  return (
    <div className="section min-h-[80vh] rounded-[16px] md:rounded-[32px] border-4 border-border-default shadow-sticker mb-8 md:mb-20 mt-3 md:mt-6">
      <div className="section-content max-w-4xl mx-auto space-y-8 p-4 md:p-8 py-8 md:py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold tracking-tight">Transaction History</h1>
          <p className="text-[18px] text-body-subtle">View your recent contract interactions.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your transactions are recorded on the Stellar Testnet. 
                Auto-refreshing every 10s.
              </CardDescription>
            </div>
            {isRefreshing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                      <span className="text-xs bg-neutral-primary-soft border border-border-default px-2 py-1 rounded font-mono">
                        {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                      </span>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-brand hover:underline ml-2 flex items-center text-sm font-medium"
                      >
                        View <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 flex justify-center border-t border-border-light pt-6">
              <a 
                href={`https://stellar.expert/explorer/testnet/account/${address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost" })}
              >
                View Full History on Stellar Expert <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
