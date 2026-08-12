import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Upload, Search, ChefHat } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import { getItemImage } from '@/utils/format'
import { getFoods } from '@/services/foodService'

export default function Landing() {
  const [featuredReels, setFeaturedReels] = useState([])

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await getFoods({ page: 1, limit: 6 })
        const foodItems = Array.isArray(response?.data?.foodItems) ? response.data.foodItems : []
        setFeaturedReels(foodItems)
      } catch (error) {
        console.error('Landing feed failed', error)
      }
    }

    fetchReels()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,122,0,0.15),transparent_35%),linear-gradient(180deg,#050505_0%,#090909_100%)] text-white">
      <header className="mx-auto flex max-w-md items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] shadow-lg shadow-black/30">
            <ChefHat size={18} className="text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">Food Reel</p>
            <p className="text-base font-semibold">AI</p>
          </div>
        </div>
        <Link to="/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">Log In</Link>
      </header>

      <section className="mx-auto max-w-md px-5 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold leading-tight"
        >
          Discover <span className="text-gradient">Recipes</span> Through Short Food Reels
        </motion.h1>
        <p className="mt-3 text-sm text-white/60">
          Watch, cook & share amazing recipes in seconds.
        </p>

        <div className="glass-card mt-6 rounded-[28px] border border-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              placeholder="Search recipes, ingredients, or cuisines..."
              className="w-full rounded-[28px] border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition focus:border-[#FF7A00]/60"
              readOnly
            />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Link to="/home"><Button full size="lg" icon={Play}>Browse Reels</Button></Link>
            <Link to="/upload"><Button full size="lg" variant="outline" icon={Upload}>Upload Reel</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-md px-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {featuredReels.slice(0, 4).map((item) => (
            <Badge key={item._id} className="px-3 py-1.5">{item?.cuisine || 'Recipe'}</Badge>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-md px-5 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Popular Reels</h2>
          <Link to="/explore" className="text-xs text-primary">View all</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {featuredReels.slice(0, 6).map((item) => (
            <Link key={item._id} to={`/reel/${item._id}`}>
              <Card hover className="overflow-hidden !rounded-2xl">
                <img src={getItemImage(item) || 'https://via.placeholder.com/300?text=Recipe'} alt={item.name} className="h-24 w-full object-cover" />
                <div className="p-1.5 text-[10px] text-white/60">{item?.cuisine || 'Recipe'}</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
