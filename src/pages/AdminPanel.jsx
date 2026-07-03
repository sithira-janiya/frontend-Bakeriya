import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChefHat, Clock3, PackageCheck, Home, Phone, Mail, MapPin, Trash2 } from 'lucide-react'
import { useStore, ORDER_STEPS } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import MenuManager from '../components/MenuManager.jsx'
import KitchenDisplaySettings, { loadDisplay, saveDisplay } from '../components/KitchenDisplaySettings.jsx'
import { formatLKR } from '../utils/currency.js'

const NEXT_STATUS = { pending: 'cooking', cooking: 'ready', ready: 'completed' }
const ACTION_KEY = { pending: 'chef.startCooking', cooking: 'chef.markReady', ready: 'chef.markCollected' }
const COLUMN_ICON = { pending: Clock3, cooking: ChefHat, ready: PackageCheck, completed: Home }

export default function AdminPanel() {
  const { orders, updateOrderStatus, deleteOrder, logoutAdmin, kitchenActive, setKitchenActive } = useStore()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [display, setDisplay] = useState(loadDisplay)

  function updateDisplay(next) {
    setDisplay(next)
    saveDisplay(next)
  }

  const grouped = useMemo(() => {
    const g = { pending: [], cooking: [], ready: [], completed: [] }
    for (const o of orders) {
      ;(g[o.status] ?? g.pending).push(o)
    }
    for (const key of Object.keys(g)) {
      g[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return g
  }, [orders])

  function handleLogout() {
    logoutAdmin()
    navigate('/')
  }

  async function advance(orderId, nextStatus) {
    try {
      await updateOrderStatus(orderId, nextStatus)
    } catch {
      // WS will still reconcile on the next broadcast; ignore transient errors
    }
  }

  // End-of-day cleanup: permanently remove collected (completed) orders.
  async function removeOrder(orderId) {
    try {
      await deleteOrder(orderId)
    } catch {
      // ignore transient errors; the order:deleted broadcast reconciles state
    }
  }

  async function clearCollected() {
    const done = grouped.completed
    if (done.length === 0) return
    if (!window.confirm(`Remove all ${done.length} collected order(s)? This permanently deletes them.`)) return
    for (const o of done) {
      await removeOrder(o.id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <ChefHat className="text-oven-600 shrink-0" /> <span className="break-words">{t('chef.panelTitle')}</span>
          </h1>
          <p className="text-crust-500 text-sm">{t('chef.liveQueueDesc')}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setKitchenActive(!kitchenActive)}
            title="Toggle whether the kitchen accepts new orders"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              kitchenActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${kitchenActive ? 'bg-green-500' : 'bg-red-500'}`} />
            {kitchenActive ? 'Kitchen active' : 'Kitchen inactive'}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-700 text-sm font-semibold hover:bg-crust-100 whitespace-nowrap">
            <LogOut size={16} /> {t('chef.logout')}
          </button>
        </div>
      </div>

      {/* Orders | Menu tabs */}
      <div className="flex gap-1 mb-5 border-b border-crust-200">
        {[
          ['orders', 'Orders'],
          ['menu', 'Menu'],
          ['display', 'Display']
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-oven-500 text-oven-700'
                : 'border-transparent text-crust-500 hover:text-crust-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' && <MenuManager />}

      {tab === 'display' && <KitchenDisplaySettings value={display} onChange={updateDisplay} />}

      {tab === 'orders' && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ORDER_STEPS.map((status) => {
          const Icon = COLUMN_ICON[status]
          return (
            <div key={status} className="bg-crust-100 rounded-2xl p-3 flex flex-col gap-3 min-h-[40vh] md:min-h-[60vh]">
              <div className="flex items-center gap-2 px-1 min-w-0">
                <Icon size={18} className="text-crust-600 shrink-0" />
                <h2 className="font-semibold text-crust-800 truncate">{t(`status.${status}`)}</h2>
                <span className="ml-auto text-xs font-bold bg-white px-2 py-0.5 rounded-full text-crust-500 shrink-0">
                  {grouped[status].length}
                </span>
                {status === 'completed' && grouped.completed.length > 0 && (
                  <button
                    onClick={clearCollected}
                    title="Permanently remove all collected orders"
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 shrink-0"
                  >
                    <Trash2 size={13} /> Clear all
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto scroll-thin pr-1">
                {grouped[status].length === 0 && (
                  <p className="text-xs text-crust-400 text-center py-6">{t('chef.noOrdersHere')}</p>
                )}
                {grouped[status].map((order) => (
                  <div key={order.id} className="bg-white border border-crust-200 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-crust-700">{order.id}</span>
                      {display.time && (
                        <span className="text-xs text-crust-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                    {display.name && <div className="text-sm font-semibold">{order.customer.name}</div>}
                    {(display.phone || display.email || display.address) && (
                      <div className="text-xs text-crust-500 flex flex-col gap-0.5">
                        {display.phone && order.customer.phone && (
                          <span className="flex items-center gap-1"><Phone size={11} /> {order.customer.phone}</span>
                        )}
                        {display.email && order.customer.email && (
                          <span className="flex items-center gap-1"><Mail size={11} /> {order.customer.email}</span>
                        )}
                        {display.address && order.customer.address && (
                          <span className="flex items-start gap-1">
                            <MapPin size={11} className="mt-0.5 shrink-0" />
                            <span className="break-words">{order.customer.address}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <ul className="text-xs text-crust-700 border-t border-crust-100 pt-2">
                      {order.items.map((item) => {
                        const itemName = typeof item.name === 'object' ? item.name[language] ?? item.name.en : item.name
                        return (
                          <li key={item.id} className="break-words">{item.qty} × {itemName}</li>
                        )
                      })}
                    </ul>
                    {display.total && (
                      <div className="flex items-center justify-between text-sm font-semibold pt-1">
                        <span>{t('chef.total')}</span>
                        <span>{formatLKR(order.total)}</span>
                      </div>
                    )}
                    {NEXT_STATUS[status] && (
                      <button
                        onClick={() => advance(order.id, NEXT_STATUS[status])}
                        className="mt-1 px-3 py-2 rounded-full bg-oven-500 text-white text-xs font-semibold hover:bg-oven-600 transition-colors break-words"
                      >
                        {t(ACTION_KEY[status])}
                      </button>
                    )}
                    {status === 'completed' && (
                      <button
                        onClick={() => removeOrder(order.id)}
                        className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
