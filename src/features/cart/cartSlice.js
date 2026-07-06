// Client-side cart. Lives entirely in the browser (Redux + localStorage) until
// checkout, when placeOrder ships it to the backend. Persistence is handled by
// the store subscription in app/store.js; the reducer stays pure.
import { createSlice } from '@reduxjs/toolkit'

export const CART_STORAGE_KEY = 'bakerya_cart'

// Guarded read so a blocked/absent localStorage can never throw at store init.
function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: readStoredCart() },
  reducers: {
    addToCart: {
      reducer(state, action) {
        const item = action.payload
        const existing = state.items.find((c) => c.id === item.id)
        if (existing) existing.qty += item.qty
        else state.items.push(item)
      },
      // Normalise name to the { en, … } shape the rest of the app expects, so
      // callers can pass either a string or an already-localised object.
      prepare(item, qty = 1) {
        const name = typeof item?.name === 'object' ? item.name : { en: item?.name }
        return { payload: { id: item?.id, name, price: item?.price, emoji: item?.emoji, qty } }
      }
    },
    updateCartQty: {
      reducer(state, action) {
        const { id, qty } = action.payload
        if (qty <= 0) {
          state.items = state.items.filter((c) => c.id !== id)
          return
        }
        const line = state.items.find((c) => c.id === id)
        if (line) line.qty = qty
      },
      prepare(id, qty) {
        return { payload: { id, qty } }
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    }
  }
})

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions

export const selectCart = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((sum, c) => sum + c.qty, 0)
export const selectCartTotal = (state) => state.cart.items.reduce((sum, c) => sum + c.qty * c.price, 0)

export default cartSlice.reducer
