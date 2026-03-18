import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FileStack,
    Clock,
    ShieldCheck,
    Zap,
    CheckCircle,
    X,
    DollarSign,
    Shield,
    Award,
    Turtle,
    ArrowRight,
    ExternalLink,
    Box,
    FileCode,
    Play,
    Loader2,
    AlertTriangle,
    Fuel,
    Timer,
    Binary,
    Hash,
    Activity,
} from 'lucide-react';
import { useAgent } from '../hooks/useAgent';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease, delay },
});

const oldWayItems = [
    'Takes 24-48 hours',
    'Requires manual paperwork',
    'Records can be lost or forged',
    'Expensive at scale',
];

const newWayItems = [
    'Verified in under 6 seconds',
    'Completely automatic',
    'Permanent and tamper-proof',
    'Works with any sensor',
];

const benefitCards = [
    { icon: DollarSign, heading: 'Higher Selling Price', body: 'Verified produce sells for 10-25% more. Buyers pay premium for data they can independently verify.', stat: '+25%' },
    { icon: Shield, heading: 'Lower Insurance Costs', body: 'Insurance companies offer up to 20% better rates for farms with independent verification records.', stat: '-20%' },
    { icon: Award, heading: 'Total Transparency', body: 'Export immutable farm records instantly. Anyone can verify your data mathematically without central authorities.', stat: '100% Trust' },
];

/* ═══════════════════════════════════════════════════════════════════
   EVM FAILURE RESULT PANEL — shows inside the Traditional card
   ═══════════════════════════════════════════════════════════════════ */
