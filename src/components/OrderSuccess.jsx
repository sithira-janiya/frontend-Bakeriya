import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, ShoppingBag, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

const CONFETTI_COLORS = ['#e8702a', '#d6551a', '#f4b942', '#34d399', '#60a5fa', '#f472b6']

/**
 * Premium order-success screen: confetti burst, animated checkmark, order number
 * reveal, ETA and the continue/track actions. Reusable — give it an `orderId`
 * plus the navigation handlers.
 *
 * @param {string} orderId         Placed order id (revealed on the card).
 * @param {() => void} onContinue  "Continue Shopping" handler.
 * @param {() => void} onTrack     "Track Order" handler + auto-redirect target.
 * @param {number} autoRedirectMs  Delay before auto-redirecting to tracking.
 */
export default function OrderSuccess({ orderId, onContinue, onTrack, autoRedirectMs = 6000 }) {
  const { t } = useLanguage()

  // Auto redirect to live tracking; cleared if the user navigates manually first.
  useEffect(() => {
    if (!autoRedirectMs) return
    const id = setTimeout(() => onTrack?.(), autoRedirectMs)
    return () => clearTimeout(id)
  }, [autoRedirectMs, onTrack])

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        square: i % 2 === 0
      })),
    []
  )

  return (
    <div className="relative min-h-[70vh] overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Confetti */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            className="absolute top-0 h-2.5 w-2.5"
            style={{ left: `${c.left}%`, backgroundColor: c.color, borderRadius: c.square ? 2 : '9999px' }}
            initial={{ y: '-10%', opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: c.rotate }}
            transition={{ delay: c.delay, duration: c.duration, repeat: Infinity, ease: 'easeIn' }}
          />
        ))}
      </div>

      {/* Success card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative w-full max-w-md rounded-3xl bg-white border border-crust-200 shadow-xl px-6 py-10 sm:px-10 text-center"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 text-green-600"
        >
          <svg viewBox="0 0 52 52" className="h-12 w-12">
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M15 27 l7 7 l15 -16"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.55, duration: 0.35, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl sm:text-3xl font-bold text-crust-900"
        >
          {t('order.successTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-sm text-crust-600"
        >
          {t('order.successDesc')}
        </motion.p>

        {/* Order number reveal + ETA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="rounded-2xl bg-crust-50 border border-crust-200 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-crust-500">{t('order.orderNumber')}</p>
            <p className="font-display font-bold text-lg text-oven-600 break-all">#{orderId}</p>
          </div>
          <div className="rounded-2xl bg-crust-50 border border-crust-200 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-crust-500 flex items-center justify-center gap-1">
              <Clock size={12} /> {t('order.eta')}
            </p>
            <p className="font-display font-bold text-lg text-crust-800">{t('order.etaValue')}</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-7 flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onTrack}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 transition-colors"
          >
            {t('order.trackNow')} <ArrowRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-crust-300 text-crust-800 font-semibold hover:bg-crust-100 transition-colors"
          >
            <ShoppingBag size={18} /> {t('order.continueShopping')}
          </motion.button>
        </motion.div>

        {/* Auto-redirect hint + countdown bar */}
        {autoRedirectMs > 0 && (
          <div className="mt-6">
            <p className="text-xs text-crust-400">{t('order.redirecting')}</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-crust-200">
              <motion.div
                className="h-full rounded-full bg-oven-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: autoRedirectMs / 1000, ease: 'linear' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
