import { Link } from 'react-router-dom'
import { Search, ChefHat, Bell, PackageCheck, ArrowRight } from 'lucide-react'
import { menuItems } from '../data/menuData.js'
import ItemCard from '../components/ItemCard.jsx'
import HeroScene from '../components/HeroScene2D.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Home() {
  const { t } = useLanguage()
  const featured = menuItems.filter((i) => i.tags.includes('bestseller')).slice(0, 4)

  const steps = [
    { icon: Search, title: t('home.step1Title'), desc: t('home.step1Desc') },
    { icon: ChefHat, title: t('home.step2Title'), desc: t('home.step2Desc') },
    { icon: Bell, title: t('home.step3Title'), desc: t('home.step3Desc') },
    { icon: PackageCheck, title: t('home.step4Title'), desc: t('home.step4Desc') }
  ]

  return (
    <div>
      <section className="bg-gradient-to-b from-crust-100/70 to-crust-50/30">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-oven-100 text-oven-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              {t('home.badge')}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-crust-900 leading-tight">
              {t('home.heroTitlePrefix')} <span className="text-oven-600">{t('home.heroTitleHighlight')}</span>
            </h1>
            <p className="mt-4 text-crust-700 text-lg">{t('home.heroDesc')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/menu" className="flex items-center gap-2 px-6 py-3 rounded-full bg-oven-500 text-white font-semibold hover:bg-oven-600 transition-colors">
                {t('home.viewMenu')} <ArrowRight size={18} />
              </Link>
              <Link to="/track" className="flex items-center gap-2 px-6 py-3 rounded-full border border-crust-300 text-crust-800 font-semibold hover:bg-crust-100 transition-colors">
                {t('home.trackAnOrder')}
              </Link>
            </div>
          </div>
          <div className="h-72 sm:h-96 md:h-[440px] w-full">
            <HeroScene />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('home.bestsellers')}</h2>
          <Link to="/menu" className="text-oven-600 font-semibold text-sm flex items-center gap-1 whitespace-nowrap">
            {t('home.seeFullMenu')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-crust-100 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('home.howItWorks')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl p-5 border border-crust-200 text-center">
                <div className="w-12 h-12 rounded-full bg-oven-100 text-oven-600 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={22} />
                </div>
                <div className="text-xs font-bold text-crust-400 mb-1">
                  {t('home.step')} {i + 1}
                </div>
                <h3 className="font-display font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-crust-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('home.areYouChef')}</h2>
        <p className="text-crust-600 mb-5">{t('home.chefCta')}</p>
        <Link to="/admin/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-crust-800 text-white font-semibold hover:bg-crust-900 transition-colors">
          <ChefHat size={18} /> {t('home.openChefPanel')}
        </Link>
      </section>
    </div>
  )
}
