import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      >
        <ChefHat size={28} className="text-white" />
      </motion.div>
      <p className="text-sm text-white/40">Cooking things up...</p>
    </div>
  )
}
