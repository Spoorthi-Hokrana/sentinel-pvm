import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Cpu,
  Zap,
  ArrowRight,
  ExternalLink,
  Fingerprint,
  Leaf,
  Radio,
  CheckCircle2,
} from "lucide-react";
import GlowCard from "../components/GlowCard";
import StatBadge from "../components/StatBadge";
import { EXPLORER } from "../config/chain";
import { SENTINEL_ADDRESS } from "../config/contracts";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const stagger = {
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true },
};

export default function Landing() {
  return (
    <div className="relative">
      {/* ── Hero ───────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hero-glow" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sentinel-pink/30 bg-sentinel-pink/5 mb-8"
          >
            <span className="font-mono text-[11px] tracking-widest text-sentinel-pink">
              POLKADOT SOLIDITY HACKATHON — TRACK 2
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
          >
            Cryptographic Trust
            <br />
            <span className="text-gradient-green">for the Physical World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            Rust-powered ed25519 batch verification running on PolkaVM,
            called directly from Solidity. The first DePIN cryptographic
            coprocessor on Polkadot Hub.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="px-7 py-3 rounded-xl bg-sentinel-green text-sentinel-bg font-semibold text-sm flex items-center gap-2 hover:brightness-110 transition"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`${EXPLORER}/address/${SENTINEL_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl border border-white/20 text-white/80 font-medium text-sm flex items-center gap-2 hover:border-white/40 transition"
            >
              View on Explorer <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-14 flex flex-wrap justify-center gap-4"
          >
            <StatBadge value={10} label="Signatures Verified Per Batch" />
            <StatBadge value={116402} label="Gas Used (PVM)" suffix="" />
            <StatBadge value="95×" label="More Efficient Than EVM" />
          </motion.div>
        </div>
      </section>

      {/* ── The Problem ────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest text-sentinel-pink mb-3">
              THE PROBLEM
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              EVM Was Never Built for This
            </h2>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: ShieldAlert,
                title: "No Ed25519 Precompile",
                desc: "EVM has no native support for ed25519 signatures. Implementing it in Solidity costs ~1.1M gas per verification — making batch verification impossible.",
              },
              {
                icon: Cpu,
                title: "30M Gas Block Limit",
                desc: "Ethereum's block gas limit caps out at 30M. A single batch of 30 ed25519 signatures would consume the entire block.",
              },
              {
                icon: Zap,
                title: "No Crypto Extensibility",
                desc: "Adding new cryptographic primitives to the EVM requires hard forks. DePIN networks can't wait years for governance to add ed25519.",
              },
            ].map((item, i) => (
              <GlowCard key={i} glow="pink">
                <item.icon className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </GlowCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── The Solution (Architecture) ────────── */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest text-sentinel-green mb-3">
              THE SOLUTION
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Cross-VM Cryptographic Coprocessor
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0"
          >
            {[
              {
                icon: Radio,
                label: "IoT Agent",
                sub: "Python / ed25519",
                color: "text-sentinel-cyan",
                bg: "bg-sentinel-cyan/10 border-sentinel-cyan/20",
              },
              null,
              {
                icon: Fingerprint,
                label: "Sentinel.sol",
                sub: "Solidity Gateway",
                color: "text-sentinel-pink",
                bg: "bg-sentinel-pink/10 border-sentinel-pink/20",
              },
              null,
              {
                icon: Cpu,
                label: "PVM Engine",
                sub: "Rust / RISC-V",
                color: "text-sentinel-green",
                bg: "bg-sentinel-green/10 border-sentinel-green/20",
              },
              null,
              {
                icon: CheckCircle2,
                label: "Verified ✓",
                sub: "On-chain result",
                color: "text-sentinel-green",
                bg: "bg-sentinel-green/10 border-sentinel-green/20",
              },
            ].map((node, i) =>
              node === null ? (
                <div
                  key={i}
                  className="hidden md:flex items-center text-white/20 px-2"
                >
                  <svg width="40" height="12" viewBox="0 0 40 12">
                    <line
                      x1="0"
                      y1="6"
                      x2="30"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <path
                      d="M28 2 L36 6 L28 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border ${node.bg} min-w-[130px]`}
                >
                  <node.icon className={`w-7 h-7 ${node.color}`} />
                  <span className="font-display font-semibold text-sm text-white/90">
                    {node.label}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">
                    {node.sub}
                  </span>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest text-sentinel-cyan mb-3">
              HOW IT WORKS
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Four Steps to Verified Telemetry
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Leaf,
                title: "Collect",
                desc: "IoT sensors gather soil moisture, pH, temperature, and irrigation data across farm zones.",
              },
              {
                step: "02",
                icon: Fingerprint,
                title: "Sign",
                desc: "The AI farming agent signs each reading with ed25519, producing a cryptographic attestation.",
              },
              {
                step: "03",
                icon: Cpu,
                title: "Verify",
                desc: "The binary payload is submitted to Sentinel.sol, which routes it to the Rust PVM engine for native verification.",
              },
              {
                step: "04",
                icon: CheckCircle2,
                title: "Store",
                desc: "Verified batch hashes are stored on-chain, creating an immutable audit trail for DePIN networks.",
              },
            ].map((item, i) => (
              <GlowCard key={i} glow="cyan">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-3xl font-bold text-white/10">
                    {item.step}
                  </span>
                  <item.icon className="w-5 h-5 text-sentinel-cyan" />
                </div>
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
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-28 px-4 text-center">
        <motion.div {...fadeUp}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            See It In Action
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Explore live on-chain verification data or see the EVM vs PVM
            benchmark comparison.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/benchmark"
              className="px-7 py-3 rounded-xl bg-sentinel-green text-sentinel-bg font-semibold text-sm hover:brightness-110 transition"
            >
              View Benchmark
            </Link>
            <Link
              to="/stats"
              className="px-7 py-3 rounded-xl border border-white/20 text-white/80 font-medium text-sm hover:border-white/40 transition"
            >
              On-Chain Stats
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
