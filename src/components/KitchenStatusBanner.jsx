import { AlertTriangle } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'

// Site-wide notice shown when the chef flips the kitchen to inactive (e.g.
// slammed with orders). Placing new orders is blocked while this is visible.
export default function KitchenStatusBanner() {
  const { kitchenActive } = useStore()
  if (kitchenActive) return null
  return (
    <div className="bg-red-600 text-white text-sm font-semibold px-4 py-2 flex items-center justify-center gap-2 text-center">
      <AlertTriangle size={16} className="shrink-0" />
      Kitchen temporarily closed — we're not taking new orders right now. Please check back soon.
    </div>
  )
}
