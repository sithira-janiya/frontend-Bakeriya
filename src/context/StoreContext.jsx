import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, ApiError, getToken, setToken, setGuestToken, wsUrl } from '../api/client.js'
import { menuItems as fallbackMenu } from '../data/menuData.js'

/**
 * App data layer, backed by the Node.js + Pocketbase backend.
 *
 *  - Menu is fetched from GET /api/menu (falls back to the bundled sample menu
 *    if the backend is unreachable, so the storefront still renders).
 *  - Orders are created/read/updated through the REST API.
 *  - A WebSocket (/ws) pushes live order updates: the Chef Panel sees new orders
 *    and the customer Track page sees status changes in real time, no polling.
 *  - Cart stays client-side (localStorage) — it's per-browser until checkout.
 */

const StoreContext = createContext(null)

const CART_KEY = 'bakerya_cart'
const KITCHEN_ACTIVE_KEY = 'bakerya_kitchen_active'
// Set once a visitor chooses "Continue as guest" on the login gate. Lets them
// browse/order/track without an account; cleared on logout. Per-browser only.
const GUEST_KEY = 'bakerya_guest'
// Orders this browser placed that are still in progress. Powers the navbar
// live-status pill. Each entry: { id, status }. Pruned once completed.
const ACTIVE_ORDERS_KEY = 'bakerya_active_orders'

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
    /* storage unavailable — ignore */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []))
  const [kitchenActive, setKitchenActiveState] = useState(() => readJSON(KITCHEN_ACTIVE_KEY, true))
  const [menu, setMenu] = useState([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [orderUpdates, setOrderUpdates] = useState({}) // code -> { status, at }
  const [activeOrders, setActiveOrders] = useState(() => readJSON(ACTIVE_ORDERS_KEY, []))
  const [token, setTokenState] = useState(() => getToken())
  const [authUser, setAuthUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(!!getToken())
  const [guestSession, setGuestSession] = useState(() => readJSON(GUEST_KEY, false) === true)

  const isAdmin = authUser?.role === 'admin'
  const currentUser = authUser?.role === 'customer' ? authUser : null

  const socketRef = useRef(null)
  const authRef = useRef({ token, isAdmin })
  authRef.current = { token, isAdmin }
  // Order codes this browser follows over the WebSocket. Seeded from the
  // persisted active orders; the server only streams status for codes we send.
  const trackedCodesRef = useRef(new Set(activeOrders.map((o) => o.id)))

  // ---- Menu ----
  useEffect(() => {
    let cancelled = false
    setMenuLoading(true)
    api
      .getMenu()
      .then((data) => {
        if (!cancelled) setMenu(data.items || [])
      })
      .catch(() => {
        if (!cancelled) setMenu(fallbackMenu) // offline / backend down
      })
      .finally(() => {
        if (!cancelled) setMenuLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ---- WebSocket live updates ----
  useEffect(() => {
    let closedByUs = false
    let reconnectTimer = null

    function connect() {
      let socket
      try {
        socket = new WebSocket(wsUrl())
      } catch {
        reconnectTimer = setTimeout(connect, 3000)
        return
      }
      socketRef.current = socket

      socket.onopen = () => {
        const { token: tok, isAdmin: admin } = authRef.current
        if (tok && admin) {
          socket.send(JSON.stringify({ type: 'auth', token: tok }))
        }
        // Re-subscribe to our tracked orders (survives reconnects).
        const codes = [...trackedCodesRef.current]
        if (codes.length) socket.send(JSON.stringify({ type: 'track', codes }))
      }

      socket.onmessage = (event) => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }
        if (msg.type === 'order:deleted') {
          // An admin cleared a collected order — drop it everywhere.
          const code = msg.order?.id ?? msg.code
          if (code) {
            setOrders((prev) => prev.filter((o) => o.id !== code))
            setActiveOrders((prev) => prev.filter((o) => o.id !== code))
            setOrderUpdates((prev) => {
              if (!(code in prev)) return prev
              const next = { ...prev }
              delete next[code]
              return next
            })
          }
        } else if (msg.type === 'order:created' || msg.type === 'order:updated') {
          // code+status arrives for everyone (lite); full order only for admins.
          const code = msg.order?.id ?? msg.code
          const status = msg.order?.status ?? msg.status
          if (code && status) {
            setOrderUpdates((prev) => ({ ...prev, [code]: { status, at: Date.now() } }))
            // Keep the navbar's active-order list in sync; drop it once collected.
            setActiveOrders((prev) => {
              if (!prev.some((o) => o.id === code)) return prev
              if (status === 'completed') return prev.filter((o) => o.id !== code)
              return prev.map((o) => (o.id === code ? { ...o, status } : o))
            })
          }
          if (msg.order) {
            setOrders((prev) => mergeOrder(prev, msg.order))
          }
        }
      }

      socket.onclose = () => {
        if (!closedByUs) reconnectTimer = setTimeout(connect, 3000)
      }
      socket.onerror = () => {
        try {
          socket.close()
        } catch {
          /* ignore */
        }
      }
    }

    connect()
    return () => {
      closedByUs = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      try {
        socketRef.current?.close()
      } catch {
        /* ignore */
      }
    }
  }, [])

  // Hydrate the signed-in principal from the stored token (validates it too).
  useEffect(() => {
    if (!token) {
      setAuthUser(null)
      setAuthLoading(false)
      return
    }
    let cancelled = false
    setAuthLoading(true)
    api
      .me()
      .then((data) => {
        if (cancelled) return
        const u = data.user || {}
        setAuthUser(u.role ? u : { ...u, role: 'customer' })
      })
      .catch(() => {
        if (cancelled) return
        setToken(null)
        setTokenState(null)
        setAuthUser(null)
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  // When an admin is signed in, fetch the full order list and authenticate the socket.
  useEffect(() => {
    if (!isAdmin) {
      setOrders([])
      return
    }
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'auth', token }))
    }
    let cancelled = false
    api
      .listOrders()
      .then((data) => {
        if (!cancelled) setOrders(data.orders || [])
      })
      .catch(() => {
        /* token may have expired — leave list empty */
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin, token])

  useEffect(() => {
    writeJSON(CART_KEY, cart)
  }, [cart])

  useEffect(() => {
    writeJSON(KITCHEN_ACTIVE_KEY, kitchenActive)
  }, [kitchenActive])

  useEffect(() => {
    writeJSON(ACTIVE_ORDERS_KEY, activeOrders)
  }, [activeOrders])

  // On load, refresh each tracked order's status once (WebSocket only pushes
  // future changes) and prune any that are gone or already collected.
  useEffect(() => {
    const ids = trackedCodesRef.current.size ? [...trackedCodesRef.current] : []
    if (ids.length === 0) return
    let cancelled = false
    Promise.all(
      ids.map((id) =>
        api
          .getOrder(id)
          .then((d) => ({ id, status: d.order?.status }))
          .catch((err) => ({ id, gone: err instanceof ApiError && err.status === 404 }))
      )
    ).then((results) => {
      if (cancelled) return
      setActiveOrders((prev) => {
        let next = prev
        for (const r of results) {
          if (r.gone || r.status === 'completed') {
            next = next.filter((o) => o.id !== r.id)
            trackedCodesRef.current.delete(r.id)
          } else if (r.status) {
            next = next.map((o) => (o.id === r.id ? { ...o, status: r.status } : o))
          }
        }
        return next
      })
    })
    return () => {
      cancelled = true
    }
    // Run once on mount — trackedCodesRef is seeded from persisted active orders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Cart (client-side) ----
  const addToCart = useCallback((item, qty = 1) => {
    const name = typeof item.name === 'object' ? item.name : { en: item.name }
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + qty } : c))
      }
      return [...prev, { id: item.id, name, price: item.price, emoji: item.emoji, qty }]
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

  const setKitchenActive = useCallback((active) => setKitchenActiveState(Boolean(active)), [])

  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, c) => sum + c.qty * c.price, 0), [cart])

  // ---- Orders (backend) ----
  // Subscribe this browser to live status for an order code (idempotent).
  const sendTrack = useCallback((codes) => {
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN && codes.length) {
      socket.send(JSON.stringify({ type: 'track', codes }))
    }
  }, [])

  const trackOrder = useCallback(
    (code) => {
      if (!code) return
      trackedCodesRef.current.add(code)
      sendTrack([code])
    },
    [sendTrack]
  )

  // Add/update an order in the navbar's in-progress list (dropped once collected).
  const upsertActiveOrder = useCallback(
    (order) => {
      if (!order?.id) return
      trackedCodesRef.current.add(order.id)
      sendTrack([order.id])
      setActiveOrders((prev) => {
        const rest = prev.filter((o) => o.id !== order.id)
        if (order.status === 'completed') return rest
        return [{ id: order.id, status: order.status }, ...rest]
      })
    },
    [sendTrack]
  )

  // Returns the new order id on success; throws ApiError on failure.
  const placeOrder = useCallback(
    async (customer) => {
      if (!kitchenActive) throw new Error('The kitchen is closed for new orders right now. Please try again later.')
      if (cart.length === 0) return null
      const payload = {
        customer,
        items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty }))
      }
      const { order, guestToken } = await api.placeOrder(payload)
      // Guests get a per-browser token so only they can reopen this order.
      if (guestToken) setGuestToken(guestToken)
      upsertActiveOrder(order)
      clearCart()
      return order.id
    },
    [cart, clearCart, kitchenActive, upsertActiveOrder]
  )

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const { order } = await api.updateOrderStatus(orderId, status)
    setOrders((prev) => mergeOrder(prev, order))
    return order
  }, [])

  // Admin end-of-day cleanup: permanently remove a collected order. The backend
  // frees the record and broadcasts order:deleted, but we also drop it locally
  // so the initiating admin sees it vanish immediately.
  const deleteOrder = useCallback(async (orderId) => {
    await api.deleteOrder(orderId)
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    return true
  }, [])

  // Async lookups for the Track page.
  const fetchOrder = useCallback(async (code) => {
    try {
      const { order } = await api.getOrder(code)
      return order
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  }, [])

  const findOrdersByEmail = useCallback(async (email) => {
    const { orders: found } = await api.findOrdersByEmail(email)
    return found || []
  }, [])

  // When a customer is signed in, restore their in-progress orders from the
  // backend so the navbar live-status pill reappears after logout/login.
  // `activeOrders` is otherwise browser-local and gets cleared on every auth
  // change (see clearGuestState), which is why an account's order messages
  // vanished on re-login. Fetching per-account also keeps one account from
  // ever showing another's orders. Runs whenever the signed-in email changes.
  const customerEmail = currentUser?.email
  useEffect(() => {
    if (!customerEmail) return
    let cancelled = false
    findOrdersByEmail(customerEmail)
      .then((found) => {
        if (cancelled) return
        const inProgress = found.filter((o) => o.status && o.status !== 'completed')
        if (inProgress.length === 0) return
        for (const o of inProgress) trackedCodesRef.current.add(o.id)
        sendTrack(inProgress.map((o) => o.id))
        setActiveOrders((prev) => {
          const byId = new Map(prev.map((o) => [o.id, o]))
          for (const o of inProgress) byId.set(o.id, { id: o.id, status: o.status })
          return [...byId.values()]
        })
        setOrderUpdates((prev) => {
          const next = { ...prev }
          for (const o of inProgress) {
            // Don't clobber a fresher live push we may have already received.
            if (!next[o.id]) next[o.id] = { status: o.status, at: Date.now() }
          }
          return next
        })
      })
      .catch(() => {
        /* not signed in / network — pill just stays empty until next event */
      })
    return () => {
      cancelled = true
    }
  }, [customerEmail, findOrdersByEmail, sendTrack])

  // ---- Auth (admin + customer share one JWT slot) ----
  // Wipe the browser-local guest identity + order tracking. Guest orders live
  // only in this browser (guest token + activeOrders); they must not bleed into
  // a signed-in session, so we clear them on login and on logout.
  const clearGuestState = useCallback(() => {
    writeJSON(GUEST_KEY, false)
    setGuestSession(false)
    setGuestToken(null)
    trackedCodesRef.current = new Set()
    setActiveOrders([])
    setOrderUpdates({})
  }, [])

  const applyAuth = useCallback(
    (data) => {
      setToken(data.token)
      setTokenState(data.token)
      const u = data.user ? { ...data.user, role: data.role } : { role: data.role }
      setAuthUser(u)
      // Signing in supersedes any guest session — drop the guest's leftover
      // orders so the real user never sees them.
      clearGuestState()
      return data.role
    },
    [clearGuestState]
  )

  const login = useCallback(
    async (identifier, password) => applyAuth(await api.login(identifier, password)),
    [applyAuth]
  )
  // Registration no longer signs you in — it returns { pendingVerification, email }.
  // The account is inert until the emailed code is confirmed via verifyEmail.
  const register = useCallback((payload) => api.register(payload), [])
  const verifyEmail = useCallback(
    async (email, code) => applyAuth(await api.verifyEmail(email, code)),
    [applyAuth]
  )
  const resendVerification = useCallback((email) => api.resendVerification(email), [])
  const googleLogin = useCallback(
    async (credential) => applyAuth(await api.googleLogin(credential)),
    [applyAuth]
  )
  // Enter the storefront as an anonymous guest (no account). Persisted so the
  // entry gate keeps letting them through across reloads until they log out.
  const enterAsGuest = useCallback(() => {
    writeJSON(GUEST_KEY, true)
    setGuestSession(true)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setAuthUser(null)
    clearGuestState()
  }, [clearGuestState])

  const requestPasswordPin = useCallback(() => api.requestPasswordPin(), [])
  const changePassword = useCallback((pin, newPassword) => api.changePassword(pin, newPassword), [])

  // Legacy aliases — existing admin pages keep working until Phase 3 moves them
  // to the unified /login page. Admin signs in with username `admin` + password.
  const loginAdmin = useCallback(
    async (secret) => {
      try {
        return (await login('admin', secret)) === 'admin'
      } catch {
        return false
      }
    },
    [login]
  )
  const logoutAdmin = logout

  const value = {
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    menu,
    menuLoading,
    orders,
    orderUpdates,
    activeOrders,
    placeOrder,
    updateOrderStatus,
    deleteOrder,
    fetchOrder,
    trackOrder,
    findOrdersByEmail,
    isAdmin,
    currentUser,
    guestSession,
    enterAsGuest,
    authLoading,
    login,
    register,
    verifyEmail,
    resendVerification,
    googleLogin,
    logout,
    requestPasswordPin,
    changePassword,
    loginAdmin,
    logoutAdmin,
    kitchenActive,
    setKitchenActive
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function mergeOrder(list, order) {
  const idx = list.findIndex((o) => o.id === order.id)
  if (idx === -1) return [order, ...list]
  const next = [...list]
  next[idx] = order
  return next
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
