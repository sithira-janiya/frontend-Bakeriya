import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Lock, Mail, ChefHat } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../context/StoreContext.jsx'

// Unified sign-in: customers use their email + password (or "Sign in with
// Google"); the admin signs in with username `admin` + password.
const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Login() {
  const { login, googleLogin, isAdmin, currentUser } = useStore()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already signed in? send them where they belong.
  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
    else if (currentUser) navigate('/dashboard', { replace: true })
  }, [isAdmin, currentUser, navigate])

  function go(role) {
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password) {
      setError('Enter your email (or "admin") and password.')
      return
    }
    setBusy(true)
    try {
      go(await login(identifier.trim(), password))
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle(credential) {
    setError('')
    setBusy(true)
    try {
      go(await googleLogin(credential))
    } catch (err) {
      setError(err?.message || 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="w-14 h-14 rounded-full bg-oven-500 text-white flex items-center justify-center mx-auto mb-4">
        <LogIn size={26} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
      <p className="text-crust-600 text-center mb-6 text-sm">Sign in to track orders and manage your account.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border border-crust-200 rounded-full px-4 py-2.5">
          <Mail size={16} className="text-crust-400 shrink-0" />
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email address"
            autoComplete="username"
            className="flex-1 outline-none bg-transparent min-w-0"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2 border border-crust-200 rounded-full px-4 py-2.5">
          <Lock size={16} className="text-crust-400 shrink-0" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="flex-1 outline-none bg-transparent min-w-0"
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-crust-400">
        <span className="flex-1 h-px bg-crust-200" /> OR <span className="flex-1 h-px bg-crust-200" />
      </div>

      <div className="flex justify-center">
        {googleEnabled ? (
          <GoogleLogin
            onSuccess={(resp) => handleGoogle(resp.credential)}
            onError={() => setError('Google sign-in failed')}
            useOneTap={false}
          />
        ) : (
          <p className="text-xs text-crust-400 text-center">
            Google sign-in is not configured (set <code>VITE_GOOGLE_CLIENT_ID</code>).
          </p>
        )}
      </div>

      <p className="text-sm text-center text-crust-600 mt-6">
        New here?{' '}
        <Link to="/register" className="font-semibold text-oven-600 hover:underline">
          Create an account
        </Link>
      </p>

      <p className="text-xs text-center text-crust-400 mt-4 flex items-center justify-center gap-1">
        <ChefHat size={13} /> Staff sign in with username <span className="font-mono">admin</span>.
      </p>
    </div>
  )
}
