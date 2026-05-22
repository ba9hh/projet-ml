const SENSORS = [
  { key: 'poids', label: '⚖️ Poids', unit: 'kg', step: 0.1, def: 1.0 },
  { key: 'volume', label: '📦 Volume', unit: 'L', step: 0.1, def: 0.5 },
  { key: 'conductivite', label: '⚡ Conductivité', step: 0.01, def: 0.1 },
  { key: 'opacite', label: '👁️ Opacité', step: 0.01, def: 0.5 },
  { key: 'rigidite', label: '🪨 Rigidité', step: 0.01, def: 0.5, full: true },
]

export default function SensorForm({ values, onChange }) {
  const handleChange = (key, val) => {
    onChange({ ...values, [key]: parseFloat(val) || 0 })
  }

  return (
    <Card title="📡 Données physiques" badge="5 capteurs">
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
      }}>
        {SENSORS.map(s => (
          <div
            key={s.key}
            style={s.full ? { gridColumn: '1 / -1' } : undefined}
          >
            <InputGroup
              label={s.label}
              unit={s.unit}
              value={values[s.key]}
              step={s.step}
              onChange={v => handleChange(s.key, v)}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

function Card({ title, badge, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)',
      padding: '1.75rem', marginBottom: '1.25rem',
      transition: 'box-shadow 0.3s ease, background 0.4s ease, border-color 0.4s ease',
      animation: 'fadeUp 0.6s ease-out 0.3s both',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px',
        color: 'var(--text-dim)', fontWeight: 600, marginBottom: '1.25rem',
      }}>
        <span>{title}</span>
        {badge && (
          <span style={{
            background: 'var(--badge-bg)', color: 'var(--badge-text)',
            padding: '0.1rem 0.5rem', borderRadius: 50, fontSize: '0.65rem',
          }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function InputGroup({ label, unit, value, step, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dim)',
        textTransform: 'uppercase', letterSpacing: '0.3px',
      }}>
        {label}
        {unit && <span style={{ color: 'var(--text-dimmer)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({unit})</span>}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="number"
          step={step}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', padding: '0.65rem 0.85rem',
            background: 'var(--bg-input)', border: '1.5px solid var(--border-input)',
            borderRadius: 'var(--radius)', color: 'var(--text)',
            fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
            transition: 'all 0.25s ease',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--green-500)'
            e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)'
          }}
          onBlur={e => {
            e.target.style.borderColor = ''
            e.target.style.boxShadow = ''
          }}
        />
        {unit && (
          <span style={{
            position: 'absolute', right: '0.75rem', fontSize: '0.75rem',
            color: 'var(--text-dimmer)', pointerEvents: 'none',
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
