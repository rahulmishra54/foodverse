import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'
import { getItemImage } from '@/utils/format'
import { useAuth } from '@/context/AuthContext'
import { getSavedReels } from '@/services/foodService'

export default function SavedRecipes() {
  const { dashboardData } = useAuth()
  const [savedReels, setSavedReels] = useState((dashboardData?.savedVideos || []).map((item) => item?.food || item).filter(Boolean))

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const resp = await getSavedReels()
        const reels = Array.isArray(resp?.data?.reels) ? resp.data.reels : []
        setSavedReels(reels)
      } catch (error) {
        console.error('Failed to load saved recipes', error)
      }
    }

    loadSaved()
  }, [])

  return (
    <div className="space-y-6 pb-28">
      <div className="glass-card rounded-[28px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
        <h1 className="text-2xl font-semibold">Saved Recipes</h1>
        <p className="mt-2 text-sm text-white/60">Your favorite recipe reels, curated in one place.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {savedReels.length > 0 ? savedReels.map((reel) => (
          <Link key={reel._id} to={`/reel/${reel._id}`} className="group relative overflow-hidden rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <img src={getItemImage(reel) || 'https://via.placeholder.com/300?text=Recipe'} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" alt={reel.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white line-clamp-2">{reel.name}</div>
          </Link>
        )) : (
          <div className="col-span-full rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            No saved recipes yet.
          </div>
        )}
      </div>
    </div>
  )
}
