const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  runAgent: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/run-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend: ' + err.message };
    }
  },

  getStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/agent-status`);
      return await res.json();
    } catch (err) {
      return { running: false, lastResult: null };
    }
  },

  getLogs: async (since = 0) => {
    try {
      const res = await fetch(`${API_BASE}/api/agent-logs?since=${since}`);
      return await res.json();
    } catch (err) {
      return { running: false, logs: [], totalLogs: 0 };
    }
  },

  healthCheck: async () => {
    try {
      // Use setTimeout fallback if AbortSignal.timeout isn't supported in all browsers yet
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(`${API_BASE}/api/health`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },
};
