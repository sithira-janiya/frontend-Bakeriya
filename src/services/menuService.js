// Menu endpoints — public storefront menu + chef-only admin CRUD.
import { request } from './httpClient.js'

export const menuService = {
  // Public storefront menu (visible items only).
  getMenu: () => request('/menu'),

  // Chef view: full list incl. hidden items + add / update / remove.
  getMenuAdmin: () => request('/menu/admin', { auth: true }),
  createMenuItem: (item) => request('/menu', { method: 'POST', body: item, auth: true }),
  updateMenuItem: (id, patch) =>
    request(`/menu/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, auth: true }),
  deleteMenuItem: (id) => request(`/menu/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
}
