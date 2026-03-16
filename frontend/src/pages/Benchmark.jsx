import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { XCircle, CheckCircle2, Zap, Box, Code2 } from "lucide-react";
import GlowCard from "../components/GlowCard";

const chartData = [
  { sigs: "1", evm: 1100000, pvm: 11640 },
  { sigs: "5", evm: 5500000, pvm: 58200 },
  { sigs: "10", evm: 11000000, pvm: 116402 },
  { sigs: "20", evm: 22000000, pvm: 232800 },
  { sigs: "50", evm: 55000000, pvm: 582000 },
  { sigs: "100", evm: 110000000, pvm: 1164000 },
];

function useTypewriter(lines, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let lineIdx = 0;
    let charIdx = 0;
    const buffer = [];

    function tick() {
      if (lineIdx >= lines.length) {
        setDone(true);
        return;
      }
      const line = lines[lineIdx];
      charIdx++;
      buffer[lineIdx] = {
        ...line,
        text: line.text.slice(0, charIdx),
      };
      setDisplayed([...buffer]);

      if (charIdx >= line.text.length) {
        lineIdx++;
        charIdx = 0;
        timeout = setTimeout(tick, 200);
      } else {
        timeout = setTimeout(tick, speed);
      }
    }

    timeout = setTimeout(tick, startDelay);
    return () => clearTimeout(timeout);
  }, []);

  return { displayed, done };
}

function EvmTerminal({ running }) {
  const lines = [
    { text: "Submitting batch of 10 ed25519 signatures...", color: "text-white/70" },
    { text: "Target: NaiveSolidityVerifier.verify(bytes)", color: "text-white/50" },
    { text: "Gas limit: 30,000,000", color: "text-white/50" },
    { text: "Processing...", color: "text-yellow-400" },
    { text: "", color: "" },
    { text: "TRANSACTION REVERTED", color: "text-red-400 font-bold" },
    { text: "Error: OutOfGas — exceeded block gas limit", color: "text-red-400" },
    { text: "Signatures verified: 0/10", color: "text-red-300" },
    { text: "Status: FAILED", color: "text-red-500 font-bold" },
  ];
  const { displayed, done } = useTypewriter(lines, 30, running ? 300 : 99999);

  return (
    <div className="bg-black/80 rounded-xl border border-red-500/20 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-red-500/10 bg-red-500/5">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="font-mono text-[10px] text-red-400/60">evm-verifier</span>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed min-h-[200px]">
        {displayed.map((l, i) => (
          <div key={i} className={l.color || "text-white/70"}>
            {l.text ? `> ${l.text}` : ""}
          </div>
        ))}
        {!running && (
          <span className="text-white/20">Click "Try It" to start</span>
        )}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center"
          >
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-1" />
            <span className="text-red-400 font-bold text-sm">OUT OF GAS</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PvmTerminal({ running }) {
  const lines = [
    { text: "Submitting batch of 10 ed25519 signatures...", color: "text-white/70" },
    { text: "Target: Sentinel.submitTelemetry(bytes)", color: "text-white/50" },
    { text: "Routed to: PVM Engine (Rust / RISC-V)", color: "text-sentinel-cyan" },
    { text: "Verifying ed25519 signatures...", color: "text-yellow-400" },
    { text: "", color: "" },
    { text: "ALL SIGNATURES VALID", color: "text-sentinel-green font-bold" },
    { text: "Gas used: 116,402", color: "text-sentinel-green" },
    { text: "Signatures verified: 10/10", color: "text-sentinel-green" },
    { text: "Status: SUCCESS", color: "text-sentinel-green font-bold" },
  ];
  const { displayed, done } = useTypewriter(lines, 30, running ? 300 : 99999);

  return (
    <div className="bg-black/80 rounded-xl border border-sentinel-green/20 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-sentinel-green/10 bg-sentinel-green/5">
        <div className="w-2 h-2 rounded-full bg-sentinel-green" />
        <span className="font-mono text-[10px] text-sentinel-green/60">pvm-engine</span>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed min-h-[200px]">
        {displayed.map((l, i) => (
          <div key={i} className={l.color || "text-white/70"}>
            {l.text ? `> ${l.text}` : ""}
          </div>
        ))}
        {!running && (
          <span className="text-white/20">Click "Try It" to start</span>
        )}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-lg bg-sentinel-green/10 border border-sentinel-green/20 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-sentinel-green mx-auto mb-1" />
            <span className="text-sentinel-green font-bold text-sm">
              10/10 VERIFIED
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-xs font-mono !bg-sentinel-card !border-sentinel-border">
      <p className="text-white/60 mb-1">{label} signatures</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "evm" ? "EVM" : "PVM"}: {Number(p.value).toLocaleString()} gas
        </p>
      ))}
    </div>
  );
}

