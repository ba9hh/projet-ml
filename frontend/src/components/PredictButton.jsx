export default function PredictButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '0.95rem',
        background: 'linear-gradient(135deg, var(--green-500), var(--cyan-500))',
        color: '#fff', border: 'none', borderRadius: 'var(--radius)',
        fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.3s ease', marginTop: '0.5rem',
        position: 'relative', overflow: 'hidden',
        letterSpacing: '0.3px',
        boxShadow: loading ? 'none' : '0 4px 20px rgba(16,185,129,0.2)',
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.35)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(16,185,129,0.2)'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
        {loading ? (
          <>
            <span style={{
              width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', borderRadius: '50%',
              animation: 'spin 0.6s linear infinite', display: 'inline-block',
            }} />
            <span>Classification...</span>
          </>
        ) : (
          <>
            <span>♻️</span>
            <span>Classifier le déchet</span>
          </>
        )}
      </span>
    </button>
  )
}
