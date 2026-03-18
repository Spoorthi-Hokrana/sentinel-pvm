import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../config/api';

export function useAgent() {
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const pollRef = useRef(null);
  const logTimestampRef = useRef(0);
  const mountedRef = useRef(true);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Health check on mount + interval
  useEffect(() => {
    const check = async () => {
      const online = await api.healthCheck();
      if (!mountedRef.current) return;
      setBackendOnline(online);
      setStatus((prev) => {
        if (!online && prev === 'idle') return 'offline';
        if (online && prev === 'offline') return 'idle';
        return prev;
      });
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  // Polling function
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      if (!mountedRef.current) {
        clearInterval(pollRef.current);
        return;
      }

      try {
        const statusData = await api.getStatus();
        const logData = await api.getLogs(logTimestampRef.current);

        if (!mountedRef.current) return;

        // Append new logs
        if (logData.logs && logData.logs.length > 0) {
          setLogs((prev) => [...prev, ...logData.logs]);
          const lastLog = logData.logs[logData.logs.length - 1];
          logTimestampRef.current = lastLog.timestamp;
        }

        // Check if finished
        if (!statusData.running && statusData.lastResult) {
          setResult(statusData.lastResult);
          setStatus(statusData.lastResult.success ? 'success' : 'error');
          
          // Get any remaining logs
          const finalLogs = await api.getLogs(logTimestampRef.current);
          if (finalLogs.logs && finalLogs.logs.length > 0 && mountedRef.current) {
            setLogs((prev) => [...prev, ...finalLogs.logs]);
          }

          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 1000);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  // Run agent
  const runAgent = useCallback(async () => {
    if (status === 'running' || status === 'starting') return;
    if (!backendOnline) {
      setStatus('offline');
      return;
    }

    setStatus('starting');
    setLogs([]);
    setResult(null);
    logTimestampRef.current = 0;

    try {
      const response = await api.runAgent();

      if (!mountedRef.current) return;

      if (response.success) {
        setStatus('running');
        startPolling();
      } else {
        setStatus('error');
        setResult({ 
          success: false, 
          error: response.error || 'Failed to start agent' 
        });
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setStatus('error');
      setResult({ 
        success: false, 
        error: 'Cannot connect to backend. Is the API server running?' 
      });
    }
  }, [status, backendOnline, startPolling]);

  // Reset
  const reset = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setStatus(backendOnline ? 'idle' : 'offline');
    setLogs([]);
    setResult(null);
    logTimestampRef.current = 0;
  }, [backendOnline]);

  return {
    status,
    logs,
    result,
    backendOnline,
    runAgent,
    reset,
    isRunning: status === 'running' || status === 'starting',
  };
}
