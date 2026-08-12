import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import { getItemImage } from '@/utils/format'
import { searchFoods } from '@/services/foodService'

export default function SearchResult() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const runSearch = async () => {
      if (!q.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // only search foods (do not search users)
        const response = await searchFoods(q)
        const foodItems = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        setResults(foodItems)
      } catch (error) {
        console.error('Search failed', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    runSearch()
  }, [q])

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Results for "{q}"</h1>
        <button className="text-white/60"><SlidersHorizontal size={18} /></button>
      </div>
      <p className="mt-1 text-xs text-white/40">{loading ? 'Searching...' : `${results.length} results found`}</p>

      {loading ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-white/50">Loading results...</div>
      ) : (!results || results.length === 0) ? (
        <EmptyState icon={SearchIcon} title="No results found" description="Try a different search term." />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {results.map((item) => (
            <Link key={item._id || item.id} to={`/reel/${item._id || item.id}`}>
              <Card hover className="overflow-hidden !rounded-2xl">
                <img src={getItemImage(item) || 'https://via.placeholder.com/300?text=Recipe'} className="h-32 w-full object-cover" alt={item.name} />
                <div className="p-2.5">
                  <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">{item.cuisine || 'Recipe'}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
