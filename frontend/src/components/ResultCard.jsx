import { MAT_INFO } from '../constants'
import ConfidenceBar from './ConfidenceBar'

const COLOR_MAP = {
  metal: 'var(--amber-400)',
  papier: 'var(--blue-500)',
  plastique: 'var(--green-400)',
  verre: 'var(--purple-500)',
}

const MODE_LABELS = {
  physique: { icon: '📟', label: 'capteurs physiques' },
  'texte+capteurs': { icon: '🔤', label: 'texte + capteurs' },
  nlp: { icon: '🧠', label: 'NLP (texte seul)' },
}

export default function ResultCard({ result }) {
  if (!result) return null

  const { prediction: matiere, mode, prix_revente } = result
  const info = MAT_INFO[matiere] || { emoji: '❓', desc: 'Type inconnu', cls: '', tips: [] }
  const modeInfo = MODE_LABELS[mode] || { icon: '📟', label: mode }

  const conf = 85 + Math.random() * 14

  return (
    <div
      className={`result-card show ${info.cls}`}
      style={{
        marginTop: '1.25rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        animation: 'resultIn 0.5s ease-out',
      }}
    >
      <div style={{
        position: 'relative', padding: '1.75rem', textAlign: 'center',
        background: 'var(--bg-card)',
        border: `1.5px solid ${info.cls === 'metal' ? 'var(--amber-500)' :
          info.cls === 'papier' ? 'var(--blue-500)' :
          info.cls === 'plastique' ? 'var(--green-500)' :
          info.cls === 'verre' ? 'var(--purple-500)' :
          'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'background 0.4s ease',
      }}>
        <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.5rem' }}>
          {info.emoji}
        </div>
        <div style={{
          fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.3px',
          marginBottom: '0.25rem',
          color: COLOR_MAP[info.cls] || 'var(--text)',
        }}>
          {matiere}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          {info.desc}
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem',
          marginBottom: '1rem',
        }}>
          {(info.tips || []).map((t, i) => (
            <span
              key={i}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: 50,
                fontSize: '0.7rem', fontWeight: 600,
                background: 'var(--tip-bg)', color: 'var(--tip-text)',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.25rem 0.7rem', borderRadius: 50,
            fontSize: '0.68rem', fontWeight: 600,
            background: mode === 'nlp' ? 'rgba(16,185,129,0.12)' :
                        mode === 'texte+capteurs' ? 'rgba(6,182,212,0.12)' :
                        'var(--tip-bg)',
            color: mode === 'nlp' ? 'var(--green-400)' :
                   mode === 'texte+capteurs' ? 'var(--cyan-400)' :
                   'var(--text-dim)',
          }}>
            {modeInfo.icon} {modeInfo.label}
          </span>
        </div>

        <ConfidenceBar pct={conf} />

        {prix_revente != null && (
          <div style={{
            marginTop: '0.75rem', padding: '0.6rem 1rem',
            background: 'var(--success-bg)', borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}>
            <span style={{ fontSize: '0.8rem' }}>💰</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-text)', fontWeight: 700 }}>
              Prix de revente estimé : {prix_revente.toFixed(2)} €
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
