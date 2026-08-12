import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'
import { Folder } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getSavedReels } from '@/services/foodService'
import { getItemImage } from '@/utils/format'

export default function Bookmarks() {
  const { dashboardData } = useAuth()
  const [savedReels, setSavedReels] = useState((dashboardData?.savedVideos || []).map((item) => item.food || item).filter(Boolean))

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const resp = await getSavedReels()
        const reels = Array.isArray(resp?.data?.reels) ? resp.data.reels : []
        setSavedReels(reels)
      } catch (error) {
        console.error('Failed to load saved reels', error)
      }
    }

    loadSaved()
  }, [])

  return (
    <div className="space-y-6 pb-28">
      <div className="glass-card rounded-[28px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
        <h1 className="text-2xl font-semibold">Bookmarks</h1>
        <p className="mt-2 text-sm text-white/60">Save your favorite reels and return to them later.</p>
        <div className="mt-5 rounded-[28px] bg-white/5 px-4 py-5 text-sm text-white/60">
          {savedReels.length > 0 ? `${savedReels.length} saved reels` : 'Save reels to see them here.'}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Saved Reels</h2>
        {savedReels.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {savedReels.map((reel) => (
              <Link key={reel._id || reel.id} to={`/reel/${reel._id || reel.id}`} className="group relative overflow-hidden rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                <img src={getItemImage(reel) || 'https://via.placeholder.com/300?text=Recipe'} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" alt={reel.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white line-clamp-2">{reel.name}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            No saved reels yet.
          </div>
        )}
      </div>
    </div>
  )
}
