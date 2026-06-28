# Frontend auth setup (Phase 2)

Add to `frontend/.env` (the `.env*` files are access-restricted, so add this key
manually). It must match the backend `GOOGLE_CLIENT_ID`.

```ini
# Google OAuth Web client ID (Google Cloud Console > Credentials).
# Authorized JavaScript origin must include http://localhost:5173
VITE_GOOGLE_CLIENT_ID=
```

## What changed in Phase 2

- `src/api/client.js` — single token slot (`bakerya_token`); added `register`,
  `login(identifier, password)`, `googleLogin`, `me`, `requestPasswordPin`,
  `changePassword`. Removed `adminLogin`.
- `src/context/StoreContext.jsx` — unified auth state: `currentUser`, `isAdmin`,
  `authLoading`, `login`, `register`, `googleLogin`, `logout`,
  `requestPasswordPin`, `changePassword`. `loginAdmin`/`logoutAdmin` kept as
  thin aliases so the existing admin pages keep working until Phase 3.
- `src/main.jsx` — wrapped in `<GoogleOAuthProvider>`.

The admin PIN page still works for now: typing the admin **password** into it
signs in as admin (it calls `login('admin', <value>)`). Phase 3 replaces it with
the unified `/login` page.
