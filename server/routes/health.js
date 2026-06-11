const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const hermesConfigured = !!(process.env.HERMES_BASE_URL && process.env.HERMES_API_KEY);
  const slackConfigured = !!(
    process.env.SLACK_WEBHOOK_URL &&
    process.env.SLACK_WEBHOOK_URL.startsWith('https://hooks.slack.com/') &&
    !process.env.SLACK_WEBHOOK_URL.includes('REPLACE')
  );

  res.json({
    status: 'ok',
    service: 'Peak Refuel Command OS',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    hermes: hermesConfigured ? 'configured' : 'stub (no credentials)',
    slack: slackConfigured ? 'configured' : 'not configured',
  });
});

module.exports = router;
