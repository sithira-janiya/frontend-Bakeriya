import { Search } from 'lucide-react'
import { CATEGORIES, TAGS } from '../data/menuData.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function FilterBar({ filters, setFilters }) {
  const { t } = useLanguage()

  function toggleTag(tag) {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    }))
  }

  return (
    <div className="bg-white border border-crust-200 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-crust-50 border border-crust-200 rounded-full px-3 py-2">
        <Search size={18} className="text-crust-500" />
        <input
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder={t('filter.searchPlaceholder')}
          className="bg-transparent outline-none text-sm flex-1 min-w-0"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters((f) => ({ ...f, category: cat }))}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap ${
              filters.category === cat
                ? 'bg-oven-500 text-white border-oven-500'
                : 'border-crust-200 text-crust-700 hover:bg-crust-100'
            }`}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-crust-500 uppercase tracking-wide whitespace-nowrap">
          {t('filter.filtersLabel')}
        </span>
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
              filters.tags.includes(tag)
                ? 'bg-crust-800 text-white border-crust-800'
                : 'border-crust-200 text-crust-600 hover:bg-crust-100'
            }`}
          >
            {t(`tags.${tag}`)}
          </button>
        ))}

        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="ml-auto text-sm border border-crust-200 rounded-full px-3 py-1.5 bg-white max-w-[55%] sm:max-w-none"
        >
          <option value="default">{t('filter.sortFeatured')}</option>
          <option value="price-asc">{t('filter.sortPriceAsc')}</option>
          <option value="price-desc">{t('filter.sortPriceDesc')}</option>
          <option value="name-asc">{t('filter.sortNameAsc')}</option>
        </select>
      </div>
    </div>
  )
}
