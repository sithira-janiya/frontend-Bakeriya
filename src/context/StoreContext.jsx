import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, ApiError, getToken, setToken, wsUrl } from '../api/client.js'
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
  const [token, setTokenState] = useState(() => getToken())
  const [authUser, setAuthUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(!!getToken())

  const isAdmin = authUser?.role === 'admin'
  const currentUser = authUser?.role === 'customer' ? authUser : null

  const socketRef = useRef(null)
  const authRef = useRef({ token, isAdmin })
  authRef.current = { token, isAdmin }

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
      }

      socket.onmessage = (event) => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }
        if (msg.type === 'order:created' || msg.type === 'order:updated') {
          // code+status arrives for everyone (lite); full order only for admins.
          const code = msg.order?.id ?? msg.code
          const status = msg.order?.status ?? msg.status
          if (code && status) {
            setOrderUpdates((prev) => ({ ...prev, [code]: { status, at: Date.now() } }))
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
  // Returns the new order id on success; throws ApiError on failure.
  const placeOrder = useCallback(
    async (customer) => {
      if (!kitchenActive) throw new Error('The kitchen is closed for new orders right now. Please try again later.')
      if (cart.length === 0) return null
      const payload = {
        customer,
        items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty }))
      }
      const { order } = await api.placeOrder(payload)
      clearCart()
      return order.id
    },
    [cart, clearCart, kitchenActive]
  )

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const { order } = await api.updateOrderStatus(orderId, status)
    setOrders((prev) => mergeOrder(prev, order))
    return order
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

  // ---- Auth (admin + customer share one JWT slot) ----
  const applyAuth = useCallback((data) => {
    setToken(data.token)
    setTokenState(data.token)
    const u = data.user ? { ...data.user, role: data.role } : { role: data.role }
    setAuthUser(u)
    return data.role
  }, [])

  const login = useCallback(
    async (identifier, password) => applyAuth(await api.login(identifier, password)),
    [applyAuth]
  )
  const register = useCallback(async (payload) => applyAuth(await api.register(payload)), [applyAuth])
  const googleLogin = useCallback(
    async (credential) => applyAuth(await api.googleLogin(credential)),
    [applyAuth]
  )
  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setAuthUser(null)
  }, [])

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
    placeOrder,
    updateOrderStatus,
    fetchOrder,
    findOrdersByEmail,
    isAdmin,
    currentUser,
    authLoading,
    login,
    register,
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
