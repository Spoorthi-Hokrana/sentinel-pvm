import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, Users, Flame, Hash, ExternalLink } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import StatBadge from "../components/StatBadge";
import GlowCard from "../components/GlowCard";
import { EXPLORER } from "../config/chain";

const EVM_GAS_PER_SIG = 1_100_000;
const PVM_GAS_PER_SIG = 11_640;
const SIGS_PER_BATCH = 10;

function KpiCard({ icon: Icon, label, value, color = "text-sentinel-green" }) {
  return (
    <GlowCard glow="green" className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.04] ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="font-mono text-2xl font-bold text-white mt-0.5">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </GlowCard>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={`bg-white/[0.03] animate-pulse rounded-xl ${className}`} />
  );
}

function StatsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-xs font-mono !bg-sentinel-card !border-sentinel-border">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-sentinel-green">
        Verifications: {payload[0]?.value}
      </p>
    </div>
  );
}

export default function Stats() {
  const { events, loading } = useEvents(15000);

  const stats = useMemo(() => {
    const verified = events.filter((e) => e.type === "verified");
    const uniqueAgents = new Set(verified.map((e) => e.agent)).size;
    const totalSigs = verified.length * SIGS_PER_BATCH;
    const gasSavedPerBatch =
      SIGS_PER_BATCH * EVM_GAS_PER_SIG - SIGS_PER_BATCH * PVM_GAS_PER_SIG;
    const totalGasSaved = verified.length * gasSavedPerBatch;

    return {
      totalBatches: verified.length,
      totalSigs,
      totalGasSaved,
      uniqueAgents,
    };
  }, [events]);

  const chartData = useMemo(() => {
    const verified = events
      .filter((e) => e.type === "verified" && e.timestamp)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (verified.length === 0) return [];

    const buckets = {};
    verified.forEach((e) => {
      const date = new Date(e.timestamp * 1000);
      const key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets).map(([time, count]) => ({
      time,
      verifications: count,
    }));
  }, [events]);

  const verifiedEvents = events.filter((e) => e.type === "verified");

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display font-bold text-3xl">On-Chain Stats</h1>
          <p className="text-white/40 text-sm mt-1">
            Live analytics from Sentinel-PVM on Paseo Asset Hub
          </p>
        </motion.div>

        {/* KPIs */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            <KpiCard
              icon={Shield}
              label="Total Batches Verified"
              value={stats.totalBatches}
            />
            <KpiCard
              icon={Hash}
              label="Total Signatures Verified"
              value={stats.totalSigs}
            />
            <KpiCard
              icon={Flame}
              label="Gas Saved vs EVM"
              value={stats.totalGasSaved}
              color="text-sentinel-cyan"
            />
            <KpiCard
              icon={Users}
              label="Unique Agents"
              value={stats.uniqueAgents}
              color="text-sentinel-pink"
            />
          </motion.div>
        )}

        {/* Chart */}
        <GlowCard glow="green" className="mb-10">
          <h3 className="font-display font-semibold text-sm text-white/60 mb-4">
            VERIFICATIONS OVER TIME
          </h3>
          {loading ? (
            <Skeleton className="h-64" />
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-white/20 text-sm">
              No verification data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  allowDecimals={false}
                />
                <Tooltip content={<StatsTooltip />} />
                <Line
                  type="monotone"
                  dataKey="verifications"
                  stroke="#00FF94"
                  strokeWidth={2}
                  dot={{ fill: "#00FF94", r: 4 }}
                  activeDot={{ r: 6, fill: "#00FF94" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </GlowCard>

        {/* Tx Table */}
        <GlowCard glow="none">
          <h3 className="font-display font-semibold text-sm text-white/60 mb-4">
            RECENT TRANSACTIONS
          </h3>
          {loading ? (
            <Skeleton className="h-48" />
          ) : verifiedEvents.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">
              No transactions yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-white/30 border-b border-white/5">
                    <th className="text-left py-2 pr-4 font-medium">Tx Hash</th>
                    <th className="text-left py-2 pr-4 font-medium">Agent</th>
                    <th className="text-left py-2 pr-4 font-medium">Block</th>
                    <th className="text-left py-2 pr-4 font-medium">Batch Hash</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedEvents.slice(0, 15).map((e, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition"
                    >
                      <td className="py-2.5 pr-4">
                        <a
                          href={`${EXPLORER}/tx/${e.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sentinel-cyan hover:underline flex items-center gap-1"
                        >
                          {e.txHash?.slice(0, 14)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-white/60">
                        {e.agent?.slice(0, 10)}...
                      </td>
                      <td className="py-2.5 pr-4 text-white/60">
                        {e.blockNumber?.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 text-white/40">
                        {e.batchHash?.slice(0, 14)}...
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-sentinel-green/10 text-sentinel-green text-[10px] font-medium">
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
