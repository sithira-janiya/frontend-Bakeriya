import { useEffect, useState } from 'react'
import CookingScene from './CookingScene.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Full-screen loading overlay with the animated cooking scene.
 * Pass `leaving` to fade it out before the parent unmounts it.
 */
export default function LoadingScreen({ message = 'Preheating the ovens', leaving = false }) {
  const { t } = useLanguage()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-crust-50 transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <CookingScene size="lg" />
      <div className="text-center">
        <p className="font-display text-2xl font-bold text-oven-600">{t('brand.name')}</p>
        <p className="text-crust-500 text-sm mt-1 min-h-[1.25rem]">
          {message}
          <span className="inline-block w-4 text-left">{dots}</span>
        </p>
      </div>
    </div>
  )
}
