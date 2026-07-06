// App-wide toast notifications.
//
// Toasts are kept newest-first, capped at MAX_VISIBLE, and can carry a
// `dedupeKey` so repeated updates about the *same* thing (e.g. one order moving
// pending -> cooking -> ready) replace each other instead of stacking up. Ids
// are generated in the action's prepare step, so a dispatched `showToast`
// action already carries the id the caller can read back.
import { createSlice, nanoid } from '@reduxjs/toolkit'

const MAX_VISIBLE = 4

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    showToast: {
      reducer(state, action) {
        const toast = action.payload
        const rest = toast.dedupeKey
          ? state.items.filter((t) => t.dedupeKey !== toast.dedupeKey)
          : state.items
        state.items = [toast, ...rest].slice(0, MAX_VISIBLE)
      },
      prepare(toast) {
        // Sensible defaults; caller overrides via the passed toast object.
        return { payload: { variant: 'info', duration: 5200, ...toast, id: nanoid() } }
      }
    },
    dismiss(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    }
  }
})

export const { showToast, dismiss } = toastSlice.actions
export const selectToasts = (state) => state.toast.items
export default toastSlice.reducer
