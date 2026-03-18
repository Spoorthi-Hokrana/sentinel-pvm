import { useState, useEffect } from 'react';

// Mock data for now — replace with actual contract reads when needed
export function useSentinel() {
  return {
    pvmEngine: '0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0',
    isConnected: false,
  };
}

export function useIsVerified(hash) {
  return { data: false, isLoading: false };
}

export function useVerifiedBatches(address) {
  return { data: [], isLoading: false };
}