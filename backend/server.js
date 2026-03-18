const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

// CORS — allow all local dev origins
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5176',
    'http://localhost:5176',
    'http://127.0.0.1:5177',
    'http://localhost:5177'
  ],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Strip ANSI escape codes from rich/colorama output
function stripAnsi(str) {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><~]/g,
    ''
  );
}

// State
let agentRunning = false;
let agentLogs = [];
let lastRunResult = null;

// POST /api/run-agent
app.post('/api/run-agent', (req, res) => {
  if (agentRunning) {
    return res.status(409).json({
      success: false,
      error: 'Agent is already running. Please wait.',
    });
  }

  agentRunning = true;
  agentLogs = [];
  lastRunResult = null;

  const startTime = Date.now();
  const projectRoot = path.resolve(__dirname, '..');

  console.log('[agent] Starting: python3 agent/agent.py');
  console.log('[agent] CWD:', projectRoot);

  const agent = spawn('python3', ['agent/agent.py'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PYTHONUNBUFFERED: '1',   // Real-time output (no buffering)
      TERM: 'dumb',            // Disable rich formatting
      NO_COLOR: '1',           // Disable color codes
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  agent.stdout.on('data', (data) => {
    const lines = stripAnsi(data.toString()).split('\n').filter(Boolean);
    lines.forEach((line) => {
      const entry = { type: 'stdout', message: line.trim(), timestamp: Date.now() };
      agentLogs.push(entry);
      console.log('[agent:out]', line.trim());
    });
  });

  agent.stderr.on('data', (data) => {
    const lines = stripAnsi(data.toString()).split('\n').filter(Boolean);
    lines.forEach((line) => {
      const entry = { type: 'stderr', message: line.trim(), timestamp: Date.now() };
      agentLogs.push(entry);
      console.error('[agent:err]', line.trim());
    });
  });

  agent.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    agentRunning = false;
    lastRunResult = {
      success: code === 0,
      exitCode: code,
      duration: `${duration}s`,
      logs: [...agentLogs],
      timestamp: new Date().toISOString(),
    };
    console.log(`[agent] Finished — exit code ${code} in ${duration}s`);
  });

  agent.on('error', (err) => {
    agentRunning = false;
    lastRunResult = {
      success: false,
      exitCode: -1,
      error: err.message,
      logs: [...agentLogs],
      timestamp: new Date().toISOString(),
    };
    console.error('[agent] Spawn error:', err.message);
  });

  // Return immediately
  res.json({ success: true, message: 'Agent started', status: 'running' });
});

// GET /api/agent-status
app.get('/api/agent-status', (req, res) => {
  res.json({
    running: agentRunning,
    lastResult: lastRunResult,
  });
});

// GET /api/agent-logs?since=<timestamp>
app.get('/api/agent-logs', (req, res) => {
  const since = parseInt(req.query.since) || 0;
  const newLogs = agentLogs.filter((l) => l.timestamp > since);
  res.json({
    running: agentRunning,
    logs: newLogs,
    totalLogs: agentLogs.length,
  });
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', agentRunning });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🌾 Sentinel API running at http://localhost:' + PORT);
  console.log('   POST /api/run-agent    — Trigger verification');
  console.log('   GET  /api/agent-status — Check status');
  console.log('   GET  /api/agent-logs   — Stream logs');
  console.log('   GET  /api/health       — Health check');
  console.log('');
});
