import { useEffect, useRef } from 'react'

export default function ConfidenceBar({ pct }) {
  const fillRef = useRef(null)

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.width = pct + '%'
    }
  }, [pct])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      marginTop: '0.75rem', paddingTop: '0.75rem',
      borderTop: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500, whiteSpace: 'nowrap' }}>
        Confiance
      </span>
      <div style={{
        flex: 1, height: 6, background: 'var(--conf-bar-bg)',
        borderRadius: 50, overflow: 'hidden',
      }}>
        <div
          ref={fillRef}
          style={{
            height: '100%', borderRadius: 50, width: '0%',
            background: 'linear-gradient(90deg, var(--green-500), var(--cyan-500))',
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '3ch' }}>
        {Math.round(pct)}%
      </span>
    </div>
  )
}