export default function Benchmark() {
  const [evmRunning, setEvmRunning] = useState(false);
  const [pvmRunning, setPvmRunning] = useState(false);
  const chartRef = useRef(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-100px" });
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (chartInView) setShowChart(true);
  }, [chartInView]);

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-widest text-sentinel-pink mb-3">
            THE BENCHMARK
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl">
            Why EVM <span className="text-red-400">Can&apos;t</span> Do This
          </h1>
          <p className="mt-4 text-white/40 max-w-xl mx-auto">
            Side-by-side comparison: pure Solidity ed25519 vs Rust on PolkaVM.
            Same signatures, vastly different results.
          </p>
        </motion.div>

        {/* Side-by-side */}
        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-6 items-start mb-24">
          {/* EVM Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="font-display font-bold text-lg text-red-400">
                  Pure Solidity
                </span>
              </div>
              <p className="text-xs text-white/30">No ed25519 precompile available</p>
            </div>
            <EvmTerminal running={evmRunning} />
            <div className="grid grid-cols-2 gap-3 mt-4 text-center font-mono text-xs">
              <div className="glass-sm p-3">
                <p className="text-white/30">Gas Limit</p>
                <p className="text-red-400 font-semibold mt-1">30,000,000</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Gas Used</p>
                <p className="text-red-400 font-semibold mt-1">30,000,000</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Sigs Verified</p>
                <p className="text-red-400 font-semibold mt-1">0</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Status</p>
                <p className="text-red-400 font-bold mt-1">FAILED</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEvmRunning(false);
                setTimeout(() => setEvmRunning(true), 50);
              }}
              className="mt-4 w-full py-2.5 rounded-xl border border-red-400/30 text-red-400 text-sm font-medium hover:bg-red-400/10 transition"
            >
              Try It
            </button>
          </motion.div>

          {/* VS divider */}
          <div className="hidden lg:flex flex-col items-center justify-center pt-16">
            <span className="font-display font-bold text-4xl text-sentinel-pink">
              VS
            </span>
          </div>
          <div className="lg:hidden text-center py-2">
            <span className="font-display font-bold text-2xl text-sentinel-pink">
              VS
            </span>
          </div>

          {/* PVM Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-sentinel-green" />
                <span className="font-display font-bold text-lg text-sentinel-green">
                  Sentinel-PVM
                </span>
              </div>
              <p className="text-xs text-white/30">Native Rust ed25519-dalek on RISC-V</p>
            </div>
            <PvmTerminal running={pvmRunning} />
            <div className="grid grid-cols-2 gap-3 mt-4 text-center font-mono text-xs">
              <div className="glass-sm p-3">
                <p className="text-white/30">Gas Used</p>
                <p className="text-sentinel-green font-semibold mt-1">116,402</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Sigs Verified</p>
                <p className="text-sentinel-green font-semibold mt-1">10</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Time</p>
                <p className="text-sentinel-green font-semibold mt-1">~2s</p>
              </div>
              <div className="glass-sm p-3">
                <p className="text-white/30">Status</p>
                <p className="text-sentinel-green font-bold mt-1">SUCCESS</p>
              </div>
            </div>
            <button
              onClick={() => {
                setPvmRunning(false);
                setTimeout(() => setPvmRunning(true), 50);
              }}
              className="mt-4 w-full py-2.5 rounded-xl border border-sentinel-green/30 text-sentinel-green text-sm font-medium hover:bg-sentinel-green/10 transition"
            >
              Try It
            </button>
          </motion.div>
        </div>

        {/* Chart */}
        <div ref={chartRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={showChart ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-display font-bold text-2xl text-center mb-2">
              Gas Consumption: EVM vs PVM
            </h2>
            <p className="text-center text-white/40 text-sm mb-8">
              EVM costs scale linearly and hit the block limit at ~27 signatures.
              PVM stays flat.
            </p>
            <div className="glass p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="sigs"
                    label={{
                      value: "Signatures",
                      position: "insideBottom",
                      offset: -5,
                      fill: "rgba(255,255,255,0.3)",
                      fontSize: 12,
                    }}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v.toLocaleString()
                    }
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    label={{
                      value: "Gas",
                      angle: -90,
                      position: "insideLeft",
                      fill: "rgba(255,255,255,0.3)",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="evm" name="evm" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#ef4444" fillOpacity={0.7} />
                    ))}
                  </Bar>
                  <Bar dataKey="pvm" name="pvm" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#00FF94" fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500/70" />
                  <span className="text-white/50">EVM (Estimated)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-sentinel-green/80" />
                  <span className="text-white/50">PVM (Measured)</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: Zap,
              title: "95× Gas Reduction",
              desc: "PVM verifies ed25519 signatures at a fraction of the cost, unlocking batch verification for DePIN at scale.",
            },
            {
              icon: Code2,
              title: "Full Rust Crypto Ecosystem",
              desc: "Access any Rust cryptographic crate — ed25519, sr25519, BLS, zk-SNARKs — without EVM precompile dependencies.",
            },
            {
              icon: Box,
              title: "Cross-VM Architecture",
              desc: "Solidity contracts call Rust coprocessors natively via pallet-revive. No bridges, no oracles, no trust assumptions.",
            },
          ].map((item, i) => (
            <GlowCard key={i} glow="green">
              <item.icon className="w-7 h-7 text-sentinel-green mb-3" />
              <h3 className="font-display font-semibold text-base mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {item.desc}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
}
