import { useLanguage } from '../context/LanguageContext.jsx'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-crust-900 text-crust-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-2">Bakeriya</h3>
          <p className="text-crust-300">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">{t('footer.hours')}</h4>
          <p className="text-crust-300">{t('footer.weekdayHours')}</p>
          <p className="text-crust-300">{t('footer.sundayHours')}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">{t('footer.visitUs')}</h4>
          <p className="text-crust-300">67, Mihindu Mawatha, Veyangoda</p>
        </div>
      </div>
      <div className="text-center text-xs text-crust-400 pb-6">
        © {new Date().getFullYear()} Bakeriya. {t('footer.rights')}.
      </div>
    </footer>
  )
}
