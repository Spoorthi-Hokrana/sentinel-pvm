import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Grid3x3, Radio, PlayCircle, Loader2 } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import BatchCard from "../components/BatchCard";
import TerminalLog from "../components/TerminalLog";
import GlowCard from "../components/GlowCard";

const ZONES = ["zone_A", "zone_B", "zone_C", "zone_D"];

function Skeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-xl bg-white/[0.03] animate-pulse"
        />
      ))}
    </div>
  );
}

function FarmGrid({ events }) {
  const zoneStatus = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const map = {};
    ZONES.forEach((z) => (map[z] = "none"));

    events.forEach((e) => {
      if (e.type !== "verified") return;
      ZONES.forEach((z) => {
        const age = now - (e.timestamp || 0);
        if (age < 300 && map[z] !== "fresh") map[z] = "fresh";
        else if (age < 600 && map[z] === "none") map[z] = "stale";
      });
    });

    if (events.some((e) => e.type === "rejected")) {
      map[ZONES[3]] = "rejected";
    }

    return map;
  }, [events]);

  const colorMap = {
    fresh: "bg-sentinel-green/20 border-sentinel-green/40 text-sentinel-green",
    stale: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
    rejected: "bg-red-500/15 border-red-500/30 text-red-400",
    none: "bg-white/[0.02] border-white/10 text-white/20",
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {ZONES.map((zone, i) => {
        const status = zoneStatus[zone] || "none";
        return (
          <div
            key={i}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono transition-colors duration-500 ${colorMap[status]}`}
          >
            <span className="font-semibold">{zone.replace("_", " ").toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { events, loading } = useEvents(15000);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  const runAgent = async () => {
    setIsAgentRunning(true);
    setAgentLogs([{ text: "Starting Sentinel-PVM Agent...", color: "text-white/60" }]);
    
    try {
      const res = await fetch('/api/run-agent', { method: 'POST' });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(Boolean);
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'stdout' || data.type === 'stderr') {
              setAgentLogs(prev => [...prev, { 
                text: data.msg.trim(), 
                color: data.msg.includes('✅') || data.msg.includes('green') ? 'text-sentinel-green' : 
                       data.msg.includes('✗') || data.msg.includes('red') ? 'text-red-400' : 
                       'text-white/80'
              }].slice(-20));
            } else if (data.type === 'done') {
              setIsAgentRunning(false);
              setAgentLogs(prev => [...prev, { text: `[Process Exited]`, color: 'text-white/40' }]);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setAgentLogs(prev => [...prev, { text: `Failed to connect to Local Backend API`, color: 'text-red-500' }]);
      setIsAgentRunning(false);
    }
  };

  const terminalLines = useMemo(() => {
    return events.slice(0, 20).map((e) => ({
      text: `${e.agent?.slice(0, 8)}... ${
        e.type === "verified" ? "→ VERIFIED" : "→ REJECTED"
      } in block ${e.blockNumber?.toLocaleString() || "?"}`,
      color:
        e.type === "verified" ? "text-sentinel-green/80" : "text-red-400/80",
    }));
  }, [events]);

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-3xl">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">
            Live telemetry verification feed from Paseo Asset Hub
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Left: Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sentinel-green" />
                </span>
                <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sentinel-green" />
                  LIVE TELEMETRY FEED
                </h2>
              </div>

              <button
                onClick={runAgent}
                disabled={isAgentRunning}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 active:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-lg text-sm font-medium transition-all"
              >
                {isAgentRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
                {isAgentRunning ? "Agent Running..." : "Run Python Agent"}
              </button>
            </div>

            {loading ? (
              <Skeleton />
            ) : events.length === 0 ? (
              <GlowCard glow="none" className="text-center py-12">
                <Radio className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">
                  No events yet. Click "Run Python Agent" to submit telemetry batches.
                </p>
              </GlowCard>
            ) : (
              <div className="space-y-3">
                {events.map((e, i) => (
                  <BatchCard key={e.txHash + i} event={e} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Grid + Terminal */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-semibold text-sm text-white/60 mb-3 flex items-center gap-2">
                <Grid3x3 className="w-4 h-4" />
                FARM ZONE GRID
              </h3>
              <GlowCard glow="green" animate={false} className="p-4">
                <FarmGrid events={events} />
                <div className="flex gap-4 mt-3 text-[10px] text-white/40 justify-center">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-sentinel-green/40" />
                    Recent
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-yellow-500/40" />
                    Stale
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-red-500/40" />
                    Rejected
                  </span>
                </div>
              </GlowCard>
            </div>

            <div>
              <h3 className="font-display font-semibold text-sm text-white/60 mb-3">
                {isAgentRunning || agentLogs.length > 0 ? "AGENT LOGS" : "TRANSACTION LOG"}
              </h3>
              <TerminalLog lines={agentLogs.length > 0 ? agentLogs : terminalLines} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
