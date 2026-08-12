import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'
import { getFoods } from '@/services/foodService'
import { getItemImage } from '@/utils/format'

const normalizeFeedItem = (item) => ({
  id: item?._id || item?.id,
  title: item?.name,
  thumbnail: getItemImage(item),
  cuisine: item?.cuisine,
})

export default function Categories() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState('All')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getFoods({ page: 1, limit: 20 })
        const foodItems = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        setItems(foodItems.map(normalizeFeedItem))
        if (foodItems[0]?.cuisine) setActive(foodItems[0].cuisine)
      } catch (error) {
        console.error('Categories fetch failed', error)
        setItems([])
      }
    }

    fetchItems()
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.cuisine).filter(Boolean)))], [items])
  const visibleItems = active === 'All' ? items : items.filter((item) => item.cuisine === active)

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-2xl border p-3 text-center text-[11px] transition-colors ${
              active === c ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-white/70'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {visibleItems.map((item) => (
          <Link key={item.id} to={`/reel/${item.id}`}>
            <Card hover className="overflow-hidden !rounded-2xl">
              <img src={getItemImage(item) || 'https://via.placeholder.com/300?text=Recipe'} className="h-32 w-full object-cover" alt={item.title} />
              <div className="p-2">
                <p className="line-clamp-1 text-xs font-medium">{item.title}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
