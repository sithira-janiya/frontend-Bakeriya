import { AnimatePresence } from 'framer-motion'
import ToastCard from './ToastCard.jsx'

/**
 * Fixed top-right stack. The container ignores pointer events so it never
 * blocks the page; individual cards re-enable them. `AnimatePresence` drives
 * the exit animation, and each card's `layout` prop makes the rest of the
 * stack glide into place when one is removed.
 */
export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-end gap-3 p-4 sm:p-6"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
