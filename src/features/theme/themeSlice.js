// Light/dark theme state. The reducer stays pure — the actual side effects
// (toggling the `.dark` class on <html> and persisting to localStorage) run in
// ThemeProvider, which subscribes to selectTheme.
import { createSlice } from '@reduxjs/toolkit'

export const THEME_STORAGE_KEY = 'bakeryaTheme'

// Initial theme: stored choice > OS preference > light. Guarded so a blocked
// localStorage or a non-browser context can never throw during store init.
export function readStoredTheme() {
  try {
    const s = localStorage.getItem(THEME_STORAGE_KEY)
    if (s === 'light' || s === 'dark') return s
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: readStoredTheme() },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload === 'dark' ? 'dark' : 'light'
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    }
  }
})

export const { setTheme, toggleTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme.theme
export default themeSlice.reducer
