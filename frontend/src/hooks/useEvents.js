import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";
import { publicClient } from "../config/chain";
import { SENTINEL_ADDRESS } from "../config/contracts";

const VERIFIED_EVENT = parseAbiItem(
  "event TelemetryVerified(address indexed agent, bytes32 batchHash, uint256 timestamp)"
);
const REJECTED_EVENT = parseAbiItem(
  "event TelemetryRejected(address indexed agent, bytes32 batchHash)"
);

export function useEvents(pollInterval = 15000) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const blockNumber = await publicClient.getBlockNumber();
        const fromBlock = blockNumber > 10000n ? blockNumber - 10000n : 0n;

        const [verified, rejected] = await Promise.all([
          publicClient.getLogs({
            address: SENTINEL_ADDRESS,
            event: VERIFIED_EVENT,
            fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: SENTINEL_ADDRESS,
            event: REJECTED_EVENT,
            fromBlock,
            toBlock: "latest",
          }),
        ]);

        if (cancelled) return;

        const all = [
          ...verified.map((log) => ({
            type: "verified",
            agent: log.args.agent,
            batchHash: log.args.batchHash,
            timestamp: Number(log.args.timestamp),
            blockNumber: Number(log.blockNumber),
            txHash: log.transactionHash,
          })),
          ...rejected.map((log) => ({
            type: "rejected",
            agent: log.args.agent,
            batchHash: log.args.batchHash,
            timestamp: null,
            blockNumber: Number(log.blockNumber),
            txHash: log.transactionHash,
          })),
        ].sort((a, b) => b.blockNumber - a.blockNumber);

        setEvents(all);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvents();
    const id = setInterval(fetchEvents, pollInterval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollInterval]);

  return { events, loading, error };
}
