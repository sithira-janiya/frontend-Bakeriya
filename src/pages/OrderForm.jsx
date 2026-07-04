import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, MapPin } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import { formatLKR } from '../utils/currency.js'
import OrderSuccess from '../components/OrderSuccess.jsx'

export default function OrderForm() {
  const { cart, updateCartQty, removeFromCart, cartTotal, placeOrder, kitchenActive, currentUser } = useStore()
  const { t, language } = useLanguage()
  // Logged-in customers get name & email pre-filled from their account (still
  // editable); guests fill everything themselves. Phone is always manual since
  // accounts don't store it. Pickup only — no delivery address collected.
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [placedId, setPlacedId] = useState(null)
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = t('errors.nameRequired')
    if (!form.email.trim()) errs.email = t('errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('errors.emailInvalid')
    if (!form.phone.trim()) errs.phone = t('errors.phoneRequired')
    else if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) errs.phone = t('errors.phoneInvalid')
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)
    try {
      const orderId = await placeOrder(form)
      if (orderId) setPlacedId(orderId)
      else setSubmitting(false)
    } catch (err) {
      setSubmitError(err?.message || t('order.submitFailed'))
      setSubmitting(false)
    }
  }

  if (placedId) {
    return (
      <OrderSuccess
        orderId={placedId}
        onTrack={() => navigate(`/track/${placedId}`)}
        onContinue={() => navigate('/menu')}
      />
    )
  }

  if (submitting) {
    return <LoadingScreen message={t('order.sendingToKitchen')} />
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-crust-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('order.cartEmptyTitle')}</h1>
        <p className="text-crust-600 mb-6">{t('order.cartEmptyDesc')}</p>
        <Link to="/menu" className="inline-block px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600">
          {t('order.browseMenu')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">{t('order.yourOrder')}</h1>
        <div className="flex flex-col gap-3">
          {cart.map((item) => {
            const itemName = typeof item.name === 'object' ? item.name[language] ?? item.name.en : item.name
            return (
              <div key={item.id} className="flex items-center gap-3 bg-white border border-crust-200 rounded-xl p-3">
                <div className="text-2xl shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm break-words">{itemName}</div>
                  <div className="text-xs text-crust-500">{formatLKR(item.price)} each</div>
                </div>
                <div className="flex items-center gap-1 border border-crust-200 rounded-full px-1.5 py-1 shrink-0">
                  <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="p-1 text-crust-600 hover:text-oven-600" aria-label={t('item.decreaseQty')}>
                    <Minus size={13} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                  <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="p-1 text-crust-600 hover:text-oven-600" aria-label={t('item.increaseQty')}>
                    <Plus size={13} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-crust-400 hover:text-red-500 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="font-semibold text-crust-700">{t('order.total')}</span>
          <span className="font-display font-bold text-xl text-oven-600">{formatLKR(cartTotal)}</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">{t('order.yourDetails')}</h1>
        <PickupCard />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t('order.fullName')} error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-crust-200 rounded-lg px-3 py-2 outline-none focus:border-oven-500"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label={t('order.email')} error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-crust-200 rounded-lg px-3 py-2 outline-none focus:border-oven-500"
              placeholder="jane@example.com"
            />
          </Field>
          <Field label={t('order.phone')} error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full border border-crust-200 rounded-lg px-3 py-2 outline-none focus:border-oven-500"
              placeholder="+1 555 123 4567"
            />
          </Field>

          {submitError && (
            <p className="text-sm text-red-500 -mt-1" role="alert">{submitError}</p>
          )}
          {!kitchenActive && (
            <p className="text-sm text-red-600 -mt-1">The kitchen is temporarily closed for new orders. Please check back soon.</p>
          )}
          <button
            type="submit"
            disabled={!kitchenActive}
            className={`press mt-2 px-6 py-3 rounded-full text-white font-semibold transition-colors ${
              kitchenActive ? 'bg-oven-500 hover:bg-oven-600' : 'bg-crust-300 cursor-not-allowed'
            }`}
          >
            {kitchenActive ? t('order.placeOrder') : 'Kitchen closed'}
          </button>
        </form>
      </div>
    </div>
  )
}

function PickupCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-oven-500/25 bg-gradient-to-br from-oven-500/5 to-transparent p-4 mb-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* soft aura glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-oven-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
      <div className="relative flex items-center gap-4">
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-oven-500/40 animate-ping" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-oven-500 text-white shadow-md">
            <MapPin size={22} />
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-crust-800">Pickup Location</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-oven-600 bg-oven-500/10 rounded-full px-2 py-0.5">
              Pickup only
            </span>
          </div>
          <p className="text-sm text-crust-600">Collect your order from our kitchen</p>
          <p className="text-sm font-medium text-crust-800 mt-0.5">67, Mihindu Mawatha, Veyangoda</p>
        </div>
      </div>
    </motion.div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-crust-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  )
}
