import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'

const initialForm = { name: '', address: '', email: '', phone: '' }

export default function OrderForm() {
  const { cart, updateCartQty, removeFromCart, cartTotal, placeOrder } = useStore()
  const { t, language } = useLanguage()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = t('errors.nameRequired')
    if (!form.address.trim()) errs.address = t('errors.addressRequired')
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
      if (orderId) navigate(`/track/${orderId}`)
      else setSubmitting(false)
    } catch (err) {
      setSubmitError(err?.message || t('order.submitFailed'))
      setSubmitting(false)
    }
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
                  <div className="text-xs text-crust-500">${item.price.toFixed(2)} each</div>
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
          <span className="font-display font-bold text-xl text-oven-600">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">{t('order.yourDetails')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t('order.fullName')} error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-crust-200 rounded-lg px-3 py-2 outline-none focus:border-oven-500"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label={t('order.addressLabel')} error={errors.address}>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full border border-crust-200 rounded-lg px-3 py-2 outline-none focus:border-oven-500"
              rows={3}
              placeholder="123 Baker Street, Your City"
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
          <button type="submit" className="mt-2 px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 transition-colors">
            {t('order.placeOrder')}
          </button>
        </form>
      </div>
    </div>
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
