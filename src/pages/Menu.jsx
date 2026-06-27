import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { menuItems } from '../data/menuData.js'
import ItemCard from '../components/ItemCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Menu() {
  const [filters, setFilters] = useState({ category: 'All', tags: [], search: '', sort: 'default' })
  const { cartCount, cartTotal } = useStore()
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    let items = [...menuItems]
    if (filters.category !== 'All') {
      items = items.filter((i) => i.category === filters.category)
    }
    if (filters.tags.length > 0) {
      items = items.filter((i) => filters.tags.every((t) => i.tags.includes(t)))
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      items = items.filter((i) => {
        const name = (i.name[language] ?? i.name.en).toLowerCase()
        const description = (i.description[language] ?? i.description.en).toLowerCase()
        // Also match the other language so a search still works right after
        // switching languages mid-session.
        const nameAlt = i.name.en.toLowerCase()
        return name.includes(q) || description.includes(q) || nameAlt.includes(q)
      })
    }
    if (filters.sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    if (filters.sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    if (filters.sort === 'name-asc') {
      items.sort((a, b) => (a.name[language] ?? a.name.en).localeCompare(b.name[language] ?? b.name.en))
    }
    return items
  }, [filters, language])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-28">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">{t('menu.title')}</h1>
        <p className="text-crust-600 mt-1">{t('menu.subtitle')}</p>
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-crust-500">{t('menu.noItems')}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-crust-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold min-w-0">
              <ShoppingBag size={18} className="shrink-0" />
              <span className="truncate">
                {cartCount} {cartCount > 1 ? t('menu.itemPlural') : t('menu.itemSingular')} · ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => navigate('/order')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-oven-500 hover:bg-oven-600 font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
            >
              {t('menu.proceedToOrder')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
