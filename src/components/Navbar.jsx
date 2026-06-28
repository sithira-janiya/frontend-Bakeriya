import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu as MenuIcon, X, ShoppingBag, ChefHat, Wheat, LogIn, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount, isAdmin, currentUser, logout } = useStore()
  const { t } = useLanguage()

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/track', label: t('nav.trackOrder') }
  ]

  // Shrink-on-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        scrolled
          ? 'bg-crust-50/70 border-crust-200/70 shadow-sm'
          : 'bg-crust-50/40 border-transparent'
      }`}
    >
      <motion.div
        animate={{ height: scrolled ? 56 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-2"
      >
        {/* Animated logo */}
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-bold text-oven-600 shrink-0">
          <motion.span
            whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex"
          >
            <Wheat size={26} className="text-oven-500" />
          </motion.span>
          {t('brand.name')}
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = isActive(l.to)
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className="relative px-3 py-2 text-sm font-semibold whitespace-nowrap"
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={`inline-block transition-colors ${
                    active ? 'text-oven-600' : 'text-crust-800 hover:text-oven-600'
                  }`}
                >
                  {l.label}
                </motion.span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-oven-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
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
          </motion.button>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-800 text-sm font-semibold hover:bg-crust-100 transition-colors whitespace-nowrap">
                <ChefHat size={18} />
                {t('nav.chefPanel')}
              </NavLink>
              <button onClick={handleLogout} aria-label="Log out" className="p-2 rounded-full border border-crust-300 text-crust-700 hover:bg-crust-100 transition-colors">
                <LogOut size={18} />
              </button>
            </>
          ) : currentUser ? (
            <>
              <NavLink to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-800 text-sm font-semibold hover:bg-crust-100 transition-colors whitespace-nowrap">
                <User size={18} />
                My account
              </NavLink>
              <button onClick={handleLogout} aria-label="Log out" className="p-2 rounded-full border border-crust-300 text-crust-700 hover:bg-crust-100 transition-colors">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <NavLink to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-crust-300 text-crust-800 text-sm font-semibold hover:bg-crust-100 transition-colors whitespace-nowrap">
              <LogIn size={18} />
              Sign in
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button className="relative p-2 w-10 h-10" onClick={() => setOpen((o) => !o)} aria-label={t('nav.toggleMenu')}>
            <AnimatePresence initial={false} mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MenuIcon size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Mobile slide menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-0 z-30 bg-crust-900/30 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 z-40 h-full w-72 max-w-[80vw] bg-crust-50/95 backdrop-blur-xl border-l border-crust-200 px-4 pt-20 pb-6 flex flex-col gap-1 md:hidden"
            >
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                      isActive ? 'bg-oven-500 text-white' : 'text-crust-800 hover:bg-crust-100'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/order')
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-crust-800 text-white text-sm font-semibold"
              >
                <ShoppingBag size={18} />
                {t('nav.cart')} {cartCount > 0 && `(${cartCount})`}
              </button>
              {isAdmin ? (
                <>
                  <NavLink to="/admin" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-crust-300 text-crust-800 text-sm font-semibold">
                    <ChefHat size={18} />
                    {t('nav.chefPanel')}
                  </NavLink>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-crust-300 text-crust-800 text-sm font-semibold">
                    <LogOut size={18} /> Log out
                  </button>
                </>
              ) : currentUser ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-crust-300 text-crust-800 text-sm font-semibold">
                    <User size={18} />
                    My account
                  </NavLink>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-crust-300 text-crust-800 text-sm font-semibold">
                    <LogOut size={18} /> Log out
                  </button>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-crust-300 text-crust-800 text-sm font-semibold">
                  <LogIn size={18} />
                  Sign in
                </NavLink>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
