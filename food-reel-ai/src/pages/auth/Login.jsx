import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { login } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { login: setAuthUser } = useAuth()

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      const token = response?.data?.token
      const user = response?.data?.user
      const dashboardData = response?.data?.dashboardData

      if (token) localStorage.setItem('token', token)
      if (user) setAuthUser(user, dashboardData)

      toast.success('Logged in successfully')
      navigate('/home')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome back</h2>
      <p className="mt-1 text-sm text-white/50">Log in to continue cooking.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input label="Password" type="password" icon={Lock} placeholder="••••••••" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-primary">Forgot Password?</Link>
        </div>
        <Button type="submit" full size="lg">Log In</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
      </p>
    </div>
  )
}
