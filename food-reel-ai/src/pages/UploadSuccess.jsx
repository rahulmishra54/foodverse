import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Button from '@/components/common/Button'

export default function UploadSuccess() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 size={72} className="text-primary" />
      </motion.div>
      <h1 className="mt-6 text-2xl font-semibold">Reel Uploaded!</h1>
      <p className="mt-2 text-sm text-white/50">Your recipe is uploaded successfully and will appear on your profile shortly.</p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <Button full size="lg" onClick={() => navigate('/home')}>Go to Home</Button>
        <Button full size="lg" variant="outline" onClick={() => navigate('/profile')}>View Profile</Button>
      </div>
    </div>
  )
}
