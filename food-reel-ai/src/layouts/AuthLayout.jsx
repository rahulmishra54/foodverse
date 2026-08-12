import { Outlet, Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="text-lg font-semibold">Food Reel <span className="text-primary">AI</span></span>
        </Link>
        <div className="glass rounded-3xl p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
