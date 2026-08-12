import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ReelCard from '@/components/common/ReelCard'
import { getFoods } from '@/services/foodService'
import { getItemImage } from '@/utils/format'

const normalizeFeedItem = (item) => ({
  id: item?._id || item?.id,
  title: item?.name,
  description: item?.description,
  thumbnail: getItemImage(item),
  videoUrl: item?.video?.url,
  likes: item?.likes ?? 0,
  comments: item?.comments ?? 0,
  bookmarks: 0,
  hashtags: item?.tags ?? [],
  cookingTime: item?.cookingTime || item?.prepTime || 'N/A',
  rating: 4.8,
  calories: item?.calories ?? 0,
  cuisine: item?.cuisine,
  difficulty: item?.difficulty,
  ingredients: item?.ingredients ?? [],
  steps: item?.recipeSteps ?? [],
  foodPartnerId: item?.foodPartner?._id || item?.foodPartnerId || item?.chef?.id || null,
  isFollowing: Boolean(item?.isFollowing),
  isLiked: Boolean(item?.isLiked),
  isSaved: Boolean(item?.isSaved),
  chef: {
    avatar: item?.foodPartner?.profilePicture || item?.chef?.avatar || 'https://i.pravatar.cc/150?img=12',
    name: item?.foodPartner?.restaurantName || item?.foodPartner?.ownerName || item?.foodPartner?.name || item?.chef?.name || 'Food Partner',
    verified: true,
    id: item?.foodPartner?._id || item?.foodPartnerId || item?.chef?.id || item?.chef?._id || null,
  },
})

export default function Home() {
  const [tab, setTab] = useState('forYou')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getFoods({ page: 1, limit: 10 })
        const items = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        setRecipes(items.map(normalizeFeedItem))
      } catch (error) {
        console.error('Feed fetch failed', error)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [])

  const displayRecipes = tab === 'following' ? recipes.filter((item) => item.isFollowing) : recipes

  return (
    <div className="space-y-6 pb-6">
      <div className="sticky top-24 z-30 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-4 text-sm text-white/60">
          <p className="font-semibold uppercase tracking-[0.22em] text-white/80">Explore</p>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">{tab === 'forYou' ? 'For You' : 'Following'}</span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 rounded-full bg-black/40 p-1 text-sm">
          {['forYou', 'following'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 transition ${tab === t ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] text-black shadow-[0_10px_30px_rgba(255,122,0,0.24)]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              {t === 'forYou' ? 'For You' : 'Following'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">Loading feed...</div>
        ) : displayRecipes.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            {tab === 'following' ? 'Follow creators to see their latest reels.' : 'No reels available yet.'}
          </div>
        ) : (
          <div className="space-y-4">
            {displayRecipes.map((r) => <ReelCard key={r.id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
