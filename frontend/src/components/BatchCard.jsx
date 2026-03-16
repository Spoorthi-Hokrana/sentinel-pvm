import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { EXPLORER } from "../config/chain";

function timeAgo(ts) {
  if (!ts) return "—";
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function BatchCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const isVerified = event.type === "verified";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-sm overflow-hidden cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {isVerified ? (
            <CheckCircle2 className="w-5 h-5 text-sentinel-green shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-mono text-sm text-white/90 truncate">
              {event.batchHash?.slice(0, 10)}...{event.batchHash?.slice(-8)}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(event.timestamp)}
              </span>
              <span>Block {event.blockNumber?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full ${
              isVerified
                ? "bg-sentinel-green/10 text-sentinel-green"
                : "bg-red-400/10 text-red-400"
            }`}
          >
            {isVerified ? "VERIFIED ✓" : "REJECTED ✗"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-white/30 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5"
          >
            <div className="p-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/30">Agent</span>
                <p className="font-mono text-white/70 mt-0.5 truncate">
                  {event.agent}
                </p>
              </div>
              <div>
                <span className="text-white/30">Tx Hash</span>
                <a
                  href={`${EXPLORER}/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-sentinel-cyan hover:underline mt-0.5 block truncate"
                >
                  {event.txHash?.slice(0, 16)}...
                </a>
              </div>
              <div>
                <span className="text-white/30">Batch Hash</span>
                <p className="font-mono text-white/70 mt-0.5 truncate">
                  {event.batchHash}
                </p>
              </div>
              {event.timestamp && (
                <div>
                  <span className="text-white/30">Verified At</span>
                  <p className="font-mono text-white/70 mt-0.5">
                    {new Date(event.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
