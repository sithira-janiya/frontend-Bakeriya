import { LANGUAGES, useLanguage } from '../context/LanguageContext.jsx'

/**
 * Compact EN / සිංහල toggle pill. Styled to match the existing navbar chrome
 * (cream background, rounded-full, brown/orange accents) so it drops into
 * the navbar without looking like a foreign element. Used in both the
 * desktop nav row and the mobile slide-down menu.
 */
export default function LanguageSelector({ className = '' }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-crust-100 border border-crust-200 rounded-full p-0.5 shrink-0 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            language === code ? 'bg-oven-500 text-white' : 'text-crust-700 hover:bg-crust-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
