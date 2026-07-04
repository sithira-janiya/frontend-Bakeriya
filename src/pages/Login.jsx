import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Lock, Mail, ChefHat, UserRound, ArrowRight } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../context/StoreContext.jsx'
import LoginScene2D from '../components/LoginScene2D.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

// Login-first entry gate. Three ways in:
//   • Guest      — one tap, browse/order/track by token, no account.
//   • Email      — customer email + password (or "Sign in with Google").
//   • Admin/staff — username `admin` + password (same form).
const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Login() {
  const { login, googleLogin, enterAsGuest, isAdmin, currentUser } = useStore()
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

  function handleGuest() {
    enterAsGuest()
    navigate('/menu', { replace: true })
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
      // Unverified account: send them to the code step instead of a dead error.
      if (err?.data?.needsVerification) {
        navigate('/register', { state: { verifyEmail: err.data.email || identifier.trim() } })
        return
      }
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <LoginScene2D />

      {/* Theme switch — the login gate has no navbar, so surface it here. */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/80 dark:bg-crust-900/70 backdrop-blur-xl border border-white/60 dark:border-crust-700/60 shadow-2xl p-6 sm:p-7">
        <div className="w-14 h-14 rounded-2xl bg-oven-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-oven-500/30">
          <ChefHat size={28} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Welcome to Bakerya</h1>
        <p className="text-crust-600 dark:text-crust-300 text-center mb-6 text-sm">
          Choose how you'd like to continue.
        </p>

        {/* Fast path — guest */}
        <button
          onClick={handleGuest}
          className="group w-full flex items-center justify-between gap-2 px-5 py-3 rounded-2xl bg-crust-800 text-white font-semibold hover:bg-crust-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <UserRound size={18} />
            Continue as guest
          </span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        <p className="text-[11px] text-center text-crust-500 dark:text-crust-400 mt-2">
          No account needed — order and track by your order token.
        </p>

        <div className="my-5 flex items-center gap-3 text-xs text-crust-400">
          <span className="flex-1 h-px bg-crust-200 dark:bg-crust-700" /> OR SIGN IN{' '}
          <span className="flex-1 h-px bg-crust-200 dark:bg-crust-700" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border border-crust-200 dark:border-crust-700 rounded-full px-4 py-2.5 bg-white/70 dark:bg-crust-800/70">
            <Mail size={16} className="text-crust-400 shrink-0" />
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email address"
              autoComplete="username"
              className="flex-1 outline-none bg-transparent min-w-0"
            />
          </div>
          <div className="flex items-center gap-2 border border-crust-200 dark:border-crust-700 rounded-full px-4 py-2.5 bg-white/70 dark:bg-crust-800/70">
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
            className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {googleEnabled && (
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={(resp) => handleGoogle(resp.credential)}
              onError={() => setError('Google sign-in failed')}
              useOneTap={false}
            />
          </div>
        )}

        <p className="text-sm text-center text-crust-600 dark:text-crust-300 mt-6">
          New here?{' '}
          <Link to="/register" className="font-semibold text-oven-600 hover:underline">
            Create an account
          </Link>
        </p>

        <p className="text-xs text-center text-crust-400 mt-3 flex items-center justify-center gap-1">
          <ChefHat size={13} /> Staff sign in with username <span className="font-mono">admin</span>.
        </p>
      </div>
    </div>
  )
}
