import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>We value your privacy. This policy explains how Food Reel AI collects, uses, and protects your information when you use our platform.</p>
        <p><strong className="text-white">Data We Collect:</strong> Profile information, uploaded content, usage analytics, and device information.</p>
        <p><strong className="text-white">How We Use It:</strong> To personalize your feed, improve AI recommendations, and maintain platform safety.</p>
        <p><strong className="text-white">Your Rights:</strong> You may request access, correction, or deletion of your data at any time from Settings.</p>
      </div>
    </div>
  )
}
