const CATEGORY_EMOJI = {
  frustration: '😤',
  sop_idea: '📋',
  job_description: '👤',
  process_issue: '⚠️',
  improvement: '💡',
  restricted: '🚫',
};

function isConfigured() {
  const url = process.env.SLACK_WEBHOOK_URL;
  return url && url.startsWith('https://hooks.slack.com/services/') && !url.includes('REPLACE');
}

async function sendSessionSummary(session, flaggedMessages) {
  if (!isConfigured()) {
    console.log('[Slack] Webhook not configured — skipping notification');
    return false;
  }

  if (!flaggedMessages || flaggedMessages.length === 0) return false;

  const dateStr = new Date(session.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });

  const submissionLines = flaggedMessages.map(m => {
    const emoji = CATEGORY_EMOJI[m.category] || '•';
    const preview = m.content.length > 140 ? m.content.slice(0, 137) + '...' : m.content;
    return `${emoji} *[${m.category.replace('_', ' ')}]* "${preview}"`;
  }).join('\n');

  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔔 Hermes Session Summary' }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Date:*\n${dateStr}` },
          { type: 'mrkdwn', text: `*Mode:*\n${session.mode}` },
          { type: 'mrkdwn', text: `*Session:*\n\`${session.sessionId}\`` },
          { type: 'mrkdwn', text: `*Submissions:*\n${flaggedMessages.length}` },
        ]
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Captured:*\n${submissionLines}` }
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `Log: \`server/logs/conversations/${new Date(session.date).toISOString().split('T')[0]}_session_${session.sessionId}.md\``
        }]
      }
    ]
  };

  try {
    const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('[Slack] Failed to send notification:', err.message);
    return false;
  }
}

async function sendReceiptNotification(receipt) {
  if (!isConfigured()) return false;

  const itemLines = receipt.items
    .map(i => `• ${i.qty} ${i.unit} — ${i.ingredient}${i.lotNumber ? ` _(Lot: ${i.lotNumber})_` : ''}`)
    .join('\n');

  const sandboxTag = receipt.sandbox ? ' *[SANDBOX]*' : '';

  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📦 Receipt Submitted${receipt.sandbox ? ' [SANDBOX]' : ''}` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Receipt ID:*\n\`${receipt.receiptId}\`` },
          { type: 'mrkdwn', text: `*Submitted by:*\n${receipt.submittedBy}` },
          { type: 'mrkdwn', text: `*Items:*\n${receipt.items.length}` },
          { type: 'mrkdwn', text: `*Date:*\n${new Date(receipt.date).toLocaleString()}` },
        ]
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Items:*\n${itemLines}` }
      }
    ]
  };

  try {
    const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('[Slack] Receipt notification failed:', err.message);
    return false;
  }
}

module.exports = { sendSessionSummary, sendReceiptNotification };
