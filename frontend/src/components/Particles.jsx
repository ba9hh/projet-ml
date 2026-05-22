import { useEffect, useRef } from 'react'

export default function Particles() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const frag = document.createDocumentFragment()
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      const s = 2 + Math.random() * 6
      Object.assign(p.style, {
        position: 'absolute',
        borderRadius: '50%',
        background: Math.random() > 0.5 ? 'rgba(6,182,212,0.06)' : 'rgba(16,185,129,0.08)',
        width: s + 'px',
        height: s + 'px',
        left: Math.random() * 100 + '%',
        animation: `float ${18 + Math.random() * 30}s linear ${Math.random() * 20}s infinite`,
      })
      frag.appendChild(p)
    }
    el.appendChild(frag)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}
    />
  )
}
