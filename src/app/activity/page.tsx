"use client";

import { useEffect, useState } from "react";
import { AppEvent, fetchContractEvents } from "@/lib/events";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, Activity, ShieldCheck, ShieldOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivityPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    const fetched = await fetchContractEvents();
    setEvents(fetched);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section min-h-[80vh] rounded-[16px] md:rounded-[32px] border-4 border-border-default shadow-sticker mb-8 md:mb-20 mt-3 md:mt-6">
      <div className="section-content max-w-4xl mx-auto space-y-8 p-4 md:p-8 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold tracking-tight">Activity Feed</h1>
            <p className="text-[18px] text-body-subtle">Real-time smart contract events from the Stellar network.</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-sm text-body-subtle hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <Button onClick={loadEvents} variant="secondary" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-sm text-body-subtle">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
          </span>
          Auto-refreshing every 15 seconds
        </div>

        {/* Events Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Live feed of certificates issued and revoked on-chain.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && events.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 gap-4 text-body-subtle">
                <Loader2 className="h-10 w-10 animate-spin text-brand" />
                <p className="text-sm">Fetching events from Stellar network...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-secondary-soft border-2 border-border-default flex items-center justify-center">
                  <Activity className="h-8 w-8 text-body-subtle" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-heading text-lg">No events yet</p>
                  <p className="text-sm text-body-subtle mt-1 max-w-xs">
                    Events will appear here when certificates are issued or revoked on the Stellar network.
                  </p>
                </div>
                <Button onClick={loadEvents} variant="secondary" size="sm" disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check again
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Certificate Hash</TableHead>
                    <TableHead>Ledger</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          event.type === 'Certificate Issued'
                            ? 'bg-success-soft border-success/30 text-success'
                            : 'bg-danger-soft border-danger/30 text-danger'
                        }`}>
                          {event.type === 'Certificate Issued'
                            ? <ShieldCheck className="h-3 w-3" />
                            : <ShieldOff className="h-3 w-3" />
                          }
                          {event.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-body-subtle">
                        {event.hash.slice(0, 16)}...
                      </TableCell>
                      <TableCell className="text-body-subtle">
                        <span className="inline-flex items-center gap-1">
                          <Zap className="h-3 w-3 text-brand" />
                          {event.ledger}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-body-subtle text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
