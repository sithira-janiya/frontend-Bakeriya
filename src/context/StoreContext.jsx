import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Frontend-only data layer.
 *
 * Orders + cart are persisted to localStorage and broadcast across browser
 * tabs with BroadcastChannel, so opening the Chef Panel in one tab and the
 * Track Order page in another behaves like a live, real-time app.
 *
 * When the Node.js + Pocketbase backend is wired up, replace the bodies of
 * placeOrder / updateOrderStatus / loadOrders with real API + WebSocket
 * calls and keep the same context shape — pages won't need to change.
 */

const StoreContext = createContext(null)

const ORDERS_KEY = 'bakerya_orders'
const CART_KEY = 'bakerya_cart'
const ADMIN_AUTH_KEY = 'bakerya_admin_auth'
export const ADMIN_PIN = '1234' // demo only — move to env/backend auth later

export const ORDER_STEPS = ['pending', 'cooking', 'ready', 'completed']
export const STEP_LABELS = {
  pending: 'Order Placed',
  cooking: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Collected'
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable — ignore in this demo
  }
}

function makeOrderId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `ORD-${ts}-${rand}`
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []))
  const [orders, setOrders] = useState(() => readJSON(ORDERS_KEY, []))
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true')
  const channelRef = useRef(null)

  // Set up cross-tab live sync
  useEffect(() => {
    let channel
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('bakerya_live')
      channel.onmessage = (event) => {
        if (event.data?.type === 'orders-updated') {
          setOrders(event.data.orders)
        }
      }
      channelRef.current = channel
    }

    function onStorage(e) {
      if (e.key === ORDERS_KEY) {
        setOrders(readJSON(ORDERS_KEY, []))
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      channel?.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    writeJSON(CART_KEY, cart)
  }, [cart])

  const broadcastOrders = useCallback((next) => {
    writeJSON(ORDERS_KEY, next)
    channelRef.current?.postMessage({ type: 'orders-updated', orders: next })
  }, [])

  // ---- Cart ----
  const addToCart = useCallback((item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + qty } : c))
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty }]
    })
  }, [])

  const updateCartQty = useCallback((id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((c) => c.id !== id)
      return prev.map((c) => (c.id === id ? { ...c, qty } : c))
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, c) => sum + c.qty * c.price, 0), [cart])

  // ---- Orders ----
  const placeOrder = useCallback(
    (customer) => {
      if (cart.length === 0) return null
      const order = {
        id: makeOrderId(),
        customer,
        items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
        total: cart.reduce((sum, c) => sum + c.qty * c.price, 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
        statusHistory: [{ status: 'pending', at: new Date().toISOString() }]
      }
      setOrders((prev) => {
        const next = [order, ...prev]
        broadcastOrders(next)
        return next
      })
      clearCart()
      return order.id
    },
    [cart, clearCart, broadcastOrders]
  )

  const updateOrderStatus = useCallback(
    (orderId, status) => {
      setOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId
            ? { ...o, status, statusHistory: [...o.statusHistory, { status, at: new Date().toISOString() }] }
            : o
        )
        broadcastOrders(next)
        return next
      })
    },
    [broadcastOrders]
  )

  const getOrderById = useCallback((id) => orders.find((o) => o.id === id) || null, [orders])

  const findOrdersByEmail = useCallback(
    (email) => orders.filter((o) => o.customer?.email?.toLowerCase() === email.toLowerCase()),
    [orders]
  )

  // ---- Admin auth ----
  const loginAdmin = useCallback((pin) => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    setIsAdmin(false)
  }, [])

  const value = {
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    orders,
    placeOrder,
    updateOrderStatus,
    getOrderById,
    findOrdersByEmail,
    isAdmin,
    loginAdmin,
    logoutAdmin
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
