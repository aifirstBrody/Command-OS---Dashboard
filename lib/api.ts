const BASE = ''

export async function postIntake(payload: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function postObsidianActivity(type: string, data: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/obsidian/activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...data }),
  })
  return res.json()
}

export async function getObsidianActivity() {
  const res = await fetch(`${BASE}/api/obsidian/activity`)
  return res.json()
}

export async function postRecommendation(id: string, action: 'approve' | 'dismiss') {
  const res = await fetch(`${BASE}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, action }),
  })
  return res.json()
}

export async function getSystemStatus() {
  const res = await fetch(`${BASE}/api/system/status`)
  return res.json()
}
