import { useState, useEffect, useCallback } from "react";
import { publicClient } from "../config/chain";
import { SENTINEL_ADDRESS, SENTINEL_ABI } from "../config/contracts";

export function useIsVerified(batchHash) {
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchHash) {
      setLoading(false);
      return;
    }
    setLoading(true);
    publicClient
      .readContract({
        address: SENTINEL_ADDRESS,
        abi: SENTINEL_ABI,
        functionName: "isVerified",
        args: [batchHash],
      })
      .then(setVerified)
      .catch(() => setVerified(null))
      .finally(() => setLoading(false));
  }, [batchHash]);

  return { verified, loading };
}

export function useVerifiedBatches(agentAddress) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!agentAddress) return;
    setLoading(true);
    publicClient
      .readContract({
        address: SENTINEL_ADDRESS,
        abi: SENTINEL_ABI,
        functionName: "getVerifiedBatches",
        args: [agentAddress],
      })
      .then(setBatches)
      .catch(() => setBatches([]))
      .finally(() => setLoading(false));
  }, [agentAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { batches, loading, refetch };
}

export function usePvmEngine() {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    publicClient
      .readContract({
        address: SENTINEL_ADDRESS,
        abi: SENTINEL_ABI,
        functionName: "pvmEngine",
      })
      .then(setAddress)
      .catch(() => {});
  }, []);

  return address;
}
