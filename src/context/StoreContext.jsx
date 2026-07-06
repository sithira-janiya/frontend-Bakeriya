import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { ApiError, setToken, setGuestToken, wsUrl } from '../services/httpClient.js'
import { orderService } from '../services/orderService.js'
import { authService } from '../services/authService.js'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import {
  addToCart as addToCartAction,
  updateCartQty as updateCartQtyAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  selectCart,
  selectCartCount,
  selectCartTotal
} from '../features/cart/cartSlice.js'
import { setKitchenActive as setKitchenActiveAction, selectKitchenActive } from '../features/kitchen/kitchenSlice.js'
import { fetchMenu, selectMenu, selectMenuLoading } from '../features/menu/menuSlice.js'
import {
  authApplied,
  authCleared,
  guestEntered,
  guestSessionCleared,
  hydrateMe,
  selectToken,
  selectAuthLoading,
  selectGuestSession,
  selectIsAdmin,
  selectCurrentUser
} from '../features/auth/authSlice.js'
import {
  ordersListSet,
  ordersListCleared,
  orderMerged,
  orderRemovedFromList,
  activeOrderUpserted,
  activeOrdersReconciled,
  customerOrdersRestored,
  trackingReset,
  socketOrderDeleted,
  socketOrderUpdate,
  selectOrders,
  selectOrderUpdates,
  selectActiveOrders
} from '../features/orders/ordersSlice.js'

/**
 * Thin app-data facade over the Redux store + the live WebSocket.
 *
 * State lives in the feature slices (cart/kitchen/menu/auth/orders); async API
 * calls live in the services layer. This provider only wires them together:
 * it hosts the realtime socket, runs the effects that can't live in a reducer,
 * and re-exposes everything through `useStore()` so pages/components are
 * unchanged. Nothing here throws to the render tree — every async path is
 * guarded so a failed call degrades gracefully instead of crashing the app.
 */

const StoreContext = createContext(null)

export const ORDER_STEPS = ['pending', 'cooking', 'ready', 'completed']
export const STEP_LABELS = {
  pending: 'Order Placed',
  cooking: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Collected'
}

