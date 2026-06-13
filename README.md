# Peak Refuel — Command OS Dashboard

Operations intelligence dashboard for Peak Refuel. Single-file frontend (`index.html`) that communicates exclusively with a backend API — no credentials, API keys, or ERP tokens are ever stored in the browser.

---

## Quick Start

```bash
# Serve locally
python3 -m http.server 3456
# Then open http://localhost:3456
```

The dashboard is frontend-only. All data, AI responses, and ERP actions require the backend API to be running separately.

---

## Architecture

```
Browser (index.html)
  │
  ├── /api/chat              ← Chris Chat AI assistant
  ├── /api/log/conversation  ← Every chat message logged
  ├── /api/log/obsidian      ← Vault persistence (raw/summary/actions/sop/skills/tags)
  ├── /api/acumatica/*       ← ERP proxy (credentials server-side only)
  └── /api/log/sheets        ← Google Sheets ops log
```

**The frontend never calls OpenAI, Anthropic, Acumatica, Slack, or Twilio directly.** All integrations are proxied through the backend.

---

## Security Model

| What | Where it lives |
|---|---|
| Acumatica credentials | Backend `.env` only |
| Slack webhook URL | Backend `.env` only |
| Twilio SID + token | Backend `.env` only |
| AI API keys | Backend `.env` only |
| Google service account | Backend config folder |
| Obsidian vault path | Backend `.env` only |

The Settings modal in the dashboard shows **connection status cards only** — no credential inputs exist in the UI.

---

## Features

### Dashboard Views
- **Executive Summary** — KPIs, live alerts, agent status, Acumatica quick links
- **Sales → Production** — Forecast vs actual, reorder triggers, alert table
- **Yield Trending** — Batch analytics, 12-week trend, scatter correlation
- **Production Readiness** — MO run cards with ingredient status
- **Ordering Intelligence** — PO recommendations, market signals, spend chart
- **Inventory View** — SKU grid with ATS status and production ETAs
- **AI Agents** — Agent cards with status and trigger controls
- **Chris Chat** — AI assistant panel; all messages logged to conversation log and Obsidian
- **Departments** — Intelligence structure for all 15 departments

### Chris Chat Module
- Chat panel accessible from the sidebar (Chris role)
- Every message sent to `/api/chat` — backend handles the AI call
- Every message logged to `/api/log/conversation`
- Tags each conversation by: department, urgency, follow-up needed
- Obsidian logging buttons: Raw Chat, Summary, Action Items, SOP Candidates, Skill Candidates, Dept Tags
- Source labels on every message bubble

### Obsidian Logging Hooks
All hooks POST to `/api/log/obsidian` with `type` field:
- `raw` — full chat transcript
- `summary` — AI-generated summary
- `actions` — extracted action items
- `sop` — SOP candidates identified in conversation
- `skills` — skill capture candidates
- `deptTags` — department tagging record

### Department Intelligence Structure
15 department stubs with agent configs (all write-back disabled):

| Department | Icon | Agent Sources |
|---|---|---|
| Executive | 👑 | Acumatica, Alerts |
| Finance AR | 💰 | Acumatica, Sheets |
| Production | 🏭 | Acumatica, Chad Sheets |
| Inventory | 📦 | Acumatica |
| Sales | 📈 | Acumatica, CRM |
| Marketing | 📣 | Sheets, Slack |
| Vendors | 🤝 | Acumatica, Email |
| Shepherds Receipts | 🧾 | Receipt Form, Sheets |
| SOPs | 📐 | Chat Logs, Obsidian |
| Skills | 🧠 | Chat Logs, Obsidian |
| People | 👥 | Sheets, Slack |
| Agent Logs | 🤖 | All Agents |
| Decisions | ⚖️ | Chat, Obsidian |
| Follow Ups | 🔔 | Chat, Alerts |

### System Status (Settings Modal)
Read-only status cards showing:
- Acumatica connection (sandbox mode indicator)
- API proxy health
- Google Sheets logging status
- Obsidian logging status
- Rocky agent status
- Simon archive status

---

## Acumatica Integration

Write-back is **disabled by default** (sandbox mode). To enable:
1. Set `ACUMATICA_WRITEBACK_ENABLED=true` in backend `.env`
2. Set `ACUMATICA_MODE=production`
3. Restart the backend

All Acumatica calls in the frontend use `/api/acumatica/*` proxy — never the ERP URL directly.

---

## Backend API Expected Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | AI chat — returns `{reply, source, tags}` |
| `/api/log/conversation` | POST | Log a single chat message |
| `/api/log/obsidian` | POST | Write to Obsidian vault |
| `/api/acumatica/*` | GET/PUT | ERP proxy (auth server-side) |
| `/api/log/sheets` | POST | Append to Google Sheets ops log |

---

## Environment Setup

```bash
cp .env.example .env
# Edit .env with real values
```

See `.env.example` for all required variables.

---

## Roles

| Role | Access |
|---|---|
| Chris | All views including Chat |
| Larry | Executive, Alerts, Yield, Production, Ordering, Inventory, Agents, Departments |
| Chad | Executive, Yield, Production, Inventory |
| Sales | Executive, Inventory |

---

## File Structure

```
Command-OS---Dashboard/
├── index.html        ← Single-file dashboard
├── .env.example      ← Environment variable template
├── launch.json       ← Local dev server config (python3 http.server)
└── README.md
```
