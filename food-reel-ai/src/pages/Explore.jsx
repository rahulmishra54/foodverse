import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import { getItemImage } from '@/utils/format'
import { getFoods } from '@/services/foodService'

const normalizeFeedItem = (item) => ({
  id: item?._id || item?.id,
  title: item?.name,
  description: item?.description,
  thumbnail: getItemImage(item),
  videoUrl: item?.video?.url,
  cookingTime: item?.cookingTime || item?.prepTime || 'N/A',
  cuisine: item?.cuisine,
  likes: item?.likes ?? 0,
  comments: item?.comments ?? 0,
})

export default function Explore() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getFoods({ page: 1, limit: 12 })
        const foodItems = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        setItems(foodItems.map(normalizeFeedItem))
      } catch (error) {
        console.error('Explore fetch failed', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-semibold">Explore</h1>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {Array.from(new Set(items.map((item) => item.cuisine).filter(Boolean))).slice(0, 6).map((cuisine) => (
          <Link key={cuisine} to={`/categories`}>
            <Badge className="whitespace-nowrap px-3 py-1.5">{cuisine}</Badge>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-white/50">Loading reels...</div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <Link key={item.id} to={`/reel/${item.id}`}>
              <Card hover className="overflow-hidden !rounded-2xl">
                <div className="relative">
                  <img src={getItemImage(item) || 'https://via.placeholder.com/300?text=Recipe'} className="h-40 w-full object-cover" alt={item.title} />
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] backdrop-blur">{item.cookingTime}</span>
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-white/40">{item.cuisine || 'Recipe'} · {item.likes} likes</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
