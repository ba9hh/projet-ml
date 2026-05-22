import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'ecosmart_history'
const MAX = 20

export function useHistory() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const add = useCallback((entry) => {
    const now = new Date()
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setItems(prev => [{ ...entry, time }, ...prev].slice(0, MAX))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, add, clear }
}
