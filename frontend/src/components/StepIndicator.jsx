const STEPS = ['Capteurs', 'Description', 'Classification']

export default function StepIndicator({ current }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: '0.5rem',
      margin: '1.5rem 0 2rem', animation: 'fadeDown 0.8s ease-out 0.2s both',
    }}>
      {STEPS.map((label, i) => {
        const idx = i + 1
        const isActive = current === idx
        const isDone = current > idx
        return (
          <div
            key={label}
            className={`step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px',
              padding: '0.4rem 0.8rem', borderRadius: 50,
              background: isActive || isDone ? 'var(--success-bg)' : 'var(--step-bg)',
              color: isActive || isDone ? 'var(--success-text)' : 'var(--step-text)',
              fontWeight: 600, transition: 'all 0.4s ease',
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700,
              background: isActive || isDone ? 'var(--green-500)' : 'var(--badge-bg)',
              color: isActive || isDone ? '#fff' : 'var(--badge-text)',
              transition: 'all 0.4s ease',
            }}>
              {idx}
            </span>
            {label}
          </div>
        )
      })}
    </div>
  )
}
