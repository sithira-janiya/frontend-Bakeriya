# Bakerya — Frontend

Responsive React frontend for the bakery ordering app: browse the menu, place an order, track it live, and a Chef Admin Panel to manage the kitchen queue.

This is a **frontend-only** build right now (per project decision). Cart/orders are stored in `localStorage` and synced across browser tabs with `BroadcastChannel`, so the customer "Track Order" page and the Chef Panel update live without a backend. Swap `src/context/StoreContext.jsx` for real API + WebSocket calls once the Node.js + Pocketbase backend is ready — the rest of the app won't need to change.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL. Open it in a second tab to see live sync between the customer and chef views.

## Pages

- `/` — Home
- `/menu` — Available Items, with category/tag filters, search, sort
- `/order` — Cart review + customer details form (name, address, email, phone)
- `/track` and `/track/:orderId` — live order status (Pending → Preparing → Ready → Collected)
- `/admin/login` — Chef Panel PIN gate (demo PIN: `1234`, see `ADMIN_PIN` in `StoreContext.jsx`)
- `/admin` — Chef Panel: kanban queue with "Start Cooking" / "Mark Ready" / "Mark Collected" actions

## Next steps (when ready for backend)

1. Node.js API: collections for `items`, `orders`; endpoints to create/list/update orders.
2. Pocketbase: store `items` and `orders`, real-time subscriptions.
3. Replace `localStorage`/`BroadcastChannel` in `StoreContext.jsx` with API calls + a WebSocket (or Pocketbase realtime) subscription so status updates push from the actual chef action to the actual customer device.
4. Move the admin PIN to real auth (Pocketbase auth or a proper login).
