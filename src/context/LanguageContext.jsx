import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n/translations.js'

/**
 * Lightweight i18n layer (no external library needed for a two-language
 * site). Exposes `language`, `setLanguage(code)`, and `t(key, vars)`.
 *
 * Persists the selected language to localStorage under "bakeryaLanguage" so
 * a refresh keeps the user's choice. Default language is English.
 */

const LanguageContext = createContext(null)

const LANGUAGE_KEY = 'bakeryaLanguage'

// Display labels for the selector — keep both languages' own script for
// their own name (matches common practice: language switchers show "English"
// and "සිංහල", not translated versions of those words).
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' }
]

function isSupported(code) {
  return Object.prototype.hasOwnProperty.call(translations, code)
}

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    return isSupported(stored) ? stored : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language)
    } catch {
      // localStorage unavailable (e.g. privacy mode) -- ignore, in-memory still works
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const setLanguage = useCallback((code) => {
    if (isSupported(code)) setLanguageState(code)
  }, [])

  const t = useCallback(
    (key, vars) => {
      const template = translations[language]?.[key] ?? translations.en[key] ?? key
      if (!vars) return template
      return Object.keys(vars).reduce(
        (str, varKey) => str.replaceAll(`{{${varKey}}}`, String(vars[varKey])),
        template
      )
    },
    [language]
  )

  const value = { language, setLanguage, t }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
