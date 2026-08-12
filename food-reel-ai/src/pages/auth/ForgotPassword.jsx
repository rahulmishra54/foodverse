import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { forgotPassword } from '@/services/authService'

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email })
      sessionStorage.setItem('resetEmail', data.email)
      toast.success('Reset code sent to your email')
      navigate('/otp-verification')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send reset code')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Forgot Password</h2>
      <p className="mt-1 text-sm text-white/50">Enter your email to receive a reset code.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        <Button type="submit" full size="lg">Send Reset Code</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Remember your password? <Link to="/login" className="text-primary">Log In</Link>
      </p>
    </div>
  )
}
