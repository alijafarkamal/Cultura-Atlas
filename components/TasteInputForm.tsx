'use client'

import { useState } from 'react'
import { UserPreference, TasteInput } from '@/types'
import { Plus, X, MapPin, Calendar } from 'lucide-react'

interface TasteInputFormProps {
  onAddPreference: (input: TasteInput) => void
  preferences: UserPreference[]
  onRemovePreference: (id: string) => void
  onClearAll: () => void
  onGenerateItinerary: (duration: '1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day', location?: string) => void
  loading: boolean
}

const CATEGORIES = [
  'food',
  'music',
  'movies',
  'books',
  'art',
  'travel',
  'sports',
  'fashion',
  'technology',
  'general'
]

export default function TasteInputForm({
  onAddPreference,
  preferences,
  onRemovePreference,
  onClearAll,
  onGenerateItinerary,
  loading
}: TasteInputFormProps) {
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('general')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState<'1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '6-day' | '7-day'>('1-day')
  const [sliderValue, setSliderValue] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAddPreference({ text: input.trim(), category })
      setInput('')
      setCategory('general')
    }
  }

  const handleGenerate = () => {
    onGenerateItinerary(duration, location || undefined)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Add something you love
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., jazz, sushi, hiking, indie films..."
              className="input-field flex-1"
              disabled={loading}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field w-32"
              disabled={loading}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="text-gray-900">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {preferences.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Preferences ({preferences.length})
            </h3>
            <button
              onClick={onClearAll}
              className="text-sm text-red-600 hover:text-red-800"
              disabled={loading}
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900">{pref.name}</span>
                  <span className="ml-2 text-sm text-gray-500 capitalize">
                    ({pref.category})
                  </span>
                </div>
                <button
                  onClick={() => onRemovePreference(pref.id)}
                  className="text-gray-400 hover:text-red-600"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, Tokyo, Paris..."
            className="input-field"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Trip Duration
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="7"
              value={sliderValue}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setSliderValue(value);
                setDuration(`${value}-day` as any);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-white/80 mt-1">
              <span>1 Day</span>
              <span>2 Days</span>
              <span>3 Days</span>
              <span>4 Days</span>
              <span>5 Days</span>
              <span>6 Days</span>
              <span>7 Days</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={preferences.length === 0 || loading}
          className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate My Itinerary'}
        </button>
      </div>
    </div>
  )
} 