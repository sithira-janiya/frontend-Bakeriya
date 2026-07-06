// Auth state for the signed-in principal (admin or customer) plus the anonymous
// guest-session flag. The token itself is mirrored in localStorage by the
// httpClient; here we track it in state so effects can react to sign-in/out.
//
// Orchestration that spans slices (clearing guest order-tracking on login,
// wiping the guest token) lives in StoreContext — this slice stays pure.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService.js'
import { getToken, setToken } from '../../services/httpClient.js'

export const GUEST_STORAGE_KEY = 'bakerya_guest'

function readStoredGuest() {
  try {
    return localStorage.getItem(GUEST_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Validate the stored token by loading the current principal. On failure the
// token is cleared (both here and in localStorage) so a stale token can't wedge
// the UI in a signed-in-looking state.
export const hydrateMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.me()
    const u = data?.user || {}
    return u.role ? u : { ...u, role: 'customer' }
  } catch {
    setToken(null)
    return rejectWithValue(null)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken(),
    user: null,
    // Only "loading" when we actually have a token to validate on boot.
    loading: !!getToken(),
    guestSession: readStoredGuest()
  },
  reducers: {
    // A successful login/register-verify/google sign-in.
    authApplied(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.loading = false
      state.guestSession = false
    },
    // Sign-out (also used when a token turns out to be invalid).
    authCleared(state) {
      state.token = null
      state.user = null
      state.loading = false
    },
    guestEntered(state) {
      state.guestSession = true
    },
    guestSessionCleared(state) {
      state.guestSession = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateMe.pending, (state) => {
        state.loading = true
      })
      .addCase(hydrateMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(hydrateMe.rejected, (state) => {
        state.token = null
        state.user = null
        state.loading = false
      })
  }
})

export const { authApplied, authCleared, guestEntered, guestSessionCleared } = authSlice.actions

export const selectToken = (state) => state.auth.token
export const selectAuthLoading = (state) => state.auth.loading
export const selectGuestSession = (state) => state.auth.guestSession
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin'
export const selectCurrentUser = (state) => (state.auth.user?.role === 'customer' ? state.auth.user : null)

export default authSlice.reducer
