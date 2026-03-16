import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function TerminalLog({ lines = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  return (
    <div className="bg-black/60 border border-sentinel-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-sentinel-border bg-white/[0.02]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[10px] font-mono text-white/30">
          sentinel-pvm terminal
        </span>
      </div>
      <div className="h-48 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
        {lines.length === 0 && (
          <span className="text-white/20">Waiting for events...</span>
        )}
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2"
          >
            <span className="text-sentinel-green/60 select-none">{">"}</span>
            <span className={line.color || "text-sentinel-green/90"}>
              {line.text}
            </span>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
