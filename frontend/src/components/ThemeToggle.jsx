export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title="Changer le thème"
      style={{
        position: 'fixed', top: '1rem', right: '1rem', zIndex: 10,
        width: 40, height: 40, borderRadius: '50%',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        color: 'var(--text)', fontSize: '1.15rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px var(--shadow)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
