// Redux store. Slices are registered here; each feature owns its own slice
// under src/features/<name>/. The whole app data layer now lives in Redux;
// StoreContext is a thin facade over these slices + the realtime socket.
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice.js'
import toastReducer from '../features/toast/toastSlice.js'
import cartReducer, { CART_STORAGE_KEY } from '../features/cart/cartSlice.js'
import kitchenReducer, { KITCHEN_STORAGE_KEY } from '../features/kitchen/kitchenSlice.js'
import menuReducer from '../features/menu/menuSlice.js'
import authReducer, { GUEST_STORAGE_KEY } from '../features/auth/authSlice.js'
import ordersReducer, { ACTIVE_ORDERS_STORAGE_KEY } from '../features/orders/ordersSlice.js'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    toast: toastReducer,
    cart: cartReducer,
    kitchen: kitchenReducer,
    menu: menuReducer,
    auth: authReducer,
    orders: ordersReducer
  }
})

// Persist the browser-local slices to localStorage. Guarded so a blocked/full
// storage never throws, and diffed by reference so we only write the slice that
// actually changed (immer gives us a fresh reference on every real update).
function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — ignore */
  }
}

let prev = {
  cart: store.getState().cart.items,
  kitchen: store.getState().kitchen.active,
  active: store.getState().orders.active,
  guest: store.getState().auth.guestSession
}
store.subscribe(() => {
  const state = store.getState()
  if (state.cart.items !== prev.cart) {
    prev.cart = state.cart.items
    persist(CART_STORAGE_KEY, prev.cart)
  }
  if (state.kitchen.active !== prev.kitchen) {
    prev.kitchen = state.kitchen.active
    persist(KITCHEN_STORAGE_KEY, prev.kitchen)
  }
  if (state.orders.active !== prev.active) {
    prev.active = state.orders.active
    persist(ACTIVE_ORDERS_STORAGE_KEY, prev.active)
  }
  if (state.auth.guestSession !== prev.guest) {
    prev.guest = state.auth.guestSession
    persist(GUEST_STORAGE_KEY, prev.guest)
  }
})
