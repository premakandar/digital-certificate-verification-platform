"use client";

import { useEffect, useState } from "react";
import { AppEvent, fetchContractEvents } from "@/lib/events";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivityPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const fetched = await fetchContractEvents();
    setEvents(fetched);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    // Poll every 15 seconds for new events
    const interval = setInterval(loadEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
          <p className="text-muted-foreground">Real-time smart contract events from the Stellar network.</p>
        </div>
        <Button onClick={loadEvents} variant="outline" size="icon" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Live feed of certificates issued and revoked.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && events.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No recent events found.
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.type === 'Certificate Issued' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {event.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{event.hash.slice(0, 16)}...</TableCell>
                    <TableCell>{event.ledger}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
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
  );
}
