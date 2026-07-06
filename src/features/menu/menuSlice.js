// Storefront menu. Fetched from the backend; falls back to the bundled sample
// menu if the backend is unreachable so the storefront still renders offline.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { menuService } from '../../services/menuService.js'
import { menuItems as fallbackMenu } from '../../data/menuData.js'

export const fetchMenu = createAsyncThunk('menu/fetch', async () => {
  const data = await menuService.getMenu()
  return data?.items || []
})

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchMenu.rejected, (state) => {
        // Offline / backend down — keep the storefront usable with sample data.
        state.items = fallbackMenu
        state.loading = false
      })
  }
})

export const selectMenu = (state) => state.menu.items
export const selectMenuLoading = (state) => state.menu.loading
export default menuSlice.reducer
