import { useState, useCallback } from 'react'
import Particles from './components/Particles'
import ThemeToggle from './components/ThemeToggle'
import Header from './components/Header'
import ModeSelector from './components/ModeSelector'
import SensorForm from './components/SensorForm'
import DescriptionCard from './components/DescriptionCard'
import PredictButton from './components/PredictButton'
import ResultCard from './components/ResultCard'
import History from './components/History'
import Dashboard from './components/Dashboard'
import { usePredict } from './hooks/usePredict'
import { useTheme } from './hooks/useTheme'
import { useHistory } from './hooks/useHistory'
import './App.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const { items: historyItems, add: addHistory, clear: clearHistory } = useHistory()
  const [page, setPage] = useState('classifier')

  const [mode, setMode] = useState('physical')
  const [sensors, setSensors] = useState({
    poids: 1.0, volume: 0.5, conductivite: 0.1, opacite: 0.5, rigidite: 0.5,
  })
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSuccess = useCallback((data) => {
    setResult(data)
    addHistory({
      matiere: data.prediction,
      mode: data.mode,
    })
  }, [addHistory])

  const { run: doPredict, error, clearError } = usePredict(onSuccess)

  const handlePredict = useCallback(() => {
    clearError()
    setResult(null)
    if (mode === 'physical') {
      doPredict('physical', sensors)
    } else {
      doPredict('nlp', { description })
    }
  }, [mode, sensors, description, doPredict, clearError])

  const navStyle = (active) => ({
    background: active ? 'var(--bg-card)' : 'transparent',
    border: active ? '1px solid var(--card-border)' : '1px solid transparent',
    color: active ? 'var(--cyan-400)' : 'var(--text-dimmer)',
    padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
    fontSize: 13, fontWeight: active ? 700 : 400,
    fontFamily: 'inherit', transition: 'all 0.2s',
  })

  if (page === 'dashboard') {
    return (
      <>
        <div style={{
          position: 'fixed', top: 16, left: 16, zIndex: 100,
          display: 'flex', gap: 8,
        }}>
          <button onClick={() => setPage('classifier')} style={navStyle(false)}>
            ← Classifier
          </button>
        </div>
        <Dashboard />
      </>
    )
  }

  return (
    <div className="app-wrapper">
      <Particles />
      <ThemeToggle theme={theme} onToggle={toggle} />

      <div style={{
        position: 'fixed', top: 16, right: 72, zIndex: 100,
        display: 'flex', gap: 8, animation: 'fadeDown 0.6s ease-out',
      }}>
        <button onClick={() => setPage('dashboard')} style={navStyle(false)}>
          📊 Dashboard
        </button>
      </div>

      <Header />
      <ModeSelector mode={mode} onChange={setMode} />

      {mode === 'physical' ? (
        <SensorForm values={sensors} onChange={setSensors} />
      ) : (
        <DescriptionCard value={description} onChange={setDescription} nlpOnly />
      )}

      <PredictButton loading={loading} onClick={handlePredict} />

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginTop: '1rem', padding: '0.75rem 1rem',
          background: 'var(--err-bg)', border: '1px solid var(--err-border)',
          borderRadius: 'var(--radius)', color: 'var(--red-400)',
          fontSize: '0.85rem', animation: 'fadeUp 0.3s ease-out',
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <ResultCard result={result} />

      <History items={historyItems} onClear={clearHistory} />

      <footer style={{
        textAlign: 'center', padding: '2rem 1rem 1.5rem',
        fontSize: '0.72rem', color: 'var(--text-dim)',
        animation: 'fadeUp 0.6s ease-out 0.5s both',
      }}>
        EcoSmart &mdash; IA au service de l'environnement
      </footer>
    </div>
  )
}
