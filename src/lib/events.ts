import { server, contractId } from "./stellar";
import { scValToNative, xdr } from "@stellar/stellar-sdk";

export interface AppEvent {
  id: string;
  type: string;
  hash: string;
  timestamp: string;
  ledger: number;
}

export async function fetchContractEvents(): Promise<AppEvent[]> {
  try {
    // Get latest ledger to calculate start ledger (e.g. last 1000 ledgers)
    const latestLedgerResponse = await server.getLatestLedger();
    const startLedger = Math.max(1, latestLedgerResponse.sequence - 1000);

    const response = await server.getEvents({
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [contractId],
        },
      ],
      limit: 50,
    });

    const parsedEvents: AppEvent[] = response.events.map((event) => {
      let type = "Unknown";
      let hash = "";

      if (event.topic.length > 0) {
        // First topic is usually the event type symbol
        const typeScVal = event.topic[0];
        try {
          type = scValToNative(typeScVal);
        } catch (e) {
          console.error("Failed to parse topic symbol:", e);
        }
      }

      if (event.topic.length > 1) {
        const hashScVal = event.topic[1];
        try {
          hash = scValToNative(hashScVal);
        } catch (e) {
          console.error("Failed to parse topic hash:", e);
        }
      }

      return {
        id: event.id,
        type: type === "issued" ? "Certificate Issued" : type === "revoked" ? "Certificate Revoked" : type,
        hash,
        timestamp: event.ledgerClosedAt,
        ledger: event.ledger,
      };
    });

    return parsedEvents.reverse(); // Newest first
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
