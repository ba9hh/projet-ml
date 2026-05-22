export default function DescriptionCard({ value, onChange, nlpOnly }) {
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
        <span>{nlpOnly ? '🧠 Texte' : '✏️ Description'}</span>
        <span style={{
          background: 'var(--badge-bg)', color: 'var(--badge-text)',
          padding: '0.1rem 0.5rem', borderRadius: 50, fontSize: '0.65rem',
        }}>
          {nlpOnly ? 'obligatoire' : 'optionnelle'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <label style={{
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-dim)',
        }}>
          {nlpOnly
            ? 'Décris le déchet en quelques mots — l\'IA le classifiera'
            : 'Texte libre — améliore la précision de la classification'}
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="ex: bouteille en plastique transparente, canette en aluminium..."
            rows={nlpOnly ? 4 : 2}
            style={{
              width: '100%', padding: '0.65rem 0.85rem',
              background: 'var(--bg-input)', border: '1.5px solid var(--border-input)',
              borderRadius: 'var(--radius)', color: 'var(--text)',
              fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
              resize: 'vertical', minHeight: nlpOnly ? 100 : 70, lineHeight: 1.5,
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
        </div>
      </div>
    </div>
  )
}
