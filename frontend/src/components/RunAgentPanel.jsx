import { useAgent } from '../hooks/useAgent';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Loader2, CheckCircle, XCircle, WifiOff, 
  Terminal, RotateCcw, Zap, ArrowRight 
} from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function RunAgentPanel() {
  const { status, logs, result, backendOnline, runAgent, reset, isRunning } = useAgent();
  const logEndRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-white rounded-2xl border border-sage/50 overflow-hidden
                    shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
      
      {/* ═══ HEADER ═══ */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-sentinel-500" />
            <h3 className="text-lg font-editorial text-soil">
              Run Verification
            </h3>
          </div>
          <p className="text-[11px] font-mono text-moss/50 uppercase tracking-wider">
            Submit sensor data to Sentinel contract
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {/* Backend status dot */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                          border text-[9px] font-mono uppercase tracking-wider
            ${backendOnline 
              ? 'bg-sentinel-50 border-sentinel-200 text-sentinel-700' 
              : 'bg-red-50 border-red-200 text-red-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full 
              ${backendOnline ? 'bg-sentinel-500' : 'bg-red-400'}`} />
            {backendOnline ? 'API Online' : 'API Offline'}
          </div>
        </div>
      </div>

      {/* ═══ DESCRIPTION — What this does ═══ */}
      <div className="px-6 pb-4">
        <div className="bg-ivory rounded-xl p-4 border border-sage/30">
          <p className="text-xs text-moss leading-relaxed">
            This runs the Python agent which generates 10 fake sensor readings, 
            signs each with ed25519, builds a binary payload, and submits it to 
            <span className="font-mono text-sentinel-600"> Sentinel.sol</span> on 
            Paseo testnet. The contract forwards the payload to the PVM Engine 
            (Rust) for cryptographic verification.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-[9px] font-mono text-moss/40 uppercase">
              10 signatures per batch
            </span>
            <span className="text-[9px] font-mono text-moss/40">·</span>
            <span className="text-[9px] font-mono text-moss/40 uppercase">
              ~116K gas
            </span>
            <span className="text-[9px] font-mono text-moss/40">·</span>
            <span className="text-[9px] font-mono text-moss/40 uppercase">
              ~15-30 seconds
            </span>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BUTTON ═══ */}
      <div className="px-6 pb-4">
        
        {/* IDLE state — show Run button */}
        {status === 'idle' && (
          <button
            onClick={runAgent}
            className="w-full flex items-center justify-center gap-2.5 
                       px-6 py-4 bg-sentinel-500 text-white rounded-xl 
                       text-sm font-mono uppercase tracking-[0.15em]
                       hover:bg-sentinel-600 hover:shadow-[0_4px_20px_rgba(29,191,96,0.3)]
                       active:scale-[0.98] transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            Run Verification Agent
          </button>
        )}

        {/* OFFLINE state — backend not running */}
        {status === 'offline' && (
          <div className="w-full flex flex-col items-center gap-3 px-6 py-4 
                          bg-red-50 border border-red-200 rounded-xl text-center">
            <WifiOff className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                Backend server not running
              </p>
              <p className="text-[11px] text-red-500 mt-1 font-mono">
                Run: cd backend && npm install && node server.js
              </p>
            </div>
          </div>
        )}

        {/* RUNNING state — show progress */}
        {(status === 'starting' || status === 'running') && (
          <div className="w-full flex items-center justify-center gap-2.5 
                          px-6 py-4 bg-sentinel-50 border border-sentinel-200 
                          rounded-xl">
            <Loader2 className="w-4 h-4 text-sentinel-600 animate-spin" />
            <span className="text-sm font-mono uppercase tracking-wider text-sentinel-700">
              {status === 'starting' ? 'Starting agent...' : 'Verifying on-chain...'}
            </span>
          </div>
        )}

        {/* SUCCESS state — show result + reset */}
        {status === 'success' && (
          <div className="flex flex-col gap-3">
            <div className="w-full flex items-center justify-between 
                            px-5 py-4 bg-sentinel-50 border border-sentinel-200 
                            rounded-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-sentinel-500" />
                <div>
                  <p className="text-sm font-medium text-sentinel-700">
                    Verification successful
                  </p>
                  <p className="text-[10px] font-mono text-sentinel-500 mt-0.5">
                    Completed in {result?.duration || '—'}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                           bg-white border border-sentinel-200 text-[10px] 
                           font-mono uppercase tracking-wider text-sentinel-600
                           hover:bg-sentinel-100 transition-colors duration-200"
              >
                <RotateCcw className="w-3 h-3" />
                Run Again
              </button>
            </div>
          </div>
        )}

        {/* ERROR state */}
        {status === 'error' && (
          <div className="flex flex-col gap-3">
            <div className="w-full flex items-center justify-between 
                            px-5 py-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Verification failed
                  </p>
                  <p className="text-[10px] font-mono text-red-500 mt-0.5">
                    {result?.error || `Exit code: ${result?.exitCode}`}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                           bg-white border border-red-200 text-[10px] 
                           font-mono uppercase tracking-wider text-red-600
                           hover:bg-red-100 transition-colors duration-200"
              >
                <RotateCcw className="w-3 h-3" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ LIVE TERMINAL LOG ═══ */}
      <AnimatePresence>
        {(logs.length > 0 || isRunning) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-6 mb-6 bg-forest rounded-xl overflow-hidden 
                            border border-white/[0.06]">
              
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2.5 
                              border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sentinel-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                </div>
                <span className="text-[9px] font-mono text-white/20 
                                 tracking-wider uppercase ml-2">
                  agent output — python3 agent/agent.py
                </span>
                {isRunning && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sentinel-500 
                                     animate-pulse" />
                    <span className="text-[9px] font-mono text-sentinel-400 
                                     uppercase tracking-wider">
                      Running
                    </span>
                  </span>
                )}
              </div>

              {/* Log content */}
              <div className="px-4 py-3 max-h-[280px] overflow-y-auto 
                              font-mono text-[11px] leading-relaxed
                              scrollbar-thin scrollbar-thumb-white/10">
                {logs.length === 0 && isRunning && (
                  <div className="text-white/20 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Waiting for output...
                  </div>
                )}
                {logs.map((log, i) => (
                  <div 
                    key={i}
                    className={`py-0.5 ${
                      log.type === 'stderr' 
                        ? 'text-red-400/70' 
                        : 'text-sentinel-400/80'
                    }`}
                  >
                    <span className="text-white/15 mr-2 select-none">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour12: false, hour: '2-digit', minute: '2-digit', 
                        second: '2-digit'
                      })}
                    </span>
                    {log.message}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
