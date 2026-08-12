import { Outlet } from 'react-router-dom'
import Navbar from '@/components/common/Navbar'
import BottomNav from '@/components/common/BottomNav'

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,122,0,0.18),transparent_25%),linear-gradient(180deg,#050505_0%,#090909_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-md px-4 pb-28 pt-3 sm:px-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
