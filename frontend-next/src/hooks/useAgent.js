import { useState } from 'react';

export function useAgent() {
    const [status, setStatus] = useState('idle'); // idle, running, success, error
    const [logs, setLogs] = useState([]);

    const runAgent = () => {
        // Reset state
        setStatus('running');
        setLogs([
            '[agent] Starting: python3 agent/agent.py', 
            '[agent] Generating telemetry...', 
            '[agent] Signing with ed25519...'
        ]);
        
        // Mock staggered progression
        setTimeout(() => {
            setLogs(prev => [...prev, '[agent] Submitting to Sentinel.sol...', '[agent] Transaction confirmed: 0x89945b1...']);
        }, 1500);

        setTimeout(() => {
            setStatus('success');
            setLogs(prev => [...prev, '[agent] Finished — exit code 0 in 14.2s']);
        }, 3000);
    };

    return {
        status,
        logs,
        isRunning: status === 'running',
        runAgent
    };
}
