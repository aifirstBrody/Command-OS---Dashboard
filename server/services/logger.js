const fs = require('fs');
const path = require('path');

const CONVERSATIONS_DIR = path.join(__dirname, '../logs/conversations');
const SUBMISSIONS_DIR = path.join(__dirname, '../logs/submissions');

// Categories that warrant a Slack notification and submission log entry
const FLAGGED = new Set(['frustration', 'sop_idea', 'job_description', 'process_issue', 'improvement', 'restricted']);

function saveSession(session) {
  const dateStr = new Date(session.date).toISOString().split('T')[0];
  const baseName = `${dateStr}_session_${session.sessionId}`;

  // JSON log
  fs.writeFileSync(
    path.join(CONVERSATIONS_DIR, `${baseName}.json`),
    JSON.stringify(session, null, 2),
    'utf8'
  );

  // Markdown transcript
  fs.writeFileSync(
    path.join(CONVERSATIONS_DIR, `${baseName}.md`),
    buildMarkdown(session),
    'utf8'
  );

  // Append flagged messages to per-category submission logs
  session.messages
    .filter(m => m.role === 'user' && FLAGGED.has(m.category))
    .forEach(msg => {
      const file = path.join(SUBMISSIONS_DIR, `${msg.category}s.jsonl`);
      const line = JSON.stringify({
        sessionId: session.sessionId,
        date: session.date,
        mode: session.mode,
        content: msg.content,
        timestamp: msg.timestamp
      }) + '\n';
      fs.appendFileSync(file, line, 'utf8');
    });
}

function buildMarkdown(session) {
  const header = [
    `# Hermes Session — ${new Date(session.date).toLocaleString()}`,
    `**Session ID:** ${session.sessionId} | **Mode:** ${session.mode}`,
    '',
    '---',
    ''
  ];

  const body = session.messages.flatMap(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const label = msg.role === 'user'
      ? `**User** [${time}]${msg.category ? ` _(${msg.category})_` : ''}`
      : `**Hermes** [${time}]`;
    return [label, msg.content, ''];
  });

  const categories = [...new Set(
    session.messages.filter(m => m.category).map(m => m.category)
  )];

  const footer = [
    '---',
    `*${session.messages.length} messages · Categories: ${categories.join(', ') || 'none'}*`
  ];

  return [...header, ...body, ...footer].join('\n');
}

function hasFlaggedContent(session) {
  return session.messages.some(m => m.role === 'user' && FLAGGED.has(m.category));
}

function getFlaggedMessages(session) {
  return session.messages.filter(m => m.role === 'user' && FLAGGED.has(m.category));
}

module.exports = { saveSession, hasFlaggedContent, getFlaggedMessages };
