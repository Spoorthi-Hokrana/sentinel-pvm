import { motion } from "framer-motion";

const glowMap = {
  green: "hover:border-sentinel-green/30 hover:shadow-[0_0_30px_rgba(0,255,148,0.06)]",
  pink: "hover:border-sentinel-pink/30 hover:shadow-[0_0_30px_rgba(230,0,122,0.06)]",
  cyan: "hover:border-sentinel-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,255,0.06)]",
  none: "",
};

export default function GlowCard({
  children,
  className = "",
  glow = "green",
  animate = true,
  ...props
}) {
  const Wrapper = animate ? motion.div : "div";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <Wrapper
      className={`
        backdrop-blur-xl bg-white/[0.03] border border-white/10
        rounded-2xl p-6 transition-all duration-300
        ${glowMap[glow] || ""}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
}
