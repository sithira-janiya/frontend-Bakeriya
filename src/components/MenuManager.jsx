import { useEffect, useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { api } from '../api/client.js'
import { formatLKR } from '../utils/currency.js'

// Chef-facing menu management (add / remove items, toggle availability).
// Labels are plain English by design — this is an admin-only surface.

const EMPTY_FORM = {
  nameEn: '',
  nameSi: '',
  category: '',
  price: '',
  emoji: '🍞',
  descEn: '',
  descSi: '',
  tags: '',
  available: true
}

const input =
  'w-full px-3 py-2.5 rounded-lg border border-crust-300 text-sm focus:outline-none focus:ring-2 focus:ring-oven-400'

export default function MenuManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { items: list } = await api.getMenuAdmin()
      setItems(list || [])
    } catch (e) {
      setError(e.message || 'Could not load menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))]

  async function toggleAvailable(item) {
    setBusyId(item.id)
    setError('')
    try {
      const { item: updated } = await api.updateMenuItem(item.id, { available: !item.available })
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)))
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(item) {
    if (!window.confirm(`Remove "${item.name?.en || item.id}" from the menu?`)) return
    setBusyId(item.id)
    setError('')
    try {
      await api.deleteMenuItem(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    } catch (e) {
      setError(e.message || 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  async function addItem(e) {
    e.preventDefault()
    if (!form.nameEn.trim()) {
      setError('Name (English) is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: { en: form.nameEn.trim(), si: form.nameSi.trim() || form.nameEn.trim() },
        category: form.category.trim() || 'Other',
        price: Number(form.price) || 0,
        emoji: form.emoji.trim() || '🍞',
        description: { en: form.descEn.trim(), si: form.descSi.trim() || form.descEn.trim() },
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        available: form.available
      }
      const { item } = await api.createMenuItem(payload)
      setItems((prev) => [item, ...prev])
      setForm(EMPTY_FORM)
    } catch (e) {
      setError(e.message || 'Could not add item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>
      )}

      {/* Add item */}
      <form onSubmit={addItem} className="bg-white border border-crust-200 rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-crust-800 flex items-center gap-2">
          <Plus size={16} /> Add menu item
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className={input}
            placeholder="Name (English) *"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          />
          <input
            className={input}
            placeholder="Name (Sinhala)"
            value={form.nameSi}
            onChange={(e) => setForm({ ...form, nameSi: e.target.value })}
          />
          <input
            className={input}
            list="menu-categories"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <datalist id="menu-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            className={input}
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className={input}
            placeholder="Emoji"
            value={form.emoji}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
          />
          <input
            className={input}
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className={input}
            placeholder="Description (English)"
            value={form.descEn}
            onChange={(e) => setForm({ ...form, descEn: e.target.value })}
          />
          <input
            className={input}
            placeholder="Description (Sinhala)"
            value={form.descSi}
            onChange={(e) => setForm({ ...form, descSi: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-crust-700">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          Available to customers
        </label>
        <button
          type="submit"
          disabled={saving}
          className="self-stretch sm:self-start px-5 py-3 rounded-full bg-oven-500 text-white text-sm font-semibold hover:bg-oven-600 disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add item'}
        </button>
      </form>

      {/* List */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-crust-800">Menu items ({items.length})</h3>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-crust-600 hover:text-crust-900">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center text-crust-500 py-10">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-center text-crust-500 py-10">No items yet. Add one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-3 flex items-center gap-3 ${
                item.available ? 'border-crust-200' : 'border-crust-200 opacity-60'
              }`}
            >
              <span className="text-2xl shrink-0">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-crust-900 truncate">{item.name?.en || item.id}</div>
                <div className="text-xs text-crust-500 truncate">
                  {item.category} · {formatLKR(item.price)}
                </div>
              </div>
              <button
                onClick={() => toggleAvailable(item)}
                disabled={busyId === item.id}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold shrink-0 disabled:opacity-50 ${
                  item.available ? 'bg-green-100 text-green-700' : 'bg-crust-200 text-crust-600'
                }`}
              >
                {item.available ? <Eye size={13} /> : <EyeOff size={13} />}
                <span className="hidden sm:inline">{item.available ? 'Visible' : 'Hidden'}</span>
              </button>
              <button
                onClick={() => remove(item)}
                disabled={busyId === item.id}
                className="p-2 rounded-full text-red-500 hover:bg-red-50 shrink-0 disabled:opacity-50"
                aria-label="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
