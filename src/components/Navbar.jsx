import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu as MenuIcon, X, ShoppingBag, ChefHat, Wheat } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount } = useStore()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/track', label: t('nav.trackOrder') }
  ]

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
      isActive ? 'bg-oven-500 text-white' : 'text-crust-800 hover:bg-crust-100'
    }`

  return (
    <header className="sticky top-0 z-40 bg-crust-50/95 backdrop-blur border-b border-crust-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16 gap-2">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-bold text-oven-600 shrink-0">
          <Wheat size={26} className="text-oven-500" />
          {t('brand.name')}
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => navigate('/order')}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-crust-800 text-white text-sm font-semibold hover:bg-crust-900 transition-colors whitespace-nowrap"
          >
            <ShoppingBag size={18} />
            {t('nav.cart')}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-oven-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <NavLink
            to="/admin/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-800 text-sm font-semibold hover:bg-crust-100 transition-colors whitespace-nowrap"
          >
            <ChefHat size={18} />
            {t('nav.chefPanel')}
          </NavLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <button className="p-2" onClick={() => setOpen((o) => !o)} aria-label={t('nav.toggleMenu')}>
            {open ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-crust-200 bg-crust-50 px-4 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              navigate('/order')
            }}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-crust-800 text-white text-sm font-semibold"
          >
            <ShoppingBag size={18} />
            {t('nav.cart')} {cartCount > 0 && `(${cartCount})`}
          </button>
          <NavLink
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-800 text-sm font-semibold"
          >
            <ChefHat size={18} />
            {t('nav.chefPanel')}
          </NavLink>
        </div>
      )}
    </header>
  )
}
