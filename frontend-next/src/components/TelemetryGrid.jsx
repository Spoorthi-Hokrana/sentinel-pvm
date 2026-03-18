import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const EMOJIS = ['💧', '🧪', '🌡️', '🚿'];
const ZONES = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'];
const FARMERS = Array.from({ length: 10 }, (_, i) => ({
    id: `F-${String(i + 1).padStart(2, '0')}`,
    emoji: EMOJIS[i % EMOJIS.length],
    zone: ZONES[i % ZONES.length],
}));

export default function TelemetryGrid({ logs, isRunning }) {
    // Calculate global status purely from logs to wire state machines correctly
    const hasConfirmed = logs.some(l => l.includes('Transaction confirmed'));
    const hasError = logs.some(l => l.toLowerCase().includes('error') || l.toLowerCase().includes('rejected'));
    
    // Track individual tile statuses for staggering
    const [tileStates, setTileStates] = useState(Array(10).fill('idle'));
    
    useEffect(() => {
        if (!isRunning && logs.length === 0) {
            setTileStates(Array(10).fill('idle'));
        } else if (isRunning && !hasConfirmed && !hasError) {
            setTileStates(Array(10).fill('signing'));
        } else if (hasConfirmed) {
            // Stagger cascade into "verified" status
            FARMERS.forEach((_, i) => {
                setTimeout(() => {
                    setTileStates(prev => {
                        const next = [...prev];
                        next[i] = 'verified';
                        return next;
                    });
                }, i * 150);
            });
        } else if (hasError) {
             setTileStates(Array(10).fill('rejected'));
        }
    }, [isRunning, hasConfirmed, hasError, logs.length]);

    const verifiedCount = tileStates.filter(s => s === 'verified').length;
    const signingCount = tileStates.filter(s => s === 'signing').length;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:px-6 md:py-5 border-b border-gray-100">
                <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                    Telemetry Batch · 10 Entries
                </span>
                <div className="flex items-center gap-2">
                    {signingCount > 0 && (
                        <div className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-mono font-medium border border-amber-200/50 transition-all">
                            {signingCount} SIGNING
                        </div>
                    )}
                    {verifiedCount > 0 && (
                        <div className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px] font-mono font-medium border border-green-200/50 transition-all">
                            {verifiedCount} VERIFIED
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 md:p-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
                {FARMERS.map((farmer, i) => {
                    const status = tileStates[i];
                    return <Tile key={farmer.id} farmer={farmer} status={status} />;
                })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"/><span className="text-[9px] font-mono text-gray-400 uppercase">Idle</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"/><span className="text-[9px] font-mono text-gray-400 uppercase">Signing</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/><span className="text-[9px] font-mono text-gray-400 uppercase">Verified</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/><span className="text-[9px] font-mono text-gray-400 uppercase">Rejected</span></div>
                </div>
                <span className="font-mono text-[10px] text-gray-400">
                    ed25519 · Paseo Testnet · PVM
                </span>
            </div>
        </div>
    );
}

function Tile({ farmer, status }) {
    const baseStyle = "relative flex flex-col items-center justify-center p-4 bg-white rounded-xl border-2 transition-colors duration-300 overflow-hidden min-h-[140px]";
    
    let stateStyles = "";
    if (status === 'idle') stateStyles = "border-gray-200";
    if (status === 'signing') stateStyles = "border-amber-300";
    if (status === 'verified') stateStyles = "border-green-400 bg-green-50";
    if (status === 'rejected') stateStyles = "border-red-400 bg-red-50";

    const isSigning = status === 'signing';
    const isVerified = status === 'verified';

    return (
        <motion.div 
            className={`${baseStyle} ${stateStyles}`}
            animate={{ 
                x: status === 'rejected' ? [-5, 5, -5, 5, 0] : 0,
                boxShadow: isSigning ? ['inset 0 0 0px rgba(253, 230, 138, 0)', 'inset 0 0 20px rgba(253, 230, 138, 0.4)', 'inset 0 0 0px rgba(253, 230, 138, 0)'] : 'none'
            }}
            transition={{
                x: { duration: 0.3 },
                boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            <div className="absolute top-2.5 left-3 font-mono text-[10px] text-gray-400">
                {farmer.id}
            </div>

            <motion.div 
                className={`text-4xl mb-1 mt-3 ${status === 'idle' ? 'opacity-30 grayscale' : 'opacity-100'}`}
                animate={{
                    y: isSigning ? [-3, 3, -3] : 0,
                    scale: isVerified ? [1, 1.25, 1] : 1
                }}
                transition={{
                    y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.4, ease: "backOut" }
                }}
            >
                {farmer.emoji}
            </motion.div>

            <div className="font-mono text-[9px] tracking-widest text-gray-400 uppercase mb-3 mt-1">
                {farmer.zone}
            </div>

            <div className="h-4 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {isVerified ? (
                        <motion.div 
                            key="gas"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="font-mono text-[9px] text-green-600 font-bold"
                        >
                            ~11,640 gas
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="pill"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider
                                ${status === 'idle' ? 'bg-gray-100 text-gray-500' : ''}
                                ${status === 'signing' ? 'bg-amber-100 text-amber-700' : ''}
                                ${status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                            `}
                        >
                            {status}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
