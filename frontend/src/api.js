const BASE = ''

export async function predictPhysical(data) {
  const r = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!r.ok) throw new Error(`Erreur serveur (${r.status})`)
  return r.json()
}

export async function predictNLP(data) {
  const r = await fetch(`${BASE}/predict-nlp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: data.description }),
  })
  if (!r.ok) throw new Error(`Erreur serveur (${r.status})`)
  return r.json()
}
