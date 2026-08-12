import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChefHat } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const profileImage = user?.profilePicture || 'https://i.pravatar.cc/150?img=12'

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 py-4">
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] shadow-lg shadow-black/30">
            <ChefHat size={20} className="text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">Food Reel</p>
            <p className="text-base font-semibold text-white">AI Studio</p>
          </div>
        </Link>

        <button onClick={() => navigate('/profile')} className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 transition hover:border-primary/40 hover:bg-white/10">
          <Avatar src={profileImage} size={36} />
        </button>
      </div>
    </header>
  )
}
