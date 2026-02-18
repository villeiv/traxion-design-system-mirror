"use client"

import * as React from "react"

/**
 * Creates a debounced version of a callback function
 * The callback will only execute after the specified delay has passed since the last call
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced version of the callback
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback((value: string) => {
 *   performSearch(value)
 * }, 300)
 *
 * <Input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  // Use ref to store the latest callback without causing re-renders
  const callbackRef = React.useRef(callback)
  const timerRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Update callback ref when callback changes
  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Return memoized debounced function
  return React.useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set new timer
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}
