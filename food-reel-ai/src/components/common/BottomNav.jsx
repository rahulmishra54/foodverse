import { NavLink } from 'react-router-dom'
import { Home, Search, Plus, Bookmark, User } from 'lucide-react'

const links = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/upload', icon: Plus, label: '', primary: true },
  { to: '/bookmarks', icon: Bookmark, label: 'Saved' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-4 z-50">
      <div className="mx-auto max-w-md rounded-full border border-white/10 bg-[#0f0f0f]/95 px-4 py-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          {links.map(({ to, icon: Icon, label, primary }) =>
            primary ? (
              <NavLink key={to} to={to} className="-mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] shadow-[0_20px_50px_rgba(255,122,0,0.3)] transition-transform duration-200 hover:-translate-y-1">
                <Icon size={26} className="text-white" />
              </NavLink>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[11px] transition ${isActive ? 'text-white' : 'text-white/40'} ${isActive ? 'font-semibold' : ''}`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
