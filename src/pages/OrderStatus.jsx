import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Search, ChefHat, CheckCircle2, Clock3 } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import OrderStepper from '../components/OrderStepper.jsx'
import CookingScene from '../components/CookingScene.jsx'
import { formatLKR } from '../utils/currency.js'

export default function OrderStatus() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { fetchOrder, findOrdersByEmail, orderUpdates, currentUser, trackOrder } = useStore()
  const { t, language } = useLanguage()

  const [lookup, setLookup] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [needsSignIn, setNeedsSignIn] = useState(false)
  const [searching, setSearching] = useState(false)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Fetch the tracked order whenever the id changes.
  useEffect(() => {
    if (!orderId) {
      setOrder(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setLoadError(false)
    trackOrder(orderId) // subscribe for live status pushes on this order
    fetchOrder(orderId)
      .then((found) => {
        if (!cancelled) setOrder(found)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orderId, fetchOrder, trackOrder])

  // Live status: a WebSocket push for this order overrides the fetched status.
  const liveStatus = orderId ? orderUpdates[orderId]?.status : undefined
  const effectiveStatus = liveStatus || order?.status

  async function handleLookup(e) {
    e.preventDefault()
    const value = lookup.trim()
    if (!value) return
    setSearching(true)
    setNotFound(false)
    setNeedsSignIn(false)
    try {
      if (value.includes('@')) {
        // Email lookup is authenticated (own orders only). Guests must use the
        // order code they were given.
        if (!currentUser) {
          setNeedsSignIn(true)
          return
        }
        const matches = await findOrdersByEmail(value)
        if (matches.length > 0) {
          navigate(`/track/${matches[0].id}`)
          return
        }
      } else {
        const found = await fetchOrder(value.toUpperCase())
        if (found) {
          navigate(`/track/${found.id}`)
          return
        }
      }
      setNotFound(true)
    } catch {
      setNotFound(true)
    } finally {
      setSearching(false)
    }
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <Search size={36} className="mx-auto text-crust-400 mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">{t('track.title')}</h1>
        <p className="text-crust-600 text-center mb-6">{t('track.subtitle')}</p>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            value={lookup}
            onChange={(e) => {
              setLookup(e.target.value)
              setNotFound(false)
              setNeedsSignIn(false)
            }}
            placeholder={t('track.placeholder')}
            className="flex-1 border border-crust-200 rounded-full px-4 py-2.5 outline-none focus:border-oven-500 min-w-0"
          />
          <button type="submit" disabled={searching} className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 shrink-0 whitespace-nowrap disabled:opacity-60">
            {searching ? t('track.searching') : t('track.find')}
          </button>
        </form>
        {notFound && <p className="text-sm text-red-500 mt-3 text-center">{t('track.notFoundSearch')}</p>}
        {needsSignIn && (
          <p className="text-sm text-crust-600 mt-3 text-center">
            <Link to="/login" className="font-semibold text-oven-600 hover:underline">
              {t('track.signInForEmail')}
            </Link>
          </p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-crust-500">
        {t('track.loading')}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">{t('track.errorTitle')}</h1>
        <p className="text-crust-600 mb-6">{t('track.errorDesc')}</p>
        <Link to="/track" className="px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 inline-block">
          {t('track.tryAnotherLookup')}
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">{t('track.orderNotFoundTitle')}</h1>
        <p className="text-crust-600 mb-6">{t('track.orderNotFoundDesc', { id: orderId })}</p>
        <Link to="/track" className="px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 inline-block">
          {t('track.tryAnotherLookup')}
        </Link>
      </div>
    )
  }

  const StatusIcon =
    effectiveStatus === 'ready' || effectiveStatus === 'completed'
      ? CheckCircle2
      : effectiveStatus === 'cooking'
        ? ChefHat
        : Clock3

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wide font-bold text-crust-400">{t('track.order')}</p>
        <h1 className="text-2xl font-bold font-display">{order.id}</h1>
        <p className="text-crust-500 text-xs mt-1">{t('track.liveUpdateNote')}</p>
      </div>

      <div className="bg-white border border-crust-200 rounded-2xl p-6 mb-6">
        <OrderStepper status={effectiveStatus} />
      </div>

      <div className="bg-oven-50 border border-oven-200 rounded-2xl p-5 flex items-center gap-4 mb-6">
        {effectiveStatus === 'cooking' ? (
          <div className="w-20 shrink-0">
            <CookingScene size="sm" />
          </div>
        ) : (
          <StatusIcon className="text-oven-600 shrink-0" size={28} />
        )}
        <div className="min-w-0">
          <div className="font-semibold text-oven-700 break-words">{t(`status.${effectiveStatus}`)}</div>
          <div className="text-sm text-oven-700/80 break-words">{t(`statusMsg.${effectiveStatus}`)}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-crust-200 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">{t('track.items')}</h2>
          <div className="flex flex-col gap-2 text-sm">
            {order.items.map((item) => {
              const itemName = typeof item.name === 'object' ? item.name[language] ?? item.name.en : item.name
              return (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className="break-words">{item.qty} × {itemName}</span>
                  <span className="text-crust-600 shrink-0">{formatLKR(item.qty * item.price)}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-crust-200 font-semibold">
            <span>{t('order.total')}</span>
            <span>{formatLKR(order.total)}</span>
          </div>
        </div>

        <div className="bg-white border border-crust-200 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">{t('track.pickupDetails')}</h2>
          <div className="text-sm flex flex-col gap-1 text-crust-700">
            {order.customer?.name && (
              <div><span className="font-semibold">{t('track.name')}</span> {order.customer.name}</div>
            )}
            {order.customer?.address && (
              <div><span className="font-semibold">{t('track.address')}</span> {order.customer.address}</div>
            )}
            {order.customer?.email && (
              <div><span className="font-semibold">{t('track.email')}</span> {order.customer.email}</div>
            )}
            {order.customer?.phone && (
              <div><span className="font-semibold">{t('track.phone')}</span> {order.customer.phone}</div>
            )}
            {!order.customer?.email && (
              <div className="text-xs text-crust-500">{t('track.signInForEmail')}</div>
            )}
            <div className="text-xs text-crust-400 mt-2">{t('track.placed')} {new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/track" className="text-sm font-semibold text-oven-600">{t('track.trackAnother')}</Link>
      </div>
    </div>
  )
}
