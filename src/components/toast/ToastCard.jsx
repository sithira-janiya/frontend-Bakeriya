import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { BellRing, Flame, PartyPopper, ReceiptText, Sparkles, TriangleAlert, X } from 'lucide-react'

/**
 * A single animated toast.
 *
 *  - Springs in from the right, exits by sliding out; `layout` reflows the stack.
 *  - The icon chip has a soft ping halo and a per-variant idle motion (the
 *    "cooking" flame flickers, everything else bobs gently).
 *  - The bottom bar is the auto-dismiss timer *and* its visual: a single
 *    MotionValue drives the width and fires `onDismiss` when it empties.
 *    Hovering/focusing pauses it, leaving resumes from where it stopped.
 */

const THEME = {
  placed:    { Icon: ReceiptText,   chip: 'bg-amber-500',   bar: 'bg-amber-500',   glow: 'bg-amber-400/40',   emoji: '🧾' },
  cooking:   { Icon: Flame,         chip: 'bg-oven-500',    bar: 'bg-oven-500',    glow: 'bg-oven-500/40',    emoji: '🔥' },
  ready:     { Icon: BellRing,      chip: 'bg-emerald-500', bar: 'bg-emerald-500', glow: 'bg-emerald-400/40', emoji: '🛎️' },
  completed: { Icon: PartyPopper,   chip: 'bg-emerald-500', bar: 'bg-emerald-500', glow: 'bg-emerald-400/40', emoji: '🎉' },
  success:   { Icon: Sparkles,      chip: 'bg-emerald-500', bar: 'bg-emerald-500', glow: 'bg-emerald-400/40', emoji: '✨' },
  error:     { Icon: TriangleAlert, chip: 'bg-red-500',     bar: 'bg-red-500',     glow: 'bg-red-400/40',     emoji: '⚠️' },
  info:      { Icon: Sparkles,      chip: 'bg-sky-500',     bar: 'bg-sky-500',     glow: 'bg-sky-400/40',     emoji: '🔔' }
}

export default function ToastCard({ toast, onDismiss }) {
  const theme = THEME[toast.variant] || THEME.info
  const { Icon } = theme
  const duration = toast.duration ?? 5200
  const progress = useMotionValue(1)
  const animRef = useRef(null)

  const run = (fraction) => {
    animRef.current?.stop()
    animRef.current = animate(progress, 0, {
      duration: Math.max((duration / 1000) * fraction, 0.01),
      ease: 'linear',
      onComplete: () => onDismiss(toast.id)
    })
  }

  useEffect(() => {
    run(1)
    return () => animRef.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pause = () => animRef.current?.stop()
  const resume = () => run(progress.get())

  const idle =
    toast.variant === 'cooking'
      ? { rotate: [0, -9, 8, -6, 0], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } }
      : { y: [0, -2, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 72, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 110, scale: 0.9, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.6 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 90 || info.velocity.x > 600) onDismiss(toast.id)
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      role="status"
      aria-live="polite"
      className="pointer-events-auto relative w-[92vw] max-w-[360px] cursor-grab overflow-hidden rounded-2xl border border-crust-200 bg-crust-50/95 shadow-2xl shadow-black/10 backdrop-blur-md active:cursor-grabbing"
    >
      <span className={`pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full blur-2xl ${theme.glow}`} />

      <div className="relative flex items-start gap-3 p-4">
        <div className="relative shrink-0">
          <span className={`absolute inset-0 rounded-xl opacity-40 ${theme.chip} animate-ping`} />
          <motion.span
            animate={idle}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md ${theme.chip}`}
          >
            <Icon size={20} strokeWidth={2.2} />
          </motion.span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{toast.emoji ?? theme.emoji}</span>
            <p className="truncate font-display text-[15px] font-bold text-crust-900">{toast.title}</p>
          </div>
          {toast.message && <p className="mt-0.5 text-[13px] leading-snug text-crust-500">{toast.message}</p>}
          {toast.code && (
            <span className="mt-1.5 inline-block rounded-md bg-crust-200/70 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-crust-700">
              #{toast.code}
            </span>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-lg p-1 text-crust-400 transition-colors hover:bg-crust-200/60 hover:text-crust-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="h-1 w-full bg-crust-200/50">
        <motion.div className={`h-full ${theme.bar}`} style={{ scaleX: progress, transformOrigin: 'left' }} />
      </div>
    </motion.div>
  )
}
