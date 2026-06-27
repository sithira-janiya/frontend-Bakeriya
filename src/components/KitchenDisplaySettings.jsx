import { SlidersHorizontal } from 'lucide-react'

// Phase 2: the chef chooses which fields the kitchen order cards display.
// Order code + the items list are always shown (the kitchen needs them), so
// they are not toggleable. Prefs persist in localStorage (per device).

const STORAGE_KEY = 'bakerya_kitchen_display'

export const DISPLAY_FIELDS = [
  { key: 'name', label: 'Customer name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'time', label: 'Order time' },
  { key: 'total', label: 'Total' }
]

export const DEFAULT_DISPLAY = {
  name: true,
  phone: true,
  email: true,
  address: false,
  time: true,
  total: true
}

export function loadDisplay() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_DISPLAY, ...JSON.parse(raw) } : { ...DEFAULT_DISPLAY }
  } catch {
    return { ...DEFAULT_DISPLAY }
  }
}

export function saveDisplay(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* storage unavailable — ignore */
  }
}

export default function KitchenDisplaySettings({ value, onChange }) {
  function toggle(key) {
    onChange({ ...value, [key]: !value[key] })
  }

  return (
    <div className="bg-white border border-crust-200 rounded-2xl p-4 flex flex-col gap-3 max-w-md">
      <h3 className="font-semibold text-crust-800 flex items-center gap-2">
        <SlidersHorizontal size={16} /> Kitchen card fields
      </h3>
      <p className="text-sm text-crust-500">
        Choose what each order card shows in the queue. Order code and items are always visible.
      </p>
      <div className="flex flex-col divide-y divide-crust-100">
        {DISPLAY_FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-center justify-between gap-3 py-3 cursor-pointer select-none"
          >
            <span className="text-sm font-medium text-crust-800">{field.label}</span>
            <input
              type="checkbox"
              className="w-5 h-5 accent-oven-500"
              checked={!!value[field.key]}
              onChange={() => toggle(field.key)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
