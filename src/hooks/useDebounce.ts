import { useState, useEffect } from 'react'

/**
 * Debounces a value by the given delay.
 * Useful for deferring expensive recalculations (quotes, price impact)
 * until the user pauses typing.
 *
 * @example
 * const debouncedAmount = useDebounce(inputAmount, 300)
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
