import { MAT_INFO } from '../constants'

export default function History({ items, onClear }) {
  if (!items.length) return null

  return (
    <div style={{ marginTop: '1.25rem', animation: 'fadeUp 0.5s ease-out' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px',
        color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.75rem',
      }}>
        <span>📋 Historique</span>
        <button
          onClick={onClear}
          style={{
            background: 'none', border: 'none', color: 'var(--text-dim)',
            cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit',
            textDecoration: 'underline', textUnderlineOffset: 2,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red-400)')}
          onMouseLeave={e => (e.currentTarget.style.color = '')}
        >
          Effacer
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((h, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.5rem 0.75rem',
              background: 'var(--history-bg)', borderRadius: 'var(--radius)',
              fontSize: '0.8rem', cursor: 'default',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--history-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <span style={{ fontSize: '1.1rem' }}>{MAT_INFO[h.matiere]?.emoji || '❓'}</span>
            <span style={{ fontWeight: 600, flex: 1 }}>{h.matiere}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dimmer)' }}>{h.mode}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dimmer)' }}>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
