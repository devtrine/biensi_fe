import { useState, useEffect, useCallback } from "react"

export function hasPersistedKey(storageKey: string): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(storageKey) !== null
  } catch {
    return false
  }
}

export function usePersistedState<T>(
  storageKey: string,
  defaultValue: T | (() => T),
  validator?: (val: unknown) => val is T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const resolveDefault = useCallback((): T => {
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue
  }, [defaultValue])

  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return resolveDefault()
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw === null) return resolveDefault()
      const parsed: unknown = JSON.parse(raw)
      if (validator && !validator(parsed)) {
        return resolveDefault()
      }
      return parsed as T
    } catch {
      return resolveDefault()
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (state === undefined) {
        window.localStorage.removeItem(storageKey)
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(state))
      }
    } catch {
      // Ignore storage quota/privacy mode errors
    }
  }, [storageKey, state])

  return [state, setState]
}
