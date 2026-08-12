import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, Mic, TrendingUp } from 'lucide-react'
import Badge from '@/components/common/Badge'
import { getFoods } from '@/services/foodService'

export default function Search() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await getFoods({ page: 1, limit: 8 })
        const foodItems = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        const names = foodItems.map((item) => item?.name).filter(Boolean)
        const cuisines = foodItems.map((item) => item?.cuisine).filter(Boolean)
        setSuggestions([...new Set([...names, ...cuisines])].slice(0, 8))
      } catch (error) {
        console.error('Search suggestions failed', error)
      }
    }

    loadSuggestions()
  }, [])

  const submit = (q) => {
    if (q?.trim()) navigate(`/search-result?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="glass-card rounded-[28px] border border-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(query)}
            placeholder="Search recipes, ingredients..."
            className="w-full rounded-[28px] border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-sm text-white outline-none transition focus:border-[#FF7A00]/60"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white">
            <Mic size={18} />
          </button>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/60"><TrendingUp size={14} className="text-[#FF7A00]" /> Popular searches</h3>
          <div className="grid gap-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => submit(s)} className="flex w-full items-center gap-3 rounded-[24px] bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10">
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
