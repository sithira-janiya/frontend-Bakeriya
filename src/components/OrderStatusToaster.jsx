import { useEffect, useRef } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

/**
 * Bridges live order status -> toast notifications, account-wise.
 *
 * `activeOrders` is already scoped to the current principal (it's wiped on
 * login/logout by clearGuestState), so a signed-in customer, a guest, and an
 * admin each only ever get toasts for the orders *they* placed. `orderUpdates`
 * carries the live status pushed over the WebSocket.
 *
 * We keep a baseline of statuses seen so far and only toast on an actual
 * transition. The baseline is seeded silently on first render so reloading the
 * page (which rehydrates in-progress orders) never replays old notifications.
 * A `completed` order is dropped from `activeOrders` the instant it lands, so
 * we also watch ids we've already seen — that's how the "Collected 🎉" toast
 * still fires even though the order just left the active list.
 */

const STATUS_TOAST = {
  pending:   { variant: 'placed',    title: 'Order placed!',     message: "We've sent it to the kitchen — hang tight." },
  cooking:   { variant: 'cooking',   title: 'Now baking',        message: 'Your order is in the oven.' },
  ready:     { variant: 'ready',     title: 'Ready for pickup!', message: 'Fresh & hot — come grab it.' },
  completed: { variant: 'completed', title: 'Enjoy! 🎉',         message: 'Order collected. Thanks for ordering 💛' }
}

export default function OrderStatusToaster() {
  const { activeOrders, orderUpdates } = useStore()
  const { showToast } = useToast()
  const seenRef = useRef(new Map()) // orderId -> last status toasted
  const initedRef = useRef(false)

  useEffect(() => {
    // The set of orders that are "mine": currently active, plus any we were
    // already tracking that still have a fresh update (e.g. just completed).
    const mine = new Set(activeOrders.map((o) => o.id))
    for (const id of seenRef.current.keys()) {
      if (orderUpdates[id]) mine.add(id)
    }

    const current = new Map()
    for (const id of mine) {
      const status = orderUpdates[id]?.status ?? activeOrders.find((o) => o.id === id)?.status
      if (status) current.set(id, status)
    }

    // First pass just records where things stand — no toasts for pre-existing
    // orders on load. (Also keeps StrictMode's double-invoke quiet.)
    if (!initedRef.current) {
      seenRef.current = current
      initedRef.current = true
      return
    }

    for (const [id, status] of current) {
      if (seenRef.current.get(id) === status) continue
      const isNew = !seenRef.current.has(id)
      const cfg = STATUS_TOAST[status]
      if (cfg) {
        showToast({
          ...cfg,
          // A brand-new order gets a little extra celebration on the headline.
          title: isNew && status === 'pending' ? 'Order placed! 🎉' : cfg.title,
          code: id,
          dedupeKey: `order-${id}`
        })
      }
    }

    seenRef.current = current
  }, [activeOrders, orderUpdates, showToast])

  return null
}
