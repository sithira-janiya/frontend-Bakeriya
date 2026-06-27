import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Lock } from 'lucide-react'
import { useStore } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function AdminLogin() {
  const { loginAdmin, isAdmin } = useStore()
  const { t } = useLanguage()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const ok = await loginAdmin(pin)
    setBusy(false)
    if (ok) {
      navigate('/admin')
    } else {
      setError(t('chef.incorrectPin'))
      setPin('')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="w-14 h-14 rounded-full bg-crust-800 text-white flex items-center justify-center mx-auto mb-4">
        <ChefHat size={26} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-1">{t('chef.panelTitle')}</h1>
      <p className="text-crust-600 text-center mb-6 text-sm">{t('chef.enterPinDesc')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border border-crust-200 rounded-full px-4 py-2.5">
          <Lock size={16} className="text-crust-400" />
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('chef.pinPlaceholder')}
            className="flex-1 outline-none bg-transparent min-w-0"
            autoComplete="current-password"
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 disabled:opacity-60">
          {busy ? t('chef.signingIn') : t('chef.enterPanel')}
        </button>
      </form>
    </div>
  )
}
