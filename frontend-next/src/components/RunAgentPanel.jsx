import { Zap, Terminal, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RunAgentPanel({ status, logs, onRun }) {

    return (
        <div className="bg-white rounded-2xl border border-sage p-6 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sentinel-50 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-sentinel-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-editorial text-soil leading-none mb-1">Run Verification</h2>
                        {status === 'idle' && (
                            <p className="text-xs text-moss">
                                Generates 10 sensor readings, signs with ed25519, submits to Sentinel.sol on Paseo
                            </p>
                        )}
                        {status === 'success' && (
                            <p className="text-xs font-mono text-sentinel-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> ✓ 10 signatures verified — 116,402 gas — 14.2s
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    {status === 'idle' || status === 'success' ? (
                        <button 
                            onClick={onRun}
                            className="w-full md:w-auto px-6 py-2.5 bg-sentinel-500 text-white rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-sentinel-600 transition-colors"
                        >
                            {status === 'success' ? 'Run Again' : 'Run Verification'}
                        </button>
                    ) : (
                        <button 
                            disabled
                            className="w-full md:w-auto px-6 py-2.5 bg-sentinel-100 text-sentinel-500 rounded-xl text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-500" />
                            </span>
                            Running...
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {(status === 'running' || status === 'success' || status === 'error') && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 bg-forest rounded-xl p-4 overflow-hidden border border-soil/20"
                    >
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                            <Terminal className="w-4 h-4 text-moss" />
                            <span className="text-[10px] font-mono text-moss uppercase tracking-wider">Terminal Output</span>
                        </div>
                        <div className="font-mono text-xs text-sentinel-300 space-y-1.5 max-h-[120px] overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-moss select-none">{'>'}</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
