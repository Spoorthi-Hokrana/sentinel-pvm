import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !end) return;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return { count, ref };
}

export default function StatBadge({ label, value, suffix = "", prefix = "" }) {
  const { count, ref } = useCountUp(typeof value === "number" ? value : 0);
  const display = typeof value === "number" ? `${prefix}${count.toLocaleString()}${suffix}` : value;

  return (
    <motion.div
      ref={ref}
      className="glass-sm px-5 py-3 flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-mono text-xl font-semibold text-sentinel-green">
        {display}
      </span>
      <span className="text-xs text-white/50 text-center">{label}</span>
    </motion.div>
  );
}
