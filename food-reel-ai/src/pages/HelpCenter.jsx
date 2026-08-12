import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, ChevronDown, Search } from 'lucide-react'
import Card from '@/components/common/Card'

const faqs = [
  { q: 'How do I upload a recipe reel?', a: 'Tap the + button in the bottom navigation, add your video and recipe details, then publish.' },
  { q: 'How do I reset my password?', a: 'Go to Login, tap Forgot Password, and follow the OTP verification steps.' },
  { q: 'Can I make my profile private?', a: 'Yes, go to Settings > Privacy to control who can view your profile and recipes.' },
]

export default function HelpCenter() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">Help Center</h1>
      </div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input placeholder="Search help articles..." className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary" />
      </div>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <Card key={i} className="overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm">
              {f.q}
              <ChevronDown size={16} className={`text-white/40 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-white/50">{f.a}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}
