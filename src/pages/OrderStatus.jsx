import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Search, ChefHat, CheckCircle2, Clock3 } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import OrderStepper from '../components/OrderStepper.jsx'
import CookingScene from '../components/CookingScene.jsx'

export default function OrderStatus() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { getOrderById, findOrdersByEmail } = useStore()
  const { t, language } = useLanguage()
  const [lookup, setLookup] = useState('')
  const [notFound, setNotFound] = useState(false)

  function handleLookup(e) {
    e.preventDefault()
    const value = lookup.trim()
    if (!value) return
    if (value.includes('@')) {
      const matches = findOrdersByEmail(value)
      if (matches.length > 0) {
        navigate(`/track/${matches[0].id}`)
        return
      }
    } else {
      const order = getOrderById(value.toUpperCase())
      if (order) {
        navigate(`/track/${order.id}`)
        return
      }
    }
    setNotFound(true)
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
            }}
            placeholder={t('track.placeholder')}
            className="flex-1 border border-crust-200 rounded-full px-4 py-2.5 outline-none focus:border-oven-500 min-w-0"
          />
          <button type="submit" className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 shrink-0 whitespace-nowrap">
            {t('track.find')}
          </button>
        </form>
        {notFound && <p className="text-sm text-red-500 mt-3 text-center">{t('track.notFoundSearch')}</p>}
      </div>
    )
  }

  const order = getOrderById(orderId)

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

  const StatusIcon = order.status === 'ready' || order.status === 'completed' ? CheckCircle2 : order.status === 'cooking' ? ChefHat : Clock3

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wide font-bold text-crust-400">{t('track.order')}</p>
        <h1 className="text-2xl font-bold font-display">{order.id}</h1>
        <p className="text-crust-500 text-xs mt-1">{t('track.liveUpdateNote')}</p>
      </div>

      <div className="bg-white border border-crust-200 rounded-2xl p-6 mb-6">
        <OrderStepper status={order.status} />
      </div>

      <div className="bg-oven-50 border border-oven-200 rounded-2xl p-5 flex items-center gap-4 mb-6">
        {order.status === 'cooking' ? (
          <div className="w-20 shrink-0">
            <CookingScene size="sm" />
          </div>
        ) : (
          <StatusIcon className="text-oven-600 shrink-0" size={28} />
        )}
        <div className="min-w-0">
          <div className="font-semibold text-oven-700 break-words">{t(`status.${order.status}`)}</div>
          <div className="text-sm text-oven-700/80 break-words">{t(`statusMsg.${order.status}`)}</div>
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
                  <span className="text-crust-600 shrink-0">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-crust-200 font-semibold">
            <span>{t('order.total')}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-crust-200 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">{t('track.pickupDetails')}</h2>
          <div className="text-sm flex flex-col gap-1 text-crust-700">
            <div><span className="font-semibold">{t('track.name')}</span> {order.customer.name}</div>
            <div><span className="font-semibold">{t('track.address')}</span> {order.customer.address}</div>
            <div><span className="font-semibold">{t('track.email')}</span> {order.customer.email}</div>
            <div><span className="font-semibold">{t('track.phone')}</span> {order.customer.phone}</div>
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
