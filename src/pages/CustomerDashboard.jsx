import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Mail, Package, KeyRound, RefreshCw } from 'lucide-react'
import { useStore, STEP_LABELS } from '../context/StoreContext.jsx'
import { formatLKR } from '../utils/currency.js'

export default function CustomerDashboard() {
  const { currentUser, logout, findOrdersByEmail, requestPasswordPin, changePassword } = useStore()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Password-change flow
  const [pinSent, setPinSent] = useState(false)
  const [pin, setPin] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  const email = currentUser?.email

  async function loadOrders() {
    if (!email) return
    setOrdersLoading(true)
    try {
      setOrders(await findOrdersByEmail(email))
    } catch {
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  async function sendPin() {
    setPwError('')
    setPwMsg('')
    setPwBusy(true)
    try {
      await requestPasswordPin()
      setPinSent(true)
      setPwMsg(`We've emailed a 6-digit PIN to ${email}.`)
    } catch (err) {
      setPwError(err?.message || 'Could not send PIN')
    } finally {
      setPwBusy(false)
    }
  }

  async function submitNewPassword(e) {
    e.preventDefault()
    setPwError('')
    setPwMsg('')
    if (!/^\d{6}$/.test(pin)) return setPwError('Enter the 6-digit PIN from your email.')
    if (newPassword.length < 6) return setPwError('Password must be at least 6 characters.')
    setPwBusy(true)
    try {
      await changePassword(pin, newPassword)
      setPwMsg('Password updated successfully.')
      setPinSent(false)
      setPin('')
      setNewPassword('')
    } catch (err) {
      setPwError(err?.message || 'Could not change password')
    } finally {
      setPwBusy(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold font-display">My account</h1>
          <p className="text-crust-500 text-sm">Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-700 text-sm font-semibold hover:bg-crust-100 shrink-0"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <section className="bg-white border border-crust-200 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">Profile</h2>
          <div className="flex flex-col gap-2 text-sm text-crust-700">
            <div className="flex items-center gap-2"><User size={15} className="text-crust-400" /> {currentUser?.name || '—'}</div>
            <div className="flex items-center gap-2"><Mail size={15} className="text-crust-400" /> {currentUser?.email}</div>
            <div className="text-xs text-crust-400 mt-1">Sign-in method: {currentUser?.provider || 'password'}</div>
          </div>
        </section>

        {/* Change password */}
        <section className="bg-white border border-crust-200 rounded-2xl p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><KeyRound size={16} /> Change password</h2>
          {!pinSent ? (
            <>
              <p className="text-sm text-crust-600 mb-3">We'll email a 6-digit PIN to confirm it's you.</p>
              <button
                onClick={sendPin}
                disabled={pwBusy}
                className="px-4 py-2.5 rounded-full bg-oven-500 text-white text-sm font-semibold hover:bg-oven-600 disabled:opacity-60"
              >
                {pwBusy ? 'Sending…' : 'Email me a PIN'}
              </button>
            </>
          ) : (
            <form onSubmit={submitNewPassword} className="flex flex-col gap-3">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="6-digit PIN"
                inputMode="numeric"
                maxLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-crust-300 text-sm focus:outline-none focus:ring-2 focus:ring-oven-400"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg border border-crust-300 text-sm focus:outline-none focus:ring-2 focus:ring-oven-400"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={pwBusy} className="px-4 py-2.5 rounded-full bg-oven-500 text-white text-sm font-semibold hover:bg-oven-600 disabled:opacity-60">
                  {pwBusy ? 'Saving…' : 'Update password'}
                </button>
                <button type="button" onClick={sendPin} disabled={pwBusy} className="px-4 py-2.5 rounded-full border border-crust-300 text-crust-700 text-sm font-semibold hover:bg-crust-100">
                  Resend PIN
                </button>
              </div>
            </form>
          )}
          {pwMsg && <p className="text-sm text-green-600 mt-3">{pwMsg}</p>}
          {pwError && <p className="text-sm text-red-500 mt-3">{pwError}</p>}
        </section>
      </div>

      {/* Orders */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2"><Package size={16} /> My orders</h2>
          <button onClick={loadOrders} className="flex items-center gap-1.5 text-sm text-crust-600 hover:text-crust-900">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {ordersLoading ? (
          <p className="text-center text-crust-500 py-10">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-crust-200 rounded-2xl p-8 text-center">
            <p className="text-crust-600 mb-4">You haven't placed any orders yet.</p>
            <Link to="/menu" className="inline-block px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600">
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/track/${o.id}`}
                className="bg-white border border-crust-200 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-oven-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-crust-700">{o.id}</div>
                  <div className="text-xs text-crust-500">
                    {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? '' : 's'} · {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-oven-50 text-oven-700">
                    {STEP_LABELS[o.status] || o.status}
                  </span>
                  <span className="font-semibold text-sm">{formatLKR(o.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
