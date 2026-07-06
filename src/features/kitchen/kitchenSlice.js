// Kitchen open/closed flag. When closed, the storefront blocks new orders.
// Persisted via the store subscription in app/store.js.
import { createSlice } from '@reduxjs/toolkit'

export const KITCHEN_STORAGE_KEY = 'bakerya_kitchen_active'

// Defaults to open; guarded so a blocked localStorage can't throw at store init.
function readStoredActive() {
  try {
    const raw = localStorage.getItem(KITCHEN_STORAGE_KEY)
    return raw ? JSON.parse(raw) === true : true
  } catch {
    return true
  }
}

const kitchenSlice = createSlice({
  name: 'kitchen',
  initialState: { active: readStoredActive() },
  reducers: {
    setKitchenActive(state, action) {
      state.active = Boolean(action.payload)
    }
  }
})

export const { setKitchenActive } = kitchenSlice.actions
export const selectKitchenActive = (state) => state.kitchen.active
export default kitchenSlice.reducer
