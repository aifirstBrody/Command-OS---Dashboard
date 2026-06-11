const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { callHermes } = require('../services/hermes');
const { saveSession, hasFlaggedContent, getFlaggedMessages } = require('../services/logger');
const { sendSessionSummary } = require('../services/slack');

// In-memory session store for MVP.
// Sessions survive individual requests but not server restarts.
// Replace with SQLite in a future phase.
const sessions = new Map();

function getOrCreateSession(sessionId, mode) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      date: new Date().toISOString(),
      mode,
      messages: []
    });
  }
  return sessions.get(sessionId);
}

router.post('/', async (req, res) => {
  const { message, sessionId, mode, adminToken } = req.body;

  // Input validation
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }
  if (trimmed.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
  }

  // Validate admin mode — token must match server-side env var
  const validatedMode = (
    mode === 'admin' &&
    adminToken &&
    process.env.ADMIN_TOKEN &&
    adminToken === process.env.ADMIN_TOKEN
  ) ? 'admin' : 'client';

  const id = sessionId && typeof sessionId === 'string' ? sessionId : uuidv4();
  const session = getOrCreateSession(id, validatedMode);

  // Record the user's message (category filled in after Hermes responds)
  const userMessage = {
    role: 'user',
    content: trimmed,
    timestamp: new Date().toISOString(),
    category: null
  };
  session.messages.push(userMessage);

  // Pass the last 20 messages as context (10 exchanges)
  const history = session.messages.slice(-20).map(m => ({
    role: m.role === 'hermes' ? 'assistant' : m.role,
    content: m.content
  }));

  try {
    const result = await callHermes(history, validatedMode);

    // Back-fill the category on the user message
    userMessage.category = result.category;

    const assistantMessage = {
      role: 'assistant',
      content: result.content,
      timestamp: new Date().toISOString()
    };
    session.messages.push(assistantMessage);

    // Persist after every exchange
    saveSession(session);

    // Fire-and-forget Slack notification if flagged content exists
    if (hasFlaggedContent(session)) {
      sendSessionSummary(session, getFlaggedMessages(session)).catch(err =>
        console.error('[Chat] Slack notification failed:', err.message)
      );
    }

    res.json({
      reply: result.content,
      category: result.category,
      sessionId: id,
      mode: validatedMode,
      logged: true,
      stub: result.stub || false
    });
  } catch (err) {
    console.error('[Chat] Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong. Your message was logged.' });
  }
});

module.exports = router;
