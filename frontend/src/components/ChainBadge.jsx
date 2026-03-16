export default function ChainBadge() {
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sentinel-green/10 border border-sentinel-green/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-green opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-green" />
      </span>
      <span className="text-xs font-mono font-medium text-sentinel-green tracking-wider">
        PASEO LIVE
      </span>
    </div>
  );
}
