import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ItemCard({ item }) {
  const { addToCart } = useStore()
  const { t, language } = useLanguage()
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    addToCart(item, qty)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const name = item.name[language] ?? item.name.en
  const description = item.description[language] ?? item.description.en

  return (
    <div
      className={`rounded-2xl border border-crust-200 bg-white p-4 flex flex-col gap-3 shadow-sm transition-opacity ${
        item.available ? '' : 'opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-4xl">{item.emoji}</div>
        <div className="text-right">
          <div className="font-display font-bold text-oven-600">${item.price.toFixed(2)}</div>
          {!item.available && <div className="text-xs font-semibold text-crust-500">{t('item.soldOut')}</div>}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-crust-900 break-words">{name}</h3>
        <p className="text-sm text-crust-600 mt-0.5 break-words">{description}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {item.tags.map((tag) => (
          <span key={tag} className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-crust-100 text-crust-700">
            {t(`tags.${tag}`)}
          </span>
        ))}
      </div>

      {item.available ? (
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="flex items-center gap-2 border border-crust-200 rounded-full px-2 py-1 shrink-0">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1 text-crust-600 hover:text-oven-600" aria-label={t('item.decreaseQty')}>
              <Minus size={14} />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="p-1 text-crust-600 hover:text-oven-600" aria-label={t('item.increaseQty')}>
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              justAdded ? 'bg-green-600 text-white' : 'bg-oven-500 text-white hover:bg-oven-600'
            }`}
          >
            <ShoppingCart size={16} />
            {justAdded ? t('item.added') : t('item.add')}
          </button>
        </div>
      ) : (
        <div className="mt-auto pt-2 text-sm text-crust-500">{t('item.unavailable')}</div>
      )}
    </div>
  )
}
