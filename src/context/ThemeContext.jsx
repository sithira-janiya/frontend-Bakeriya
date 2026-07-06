import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import {
  selectTheme,
  setTheme as setThemeAction,
  toggleTheme as toggleThemeAction,
  THEME_STORAGE_KEY
} from '../features/theme/themeSlice.js'

/**
 * Theme is Redux-backed now (see features/theme/themeSlice.js). These exports
 * are kept so existing imports — `import { useTheme } from
 * '../context/ThemeContext.jsx'` — keep working unchanged.
 *
 * ThemeProvider no longer holds state; it just runs the DOM/localStorage side
 * effect whenever the selected theme changes.
 */

export function ThemeProvider({ children }) {
  const theme = useAppSelector(selectTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return children
}

export function useTheme() {
  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      theme,
      setTheme: (next) => dispatch(setThemeAction(next)),
      toggleTheme: () => dispatch(toggleThemeAction())
    }),
    [theme, dispatch]
  )
}
