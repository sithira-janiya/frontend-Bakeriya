import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wheat } from 'lucide-react'
import LoaderScene from './three/LoaderScene.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Full-screen bakery loading overlay: gradient backdrop, animated logo + cooking
 * scene, and a progress bar. Reusable — drop it in anywhere while data loads.
 * Pass `leaving` to fade it out (300ms) before the parent unmounts it, so the
 * page underneath is revealed smoothly.
 */
export default function LoadingScreen({ message = 'Preheating the ovens', leaving = false }) {
  const { t } = useLanguage()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-crust-50 via-crust-100 to-crust-200"
    >
      {/* Soft drifting accent glow behind the scene */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[60vmin] w-[60vmin] rounded-full bg-oven-500/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center logo */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
        className="flex items-center gap-2"
      >
        <motion.span
          className="inline-flex text-oven-500"
          animate={{ rotate: [0, -12, 12, -6, 0], y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wheat className="h-7 w-7 sm:h-8 sm:w-8" />
        </motion.span>
        <span className="font-display text-2xl sm:text-3xl font-bold text-oven-600">{t('brand.name')}</span>
      </motion.div>

      {/* Animated 3D bakery icon */}
      <LoaderScene />

      {/* Message */}
      <div className="text-center px-6">
        <p className="text-crust-500 text-sm min-h-[1.25rem]">
          {message}
          <span className="inline-block w-4 text-left">{dots}</span>
        </p>
      </div>

      {/* Progress animation */}
      <div className="h-1.5 w-48 max-w-[70vw] overflow-hidden rounded-full bg-crust-200/70">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-oven-500 to-oven-700"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
