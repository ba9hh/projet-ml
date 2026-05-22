export default function Header() {
  return (
    <header style={{
      textAlign: 'center', padding: '2.5rem 1rem 1.5rem',
      animation: 'fadeDown 0.8s ease-out',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px',
      }}>
        <div style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, var(--green-500), var(--cyan-500))',
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
        }}>
          🌱
        </div>
        <span style={{
          background: 'linear-gradient(135deg, var(--green-400), var(--cyan-400))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          EcoSmart
        </span>
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: 400 }}>
        Classification intelligente de déchets par intelligence artificielle
      </p>
    </header>
  )
}
