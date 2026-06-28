import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext.jsx'

/**
 * Sun/Moon theme toggle pill, styled to match the navbar chrome (mirrors
 * LanguageSelector). Used in both the desktop nav row and the mobile menu.
 * The icon rotates + cross-fades between states via Framer Motion.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9, rotate: -20 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-crust-100 border border-crust-200 text-crust-700 hover:bg-crust-200 overflow-hidden shrink-0 ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-amber-400"
          >
            <Sun size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-indigo-500"
          >
            <Moon size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
