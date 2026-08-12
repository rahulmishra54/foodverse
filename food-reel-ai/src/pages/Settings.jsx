import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Moon, Globe, Bell, Lock, Shield, LogOut } from 'lucide-react'
import Card from '@/components/common/Card'
import { useAuth } from '@/context/AuthContext'
import { logout as logoutApi } from '@/services/authService'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`h-6 w-11 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-white/15'}`}
    >
      <span className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [dark, setDark] = useState(true)
  const [notifs, setNotifs] = useState(true)

  const rows = [
    { icon: Moon, label: 'Dark Theme', toggle: true, value: dark, onChange: setDark },
    { icon: Globe, label: 'Language', value: 'English', link: true },
    { icon: Bell, label: 'Notifications', toggle: true, value: notifs, onChange: setNotifs },
    { icon: Shield, label: 'Account', to: '/edit-profile', link: true },
    { icon: Lock, label: 'Privacy', to: '/privacy', link: true },
    { icon: Shield, label: 'Security', link: true },
  ]

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <Card className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <r.icon size={18} className="text-white/50" />
              <span className="text-sm">{r.label}</span>
            </div>
            {r.toggle ? (
              <Toggle value={r.value} onChange={r.onChange} />
            ) : r.to ? (
              <Link to={r.to} className="flex items-center gap-1 text-xs text-white/40">{r.value} <ChevronRight size={14} /></Link>
            ) : (
              <span className="flex items-center gap-1 text-xs text-white/40">{r.value} <ChevronRight size={14} /></span>
            )}
          </div>
        ))}
      </Card>

      <Card className="mt-4 divide-y divide-border">
        <Link to="/help-center" className="flex items-center justify-between px-4 py-3.5 text-sm">Help Center <ChevronRight size={14} className="text-white/30" /></Link>
        <Link to="/about" className="flex items-center justify-between px-4 py-3.5 text-sm">About <ChevronRight size={14} className="text-white/30" /></Link>
        <Link to="/terms" className="flex items-center justify-between px-4 py-3.5 text-sm">Terms of Service <ChevronRight size={14} className="text-white/30" /></Link>
      </Card>
      <button
        onClick={async () => {
          try {
            await logoutApi()
          } catch (err) {
            console.warn('Logout API failed', err)
          }
          logout()
          toast.success('Logged out')
          navigate('/login')
        }}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-sm text-white/70"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  )
}
