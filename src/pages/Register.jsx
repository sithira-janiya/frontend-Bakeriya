import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { UserPlus, Lock, Mail, User, MailCheck } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../context/StoreContext.jsx'

const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Register() {
  const { register, verifyEmail, resendVerification, googleLogin, currentUser, isAdmin } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Two-step: 'form' collects details, 'verify' confirms the emailed code.
  const [step, setStep] = useState('form')
  const [pendingEmail, setPendingEmail] = useState('')
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
    else if (currentUser) navigate('/dashboard', { replace: true })
  }, [isAdmin, currentUser, navigate])

  // Arriving from the Login page with an unverified account: jump straight to
  // the code step and send a fresh code.
  useEffect(() => {
    const email = location.state?.verifyEmail
    if (!email) return
    setPendingEmail(email)
    setStep('verify')
    setNotice(`We've emailed a verification code to ${email}.`)
    resendVerification(email).catch(() => {})
    navigate(location.pathname, { replace: true, state: {} }) // clear state
  }, [location.state, location.pathname, navigate, resendVerification])

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
      const email = form.email.trim()
      await register({ name: form.name.trim(), email, password: form.password })
      setPendingEmail(email)
      setStep('verify')
      setNotice(`We've emailed a 6-digit code to ${email}. Enter it to activate your account.`)
    } catch (err) {
      setError(err?.message || 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(code.trim())) return setError('Enter the 6-digit code from your email.')
    setBusy(true)
    try {
      await verifyEmail(pendingEmail, code.trim())
      navigate('/dashboard', { replace: true }) // now signed in
    } catch (err) {
      setError(err?.message || 'Could not verify your email')
    } finally {
      setBusy(false)
    }
  }

  async function handleResend() {
    setError('')
    setNotice('')
    setBusy(true)
    try {
      await resendVerification(pendingEmail)
      setNotice(`A new code is on its way to ${pendingEmail}.`)
    } catch {
      setError('Could not resend the code. Please try again.')
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

  if (step === 'verify') {
    return (
      <div className="max-w-sm mx-auto px-4 py-16">
        <div className="w-14 h-14 rounded-full bg-oven-500 text-white flex items-center justify-center mx-auto mb-4">
          <MailCheck size={26} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Verify your email</h1>
        <p className="text-crust-600 text-center mb-6 text-sm">
          Enter the 6-digit code we sent to <span className="font-semibold break-words">{pendingEmail}</span>.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <div className={field}>
            <Mail size={16} className="text-crust-400 shrink-0" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              className={`${inputCls} tracking-[0.4em] font-mono`}
              autoFocus
            />
          </div>

          {notice && <p className="text-sm text-green-600 text-center">{notice}</p>}
          {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}

          <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 disabled:opacity-60">
            {busy ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <button type="button" onClick={handleResend} disabled={busy} className="font-semibold text-oven-600 hover:underline disabled:opacity-60">
            Resend code
          </button>
          <button
            type="button"
            onClick={() => { setStep('form'); setCode(''); setError(''); setNotice('') }}
            className="text-crust-500 hover:text-crust-800"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

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
