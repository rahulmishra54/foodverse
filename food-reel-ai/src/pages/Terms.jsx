import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function Terms() {
  const navigate = useNavigate()
  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">Terms of Service</h1>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>By using Food Reel AI, you agree to these terms and conditions governing your access to the platform.</p>
        <p><strong className="text-white">Content:</strong> You retain ownership of content you upload, but grant us a license to display it on the platform.</p>
        <p><strong className="text-white">Conduct:</strong> Users must not post harmful, misleading, or copyrighted content without permission.</p>
        <p><strong className="text-white">Termination:</strong> We reserve the right to suspend accounts violating these terms.</p>
      </div>
    </div>
  )
}
