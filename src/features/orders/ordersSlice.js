// Order state:
//   - list:    the admin's full order list (chef panel).
//   - updates: code -> { status, at } — latest status seen for any order this
//              browser follows; powers the navbar pill + toasts.
//   - active:  [{ id, status }] in-progress orders this browser placed/follows.
//
// Async API calls live in StoreContext (orchestrated with the socket + cart);
// this slice only owns state and the pure transitions applied to it. Every
// reducer is written to be safe against missing/partial payloads.
import { createSlice } from '@reduxjs/toolkit'

export const ACTIVE_ORDERS_STORAGE_KEY = 'bakerya_active_orders'

function readStoredActiveOrders() {
  try {
    const raw = localStorage.getItem(ACTIVE_ORDERS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mergeOrderInto(list, order) {
  const idx = list.findIndex((o) => o.id === order.id)
  if (idx === -1) list.unshift(order)
  else list[idx] = order
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    updates: {},
    active: readStoredActiveOrders()
  },
  reducers: {
    // ---- Admin order list ----
    ordersListSet(state, action) {
      state.list = Array.isArray(action.payload) ? action.payload : []
    },
    ordersListCleared(state) {
      state.list = []
    },
    orderMerged(state, action) {
      if (action.payload?.id) mergeOrderInto(state.list, action.payload)
    },
    orderRemovedFromList(state, action) {
      state.list = state.list.filter((o) => o.id !== action.payload)
    },

    // ---- Active (navbar pill) ----
    activeOrderUpserted(state, action) {
      const { id, status } = action.payload || {}
      if (!id) return
      state.active = state.active.filter((o) => o.id !== id)
      if (status !== 'completed') state.active.unshift({ id, status })
    },
    // Reconcile tracked orders on load: drop gone/collected, refresh the rest.
    activeOrdersReconciled(state, action) {
      const results = Array.isArray(action.payload) ? action.payload : []
      for (const r of results) {
        if (!r?.id) continue
        if (r.gone || r.status === 'completed') {
          state.active = state.active.filter((o) => o.id !== r.id)
        } else if (r.status) {
          const line = state.active.find((o) => o.id === r.id)
          if (line) line.status = r.status
        }
      }
    },
    // Merge a signed-in customer's in-progress orders back in after re-login.
    customerOrdersRestored: {
      reducer(state, action) {
        const { inProgress, at } = action.payload
        const byId = new Map(state.active.map((o) => [o.id, o]))
        for (const o of inProgress) byId.set(o.id, { id: o.id, status: o.status })
        state.active = [...byId.values()]
        for (const o of inProgress) {
          if (!state.updates[o.id]) state.updates[o.id] = { status: o.status, at }
        }
      },
      prepare(inProgress) {
        return { payload: { inProgress: Array.isArray(inProgress) ? inProgress : [], at: Date.now() } }
      }
    },
    // Login/logout wipes browser-local guest order tracking.
    trackingReset(state) {
      state.active = []
      state.updates = {}
    },

    // ---- Live WebSocket events ----
    socketOrderDeleted(state, action) {
      const code = action.payload
      if (!code) return
      state.list = state.list.filter((o) => o.id !== code)
      state.active = state.active.filter((o) => o.id !== code)
      delete state.updates[code]
    },
    socketOrderUpdate: {
      reducer(state, action) {
        const { code, status, order, at } = action.payload
        if (code && status) {
          state.updates[code] = { status, at }
          const idx = state.active.findIndex((o) => o.id === code)
          if (idx !== -1) {
            if (status === 'completed') state.active.splice(idx, 1)
            else state.active[idx].status = status
          }
        }
        if (order?.id) mergeOrderInto(state.list, order)
      },
      prepare({ code, status, order }) {
        return { payload: { code, status, order, at: Date.now() } }
      }
    }
  }
})

export const {
  ordersListSet,
  ordersListCleared,
  orderMerged,
  orderRemovedFromList,
  activeOrderUpserted,
  activeOrdersReconciled,
  customerOrdersRestored,
  trackingReset,
  socketOrderDeleted,
  socketOrderUpdate
} = ordersSlice.actions

export const selectOrders = (state) => state.orders.list
export const selectOrderUpdates = (state) => state.orders.updates
export const selectActiveOrders = (state) => state.orders.active

export default ordersSlice.reducer