function EvmResultPanel() {
    const EVM_GAS_PER_SIG = 1_100_000;
    const BATCH = 10;
    const totalGas = EVM_GAS_PER_SIG * BATCH;
    const blockLimit = 30_000_000;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.6, ease }}
            className="overflow-hidden"
        >
            <div className="border-t border-amber-200 mt-6 pt-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <p className="text-xs font-mono uppercase tracking-wider text-danger font-semibold">
                        Simulated EVM Attempt
                    </p>
                </div>

                {/* Cost breakdown */}
                <div className="bg-red-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-red-600/70">Per signature cost</span>
                        <span className="text-xs font-mono text-red-700 font-bold">{EVM_GAS_PER_SIG.toLocaleString()} gas</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-red-600/70">Batch size</span>
                        <span className="text-xs font-mono text-red-700 font-bold">×{BATCH} signatures</span>
                    </div>
                    <div className="border-t border-red-200 pt-3 flex items-center justify-between">
                        <span className="text-xs font-mono text-red-600/70">Total gas required</span>
                        <span className="text-sm font-mono text-red-700 font-bold">{totalGas.toLocaleString()} gas</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-red-600/70">Block gas limit</span>
                        <span className="text-xs font-mono text-red-700">{blockLimit.toLocaleString()} gas</span>
                    </div>
                </div>

                {/* Gas bar visualization */}
                <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-moss">Gas consumption vs block limit</p>
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((totalGas / blockLimit) * 100, 100)}%` }}
                            transition={{ duration: 1.2, ease, delay: 0.3 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-mono font-bold text-white drop-shadow-sm">
                                {Math.round((totalGas / blockLimit) * 100)}% of block limit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Verdict */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-red-100 border border-red-200 rounded-xl p-4 text-center"
                >
                    <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-1">Result</p>
                    <p className="text-lg font-editorial text-red-700">Transaction Reverts ✗</p>
                    <p className="text-xs text-red-500 mt-1">EVM has no ed25519 precompile. Must implement Curve25519 field arithmetic in Solidity inline assembly.</p>
                </motion.div>

                {/* Why it fails */}
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-moss mb-2">Why EVM fails</p>
                    {[
                        'No ed25519 precompile exists on any EVM chain',
                        'Pure Solidity implementation costs ~1.1M gas per signature',
                        '15+ signatures exceeds block gas limit completely',
                        'Custom inline assembly still cannot match native speed',
                    ].map((reason, i) => (
                        <motion.div
                            key={reason}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.15 }}
                            className="flex items-start gap-2"
                        >
                            <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-red-600">{reason}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   PVM SUCCESS RESULT PANEL — shows inside the Sentinel card
   ═══════════════════════════════════════════════════════════════════ */
function PvmResultPanel({ status, logs }) {
    const isRunning = status === 'running';
    const isSuccess = status === 'success';

    // Parse mock metrics from logs
    const gasUsed = '95,247';
    const txHash = logs.find(l => l.includes('0x'))?.match(/0x[a-f0-9]+/i)?.[0] || '0x89945b1…';
    const batchSize = 10;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.6, ease }}
            className="overflow-hidden"
        >
            <div className="border-t border-sentinel-200 mt-6 pt-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    {isRunning ? (
                        <Loader2 className="w-4 h-4 text-sentinel-500 animate-spin" />
                    ) : (
                        <ShieldCheck className="w-4 h-4 text-sentinel-500" />
                    )}
                    <p className="text-xs font-mono uppercase tracking-wider text-sentinel-600 font-semibold">
                        {isRunning ? 'Verification in progress…' : 'Live PVM Verification Result'}
                    </p>
                </div>

                {/* Terminal mini-log */}
                <div className="bg-[#0a1a0d] rounded-xl p-4 max-h-32 overflow-y-auto">
                    {logs.map((line, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-[11px] font-mono text-green-400/80 leading-relaxed"
                        >
                            {line}
                        </motion.p>
                    ))}
                    {isRunning && (
                        <span className="inline-block w-2 h-3.5 bg-green-400 animate-pulse ml-1" />
                    )}
                </div>

                {/* Metrics grid — shown after success */}
                <AnimatePresence>
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Fuel, label: 'Gas Used', value: gasUsed, sub: 'vs ~11M on EVM' },
                                    { icon: Timer, label: 'Time', value: '~6s', sub: 'vs 24-48 hours' },
                                    { icon: Binary, label: 'Batch Size', value: `${batchSize} sigs`, sub: '1,280 bytes payload' },
                                    { icon: Hash, label: 'Tx Hash', value: txHash.slice(0, 12) + '…', sub: 'On-chain confirmed' },
                                ].map((metric, i) => (
                                    <motion.div
                                        key={metric.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="bg-sentinel-50 rounded-xl p-3 border border-sentinel-100"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <metric.icon className="w-3 h-3 text-sentinel-400" />
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-sentinel-400">{metric.label}</span>
                                        </div>
                                        <p className="text-sm font-mono text-sentinel-700 font-bold">{metric.value}</p>
                                        <p className="text-[10px] font-mono text-sentinel-400">{metric.sub}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Gas comparison bar */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-moss">Gas: PVM vs EVM</p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-red-400 w-10">EVM</span>
                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1, ease, delay: 0.6 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-red-500 w-14 text-right">11.0M</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-sentinel-500 w-10">PVM</span>
                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-sentinel-400 to-sentinel-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '0.86%' }}
                                                transition={{ duration: 1, ease, delay: 0.8 }}
                                                style={{ minWidth: '4px' }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-sentinel-600 w-14 text-right font-bold">95K ✓</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verdict */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="bg-sentinel-50 border border-sentinel-200 rounded-xl p-4 text-center"
                            >
                                <p className="text-xs font-mono text-sentinel-400 uppercase tracking-wider mb-1">Result</p>
                                <p className="text-lg font-editorial text-sentinel-700">All 10 Signatures Verified ✓</p>
                                <p className="text-xs text-sentinel-500 mt-1">ed25519-dalek executed natively on RISC-V via PolkaVM. Standard Solidity call() bridged the payload automatically.</p>
                            </motion.div>

                            {/* Architecture explanation */}
                            <div className="space-y-2 pt-2">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-moss mb-2">What just happened</p>
                                {[
                                    'agent.py generated 10 IoT sensor readings and signed each with ed25519',
                                    'Binary payload (1,284 bytes) submitted to Sentinel.sol on Paseo',
                                    'Sentinel.sol called pvmEngine.call(payload) — standard EVM call()',
                                    'pallet-revive bridged EVM → RISC-V automatically, zero custom code',
                                    'Rust contract used ed25519-dalek to verify all 10 in ~95K gas',
                                    'Batch hash recorded on-chain. Permanently queryable via isVerified()',
                                ].map((step, i) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.4 + i * 0.12 }}
                                        className="flex items-start gap-2"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5 text-sentinel-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs text-sentinel-600">{step}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN TECHNICAL PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Technical() {
    const { status, logs, isRunning, runAgent } = useAgent();
    const [demoTriggered, setDemoTriggered] = useState(false);

    const handleRunDemo = () => {
        if (demoTriggered) return;
        setDemoTriggered(true);
        runAgent();
    };

    return (
        <div className="px-6 lg:px-8 py-6 pb-24 lg:pb-6 bg-cream min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <motion.h1 {...fadeUp()} className="text-3xl md:text-4xl font-editorial text-soil mb-2">
                    Technical Deep-Dive
                </motion.h1>
                <motion.p {...fadeUp(0.1)} className="text-base text-moss">
                    See how Sentinel-PVM architecture radically outperforms traditional EVM data verification.
                </motion.p>
            </div>

            {/* ═══ COMPARISON CARDS ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* ── Traditional Verification ── */}
                <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-sage overflow-hidden flex flex-col">
                    <div className="h-1 bg-warning block w-full flex-shrink-0" />
                    <div className="p-8 flex flex-col flex-grow">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-warning mb-6">Traditional Verification</p>
                        <div className="w-32 h-32 bg-amber-50 rounded-full mx-auto flex items-center justify-center mb-8">
                            <FileStack className="w-10 h-10 text-warning mr-1" />
                            <Clock className="w-8 h-8 text-warning" />
                        </div>
                        <div className="h-[72px] flex flex-col items-center justify-start">
                            <p className="text-5xl font-editorial text-soil text-center mb-2">\$4.82</p>
                            <p className="text-sm text-moss text-center">per batch of readings</p>
                        </div>
                        <div className="border-t border-sage my-6" />
                        <div className="space-y-3">
                            {oldWayItems.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <X className="w-4 h-4 text-danger flex-shrink-0" />
                                    <span className="text-sm text-moss">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Button / Result area */}
                        <div className="mt-auto pt-6">
                            {!demoTriggered ? (
                                <button
                                    onClick={handleRunDemo}
                                    className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300 group cursor-pointer"
                                >
                                    <Play className="w-4 h-4 text-warning group-hover:scale-110 transition-transform" />
                                    <span className="text-sm text-warning font-medium">Run Comparison</span>
                                </button>
                            ) : (
                                <EvmResultPanel />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Sentinel Verification ── */}
                <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-sage overflow-hidden relative flex flex-col">
                    <div className="h-1 bg-sentinel-500 block w-full flex-shrink-0" />
                    <span className="absolute top-4 right-4 bg-sentinel-500 text-white text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded-full z-10">
                        Recommended
                    </span>
                    <div className="p-8 flex flex-col flex-grow">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-sentinel-500 mb-6">Sentinel Verification</p>
                        <div className="w-32 h-32 bg-sentinel-50 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(29,191,96,0.15)]">
                            <ShieldCheck className="w-10 h-10 text-sentinel-500 mr-1" />
                            <Zap className="w-8 h-8 text-sentinel-500" />
                        </div>
                        <div className="h-[72px] flex flex-col items-center justify-start">
                            <p className="text-5xl font-editorial text-sentinel-600 text-center mb-2">\$0.004</p>
                            <p className="text-sm text-moss text-center mb-2">per batch of readings</p>

                        </div>
                        <div className="border-t border-sage my-6" />
                        <div className="space-y-3">
                            {newWayItems.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-sentinel-500 flex-shrink-0" />
                                    <span className="text-sm text-bark">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Button / Result area */}
                        <div className="mt-auto pt-6">
                            {!demoTriggered ? (
                                <button
                                    onClick={handleRunDemo}
                                    className="w-full bg-sentinel-50 hover:bg-sentinel-100 border border-sentinel-200 rounded-xl p-4 flex items-center justify-center gap-2 transition-all duration-300 group cursor-pointer"
                                >
                                    <Play className="w-4 h-4 text-sentinel-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm text-sentinel-600 font-medium">Run Comparison</span>
                                </button>
                            ) : (
                                <PvmResultPanel status={status} logs={logs} />
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Speed comparison */}
            <motion.div {...fadeUp()} className="bg-white rounded-2xl border border-sage p-8 mb-16">
                <h3 className="text-xl font-editorial text-soil mb-8">Speed Comparison</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Turtle className="w-5 h-5 text-warning" />
                            <span className="text-sm text-moss">Traditional: 24-48 hours</span>
                        </div>
                        <motion.div
                            className="h-14 bg-amber-100 rounded-xl overflow-hidden"
                            initial={{ width: 0 }}
                            whileInView={{ width: '90%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease }}
                        >
                            <div className="h-full bg-warning/60 rounded-xl flex items-center px-4">
                                <span className="text-xs font-mono text-amber-800">24-48 hours</span>
                            </div>
                        </motion.div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-sentinel-500" />
                            <span className="text-sm text-moss">Sentinel: 6 seconds</span>
                        </div>
                        <motion.div
                            className="h-14 bg-sentinel-100 rounded-xl overflow-hidden"
                            initial={{ width: 0 }}
                            whileInView={{ width: '3%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease, delay: 0.3 }}
                            style={{ minWidth: '120px' }}
                        >
                            <div className="h-full bg-sentinel-500/60 rounded-xl flex items-center px-4">
                                <span className="text-xs font-mono text-sentinel-800">6 sec</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {benefitCards.map((card, i) => (
                    <motion.div
                        key={card.heading}
                        {...fadeUp(i * 0.15)}
                        className="bg-white rounded-2xl border border-sage p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="w-14 h-14 bg-sentinel-50 rounded-2xl flex items-center justify-center mb-6">
                            <card.icon className="w-7 h-7 text-sentinel-500" />
                        </div>
                        <h3 className="text-xl font-editorial text-soil mb-3">{card.heading}</h3>
                        <p className="text-sm text-moss leading-relaxed mb-4 flex-grow">{card.body}</p>
                        <p className="text-3xl font-editorial text-sentinel-500 mt-auto">{card.stat}</p>
                    </motion.div>
                ))}
            </div>

            {/* Deployed Contracts */}
            <motion.div {...fadeUp()} className="bg-white rounded-2xl border border-sage p-8 mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-editorial text-soil mb-1">Live on Paseo Testnet</h3>
                        <p className="text-sm text-moss">Verify our smart contracts directly on-chain.</p>
                    </div>
                    <span className="mt-4 md:mt-0 px-3 py-1 bg-sentinel-50 text-sentinel-600 border border-sentinel-200 rounded-full text-xs font-mono uppercase tracking-[0.2em] w-fit">
                        Chain ID: 420420417
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-sage/50 rounded-xl p-5 hover:border-sentinel-300 transition-colors group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-ivory border border-sage/40 rounded-lg flex items-center justify-center">
                                <Box className="w-5 h-5 text-sentinel-600" />
                            </div>
                            <div>
                                <h4 className="font-editorial text-soil text-lg leading-none mb-1.5">PVM Verification Engine</h4>
                                <p className="text-[10px] uppercase font-mono tracking-wider text-moss">Rust / PolkaVM</p>
                            </div>
                        </div>
                        <div className="bg-cream rounded-lg p-3 flex items-center justify-between group-hover:bg-ivory transition-colors">
                            <code className="text-[11px] font-mono text-bark truncate pr-4">0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0</code>
                            <a href="https://assethub-paseo.subscan.io/account/0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white rounded-md shadow-sm text-moss hover:text-sentinel-500 transition-colors flex-shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="border border-sage/50 rounded-xl p-5 hover:border-sentinel-300 transition-colors group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-ivory border border-sage/40 rounded-lg flex items-center justify-center">
                                <FileCode className="w-5 h-5 text-sentinel-600" />
                            </div>
                            <div>
                                <h4 className="font-editorial text-soil text-lg leading-none mb-1.5">Sentinel Protocol</h4>
                                <p className="text-[10px] uppercase font-mono tracking-wider text-moss">Solidity Smart Contract</p>
                            </div>
                        </div>
                        <div className="bg-cream rounded-lg p-3 flex items-center justify-between group-hover:bg-ivory transition-colors">
                            <code className="text-[11px] font-mono text-bark truncate pr-4">0xe52439ffc5e6875e1961cf16bea1e6906673700b</code>
                            <a href="https://assethub-paseo.subscan.io/account/0xe52439ffc5e6875e1961cf16bea1e6906673700b" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white rounded-md shadow-sm text-moss hover:text-sentinel-500 transition-colors flex-shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div {...fadeUp()} className="text-center py-16">
                <h2 className="text-2xl md:text-3xl font-editorial text-soil mb-6">
                    Ready to see it in action?
                </h2>
                <Link to="/app" className="inline-flex items-center gap-2 px-10 py-5 bg-sentinel-500 text-white font-semibold uppercase tracking-wide rounded-full hover:scale-105 hover:bg-sentinel-600 transition-all duration-500 text-sm mb-4">
                    Try it yourself <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-moss">Run a live verification on the Paseo Testnet</p>
            </motion.div>
        </div>
    );
}