export function StoreProvider({ children }) {
  const dispatch = useAppDispatch()

  // ---- Slice state (single source of truth) ----
  const cart = useAppSelector(selectCart)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)
  const kitchenActive = useAppSelector(selectKitchenActive)
  const menu = useAppSelector(selectMenu)
  const menuLoading = useAppSelector(selectMenuLoading)
  const orders = useAppSelector(selectOrders)
  const orderUpdates = useAppSelector(selectOrderUpdates)
  const activeOrders = useAppSelector(selectActiveOrders)
  const token = useAppSelector(selectToken)
  const authLoading = useAppSelector(selectAuthLoading)
  const guestSession = useAppSelector(selectGuestSession)
  const isAdmin = useAppSelector(selectIsAdmin)
  const currentUser = useAppSelector(selectCurrentUser)

  const socketRef = useRef(null)
  const authRef = useRef({ token, isAdmin })
  authRef.current = { token, isAdmin }
  // Order codes this browser follows over the WebSocket. Seeded once from the
  // persisted active orders; the server only streams status for codes we send.
  const trackedCodesRef = useRef(null)
  if (trackedCodesRef.current === null) {
    trackedCodesRef.current = new Set(activeOrders.map((o) => o.id))
  }

  // ---- Menu ----
  useEffect(() => {
    dispatch(fetchMenu())
  }, [dispatch])

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
          if (code) dispatch(socketOrderDeleted(code))
        } else if (msg.type === 'order:created' || msg.type === 'order:updated') {
          // code+status arrives for everyone (lite); full order only for admins.
          const code = msg.order?.id ?? msg.code
          const status = msg.order?.status ?? msg.status
          dispatch(socketOrderUpdate({ code, status, order: msg.order }))
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
  }, [dispatch])

  // Hydrate the signed-in principal from the stored token (validates it too).
  useEffect(() => {
    if (!token) {
      dispatch(authCleared())
      return
    }
    dispatch(hydrateMe())
  }, [token, dispatch])

  // When an admin is signed in, fetch the full order list and authenticate the socket.
  useEffect(() => {
    if (!isAdmin) {
      dispatch(ordersListCleared())
      return
    }
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'auth', token }))
    }
    let cancelled = false
    orderService
      .listOrders()
      .then((data) => {
        if (!cancelled) dispatch(ordersListSet(data?.orders || []))
      })
      .catch(() => {
        /* token may have expired — leave list empty */
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin, token, dispatch])

  // On load, refresh each tracked order's status once (WebSocket only pushes
  // future changes) and prune any that are gone or already collected.
  useEffect(() => {
    const ids = trackedCodesRef.current.size ? [...trackedCodesRef.current] : []
    if (ids.length === 0) return
    let cancelled = false
    Promise.all(
      ids.map((id) =>
        orderService
          .getOrder(id)
          .then((d) => ({ id, status: d?.order?.status }))
          .catch((err) => ({ id, gone: err instanceof ApiError && err.status === 404 }))
      )
    ).then((results) => {
      if (cancelled) return
      dispatch(activeOrdersReconciled(results))
      for (const r of results) {
        if (r.gone || r.status === 'completed') trackedCodesRef.current.delete(r.id)
      }
    })
    return () => {
      cancelled = true
    }
    // Run once on mount — trackedCodesRef is seeded from persisted active orders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Cart (Redux-backed) ----
  const addToCart = useCallback((item, qty = 1) => dispatch(addToCartAction(item, qty)), [dispatch])
  const updateCartQty = useCallback((id, qty) => dispatch(updateCartQtyAction(id, qty)), [dispatch])
  const removeFromCart = useCallback((id) => dispatch(removeFromCartAction(id)), [dispatch])
  const clearCart = useCallback(() => dispatch(clearCartAction()), [dispatch])

  const setKitchenActive = useCallback((active) => dispatch(setKitchenActiveAction(active)), [dispatch])

  // ---- Orders (backend + realtime) ----
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
      dispatch(activeOrderUpserted({ id: order.id, status: order.status }))
    },
    [dispatch, sendTrack]
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
      const { order, guestToken } = await orderService.placeOrder(payload)
      // Guests get a per-browser token so only they can reopen this order.
      if (guestToken) setGuestToken(guestToken)
      upsertActiveOrder(order)
      dispatch(clearCartAction())
      return order.id
    },
    [cart, dispatch, kitchenActive, upsertActiveOrder]
  )

  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      const { order } = await orderService.updateOrderStatus(orderId, status)
      dispatch(orderMerged(order))
      return order
    },
    [dispatch]
  )

  // Admin end-of-day cleanup: permanently remove a collected order. The backend
  // frees the record and broadcasts order:deleted, but we also drop it locally
  // so the initiating admin sees it vanish immediately.
  const deleteOrder = useCallback(
    async (orderId) => {
      await orderService.deleteOrder(orderId)
      dispatch(orderRemovedFromList(orderId))
      return true
    },
    [dispatch]
  )

  // Async lookups for the Track page.
  const fetchOrder = useCallback(async (code) => {
    try {
      const { order } = await orderService.getOrder(code)
      return order
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  }, [])

  const findOrdersByEmail = useCallback(async (email) => {
    const { orders: found } = await orderService.findOrdersByEmail(email)
    return found || []
  }, [])

  // When a customer is signed in, restore their in-progress orders from the
  // backend so the navbar live-status pill reappears after logout/login.
  // `activeOrders` is otherwise browser-local and gets cleared on every auth
  // change (clearGuestState), which is why an account's order messages vanished
  // on re-login. Fetching per-account also keeps one account from ever showing
  // another's orders. Runs whenever the signed-in email changes.
  const customerEmail = currentUser?.email
  useEffect(() => {
    if (!customerEmail) return
    let cancelled = false
    orderService
      .findOrdersByEmail(customerEmail)
      .then((res) => {
        if (cancelled) return
        const found = res?.orders || []
        const inProgress = found.filter((o) => o.status && o.status !== 'completed')
        if (inProgress.length === 0) return
        for (const o of inProgress) trackedCodesRef.current.add(o.id)
        sendTrack(inProgress.map((o) => o.id))
        dispatch(customerOrdersRestored(inProgress.map((o) => ({ id: o.id, status: o.status }))))
      })
      .catch(() => {
        /* not signed in / network — pill just stays empty until next event */
      })
    return () => {
      cancelled = true
    }
  }, [customerEmail, dispatch, sendTrack])

  // ---- Auth (admin + customer share one JWT slot) ----
  // Wipe the browser-local guest identity + order tracking. Guest orders live
  // only in this browser (guest token + activeOrders); they must not bleed into
  // a signed-in session, so we clear them on login and on logout.
  const clearGuestState = useCallback(() => {
    setGuestToken(null)
    trackedCodesRef.current = new Set()
    dispatch(guestSessionCleared())
    dispatch(trackingReset())
  }, [dispatch])

  const applyAuth = useCallback(
    (data) => {
      setToken(data.token)
      const user = data.user ? { ...data.user, role: data.role } : { role: data.role }
      dispatch(authApplied({ token: data.token, user }))
      // Signing in supersedes any guest session — drop the guest's leftover
      // orders so the real user never sees them.
      clearGuestState()
      return data.role
    },
    [dispatch, clearGuestState]
  )

  const login = useCallback(
    async (identifier, password) => applyAuth(await authService.login(identifier, password)),
    [applyAuth]
  )
  // Registration no longer signs you in — it returns { pendingVerification, email }.
  // The account is inert until the emailed code is confirmed via verifyEmail.
  const register = useCallback((payload) => authService.register(payload), [])
  const verifyEmail = useCallback(
    async (email, code) => applyAuth(await authService.verifyEmail(email, code)),
    [applyAuth]
  )
  const resendVerification = useCallback((email) => authService.resendVerification(email), [])
  const googleLogin = useCallback(
    async (credential) => applyAuth(await authService.googleLogin(credential)),
    [applyAuth]
  )
  // Enter the storefront as an anonymous guest (no account). Persisted so the
  // entry gate keeps letting them through across reloads until they log out.
  const enterAsGuest = useCallback(() => dispatch(guestEntered()), [dispatch])

  const logout = useCallback(() => {
    setToken(null)
    dispatch(authCleared())
    clearGuestState()
  }, [dispatch, clearGuestState])

  const requestPasswordPin = useCallback(() => authService.requestPasswordPin(), [])
  const changePassword = useCallback((pin, newPassword) => authService.changePassword(pin, newPassword), [])

  // Legacy aliases — existing admin pages keep working. Admin signs in with
  // username `admin` + password.
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

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
