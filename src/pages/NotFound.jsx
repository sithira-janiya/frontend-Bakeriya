import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-4">🍞</div>
      <h1 className="text-2xl font-bold mb-2">{t('notFound.title')}</h1>
      <p className="text-crust-600 mb-6">{t('notFound.desc')}</p>
      <Link to="/" className="px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 inline-block">
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}
