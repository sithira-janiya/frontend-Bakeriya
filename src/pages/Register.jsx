import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Lock, Mail, User } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../context/StoreContext.jsx'

const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Register() {
  const { register, googleLogin, currentUser, isAdmin } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
    else if (currentUser) navigate('/dashboard', { replace: true })
  }, [isAdmin, currentUser, navigate])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Please enter a valid email.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle(credential) {
    setError('')
    setBusy(true)
    try {
      await googleLogin(credential)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  const field = 'flex items-center gap-2 border border-crust-200 rounded-full px-4 py-2.5'
  const inputCls = 'flex-1 outline-none bg-transparent min-w-0'

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="w-14 h-14 rounded-full bg-oven-500 text-white flex items-center justify-center mx-auto mb-4">
        <UserPlus size={26} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
      <p className="text-crust-600 text-center mb-6 text-sm">Save your details and track every order.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className={field}>
          <User size={16} className="text-crust-400 shrink-0" />
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" autoComplete="name" className={inputCls} autoFocus />
        </div>
        <div className={field}>
          <Mail size={16} className="text-crust-400 shrink-0" />
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email address" autoComplete="email" className={inputCls} />
        </div>
        <div className={field}>
          <Lock size={16} className="text-crust-400 shrink-0" />
          <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Password (min 6 chars)" autoComplete="new-password" className={inputCls} />
        </div>

        {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 disabled:opacity-60">
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-crust-400">
        <span className="flex-1 h-px bg-crust-200" /> OR <span className="flex-1 h-px bg-crust-200" />
      </div>

      <div className="flex justify-center">
        {googleEnabled ? (
          <GoogleLogin onSuccess={(resp) => handleGoogle(resp.credential)} onError={() => setError('Google sign-in failed')} useOneTap={false} text="signup_with" />
        ) : (
          <p className="text-xs text-crust-400 text-center">
            Google sign-in is not configured (set <code>VITE_GOOGLE_CLIENT_ID</code>).
          </p>
        )}
      </div>

      <p className="text-sm text-center text-crust-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-oven-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
