import { useState, useCallback } from 'react'

/**
 * Syncs a value to localStorage with the given key.
 * Falls back gracefully if localStorage is unavailable.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          typeof value === 'function'
            ? (value as (prev: T) => T)(storedValue)
            : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch {
        // Silently fail if localStorage quota exceeded or unavailable
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
