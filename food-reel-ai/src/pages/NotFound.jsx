import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import Button from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <ChefHat size={56} className="text-primary/50" />
      <h1 className="mt-4 text-5xl font-bold text-gradient">404</h1>
      <p className="mt-2 text-white/60">Oops! This page isn't on the menu.</p>
      <Link to="/home" className="mt-6"><Button>Back to Home</Button></Link>
    </div>
  )
}
