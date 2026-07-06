// Redux store. Slices are registered here; each feature owns its own slice
// under src/features/<name>/. Migration is incremental — theme, toast, cart and
// kitchen live in Redux now; auth/orders/menu follow in a later phase while the
// rest of the app keeps using StoreContext until then.
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice.js'
import toastReducer from '../features/toast/toastSlice.js'
import cartReducer, { CART_STORAGE_KEY } from '../features/cart/cartSlice.js'
import kitchenReducer, { KITCHEN_STORAGE_KEY } from '../features/kitchen/kitchenSlice.js'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    toast: toastReducer,
    cart: cartReducer,
    kitchen: kitchenReducer
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

let prevCart = store.getState().cart.items
let prevKitchen = store.getState().kitchen.active
store.subscribe(() => {
  const state = store.getState()
  if (state.cart.items !== prevCart) {
    prevCart = state.cart.items
    persist(CART_STORAGE_KEY, prevCart)
  }
  if (state.kitchen.active !== prevKitchen) {
    prevKitchen = state.kitchen.active
    persist(KITCHEN_STORAGE_KEY, prevKitchen)
  }
})
