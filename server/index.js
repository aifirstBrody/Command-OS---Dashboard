require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const chatRoute = require('./routes/chat');
const receiptRoute = require('./routes/receipt');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure log directories exist on startup
['logs/conversations', 'logs/submissions', 'logs/receipts'].forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// API routes — must come before static file serving
app.use('/api/chat', chatRoute);
app.use('/api/receipt', receiptRoute);
app.use('/api/health', healthRoute);

// Serve the dashboard (index.html and all static assets)
app.use(express.static(path.join(__dirname, '..')));

// Fallback for any route not matched above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n┌─────────────────────────────────────────────┐`);
  console.log(`│  Peak Refuel Command OS                     │`);
  console.log(`│  Server running on http://0.0.0.0:${PORT}     │`);
  console.log(`│  Hermes: ${process.env.HERMES_BASE_URL ? 'configured' : 'stub mode (no HERMES_BASE_URL)'}`.padEnd(46) + `│`);
  console.log(`│  Slack:  ${process.env.SLACK_WEBHOOK_URL && !process.env.SLACK_WEBHOOK_URL.includes('REPLACE') ? 'configured' : 'not configured'}`.padEnd(46) + `│`);
  console.log(`└─────────────────────────────────────────────┘\n`);
});
