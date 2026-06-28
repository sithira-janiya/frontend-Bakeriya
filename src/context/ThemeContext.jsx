import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/**
 * Light/dark theme. Toggles a `.dark` class on <html> (Tailwind darkMode:'class'
 * + CSS variables do the actual reskin). Persists to localStorage and falls back
 * to the OS preference on first visit.
 */

const ThemeContext = createContext(null)
const THEME_KEY = 'bakeryaTheme'

function readStoredTheme() {
  try {
    const s = localStorage.getItem(THEME_KEY)
    if (s === 'light' || s === 'dark') return s
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
