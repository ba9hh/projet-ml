const MODES = [
  { key: 'physical', label: '📟 Capteurs', desc: 'Classification par données physiques' },
  { key: 'nlp', label: '📝 NLP', desc: 'Classification par description textuelle' },
]

export default function ModeSelector({ mode, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', marginBottom: '1.5rem',
      animation: 'fadeDown 0.8s ease-out 0.1s both',
    }}>
      {MODES.map(m => {
        const active = mode === m.key
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            style={{
              flex: 1, padding: '0.9rem 1rem',
              background: active ? 'var(--bg-card)' : 'transparent',
              border: active ? '1.5px solid var(--green-500)' : '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              color: active ? 'var(--text)' : 'var(--text-dim)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.borderColor = 'var(--green-500)'
                e.currentTarget.style.background = 'var(--bg-card)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 400 }}>
              {m.desc}
            </div>
          </button>
        )
      })}
    </div>
  )
}
