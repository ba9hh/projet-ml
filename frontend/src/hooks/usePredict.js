import { useState, useCallback } from 'react'
import { predictPhysical, predictNLP } from '../api'

export function usePredict(onSuccess) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(async (mode, data) => {
    setLoading(true)
    setError(null)
    try {
      const api = mode === 'nlp' ? predictNLP : predictPhysical
      const result = await api(data)
      onSuccess?.(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  return { run, loading, error, clearError: () => setError(null) }
}
