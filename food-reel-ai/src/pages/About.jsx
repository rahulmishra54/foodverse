import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChefHat } from 'lucide-react'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">About</h1>
      </div>
      <div className="flex flex-col items-center py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
          <ChefHat size={30} className="text-white" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Food Reel AI</h2>
        <p className="text-xs text-white/40">Version 1.0.0</p>
        <p className="mt-4 max-w-xs text-sm text-white/60">
          Food Reel is a short-video platform where creators share recipes and discover new meal ideas through short-form food reels.
        </p>
      </div>
    </div>
  )
}
