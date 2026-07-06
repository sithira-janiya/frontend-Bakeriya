// Backward-compatible shim.
//
// The API layer now lives under src/services/ (httpClient + per-domain
// services). This file is kept so existing imports keep working while the app
// migrates over; prefer importing from '../services/*' in new code.
//
//   old: import { api, ApiError, getToken } from '../api/client.js'
//   new: import { menuService } from '../services/menuService.js'
//        import { ApiError, getToken } from '../services/httpClient.js'

export {
  ApiError,
  getToken,
  setToken,
  getGuestToken,
  setGuestToken,
  wsUrl,
  request
} from '../services/httpClient.js'

import { menuService } from '../services/menuService.js'
import { orderService } from '../services/orderService.js'
import { authService } from '../services/authService.js'

// Aggregate object preserving the original `api.*` surface. Order matches the
// previous inline definition so nothing that reads these names has to change.
export const api = {
  // Menu (public)
  getMenu: menuService.getMenu,

  // Orders
  placeOrder: orderService.placeOrder,
  getOrder: orderService.getOrder,
  findOrdersByEmail: orderService.findOrdersByEmail,
  listOrders: orderService.listOrders,
  updateOrderStatus: orderService.updateOrderStatus,
  deleteOrder: orderService.deleteOrder,

  // Auth
  register: authService.register,
  verifyEmail: authService.verifyEmail,
  resendVerification: authService.resendVerification,
  login: authService.login,
  googleLogin: authService.googleLogin,
  me: authService.me,
  requestPasswordPin: authService.requestPasswordPin,
  changePassword: authService.changePassword,

  // Menu admin (chef)
  getMenuAdmin: menuService.getMenuAdmin,
  createMenuItem: menuService.createMenuItem,
  updateMenuItem: menuService.updateMenuItem,
  deleteMenuItem: menuService.deleteMenuItem
}
