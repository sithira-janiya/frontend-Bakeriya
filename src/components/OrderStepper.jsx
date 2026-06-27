import { Check, Clock, ChefHat, PackageCheck, Home } from 'lucide-react'
import { ORDER_STEPS } from '../context/StoreContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const ICONS = {
  pending: Clock,
  cooking: ChefHat,
  ready: PackageCheck,
  completed: Home
}

export default function OrderStepper({ status }) {
  const { t } = useLanguage()
  const currentIndex = ORDER_STEPS.indexOf(status)

  return (
    <div className="flex items-center w-full">
      {ORDER_STEPS.map((step, idx) => {
        const Icon = ICONS[step]
        const isDone = idx < currentIndex
        const isActive = idx === currentIndex
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative min-w-0">
            {idx !== 0 && (
              <div
                className={`absolute top-5 right-1/2 w-full h-1 -z-10 ${
                  idx <= currentIndex ? 'bg-oven-500' : 'bg-crust-200'
                }`}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 shrink-0 ${
                isDone
                  ? 'bg-oven-500 border-oven-500 text-white'
                  : isActive
                  ? 'bg-white border-oven-500 text-oven-600 pulse-ring'
                  : 'bg-white border-crust-200 text-crust-400'
              }`}
            >
              {isDone ? <Check size={18} /> : <Icon size={18} />}
            </div>
            <span className={`mt-2 text-xs font-semibold text-center break-words px-0.5 ${isActive ? 'text-oven-600' : 'text-crust-500'}`}>
              {t(`status.${step}`)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
