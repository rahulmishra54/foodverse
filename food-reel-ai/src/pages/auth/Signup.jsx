import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { signup } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { login: setAuthUser } = useAuth()

  const onSubmit = async (data) => {
    try {
      const response = await signup(data)
      const token = response?.data?.token
      const user = response?.data?.user || {
        name: data.fullName,
        email: data.email,
        contact: data.contact,
      }
      const dashboardData = response?.data?.dashboardData

      if (token) localStorage.setItem('token', token)
      setAuthUser(user, dashboardData)

      toast.success('Account created successfully')
      navigate('/home')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Create account</h2>
      <p className="mt-1 text-sm text-white/50">Join thousands of food creators.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" icon={User} placeholder="John Doe" {...register('fullName', { required: 'Name is required' })} error={errors.fullName?.message} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input label="Contact" type="tel" icon={Phone} placeholder="9876543210" {...register('contact', { required: 'Contact is required' })} error={errors.contact?.message} />
        <Input label="Password" type="password" icon={Lock} placeholder="••••••••" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
        <Button type="submit" full size="lg">Sign Up</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account? <Link to="/login" className="text-primary">Log In</Link>
      </p>
    </div>
  )
}
