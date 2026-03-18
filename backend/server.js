const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// GET endpoint to verify health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// POST endpoint to trigger the Python agent
app.post('/api/run-agent', (req, res) => {
  // Path to the sentinel-pvm root directory
  const projectRoot = path.resolve(__dirname, '..');
  const agentPath = path.join(projectRoot, 'agent', 'agent.py');
  
  console.log(`Executing: python3 ${agentPath}`);
  
  // Set up Server-Sent Events (SSE) to stream output live
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const pythonProcess = spawn('python3', [agentPath], { 
    cwd: projectRoot 
  });
  
  pythonProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: 'stdout', msg: line })}\n\n`);
      }
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: 'stderr', msg: line })}\n\n`);
      }
    });
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    res.write(`data: ${JSON.stringify({ type: 'done', code })}\n\n`);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Sentinel-PVM Backend Agent running on http://localhost:${PORT}`);
});
