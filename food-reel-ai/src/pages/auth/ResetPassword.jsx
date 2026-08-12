import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { resetPassword } from '@/services/authService'

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    const email = sessionStorage.getItem('resetEmail')
    const token = sessionStorage.getItem('resetToken')
    if (!email || !token) {
      navigate('/forgot-password')
    }
  }, [navigate])

  const onSubmit = async (data) => {
    const email = sessionStorage.getItem('resetEmail')
    const token = sessionStorage.getItem('resetToken')
    if (!email || !token) {
      toast.error('Reset session expired')
      navigate('/forgot-password')
      return
    }

    if (data.password !== data.confirm) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await resetPassword({ email, token, password: data.password })
      sessionStorage.removeItem('resetEmail')
      sessionStorage.removeItem('resetToken')
      toast.success('Password reset successfully')
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reset Password</h2>
      <p className="mt-1 text-sm text-white/50">Create a new password for your account.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          {...register('password', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          {...register('confirm', { required: 'Please confirm your password', validate: (value) => value === watch('password') || 'Passwords must match' })}
          error={errors.confirm?.message}
        />
        <Button type="submit" full size="lg">Reset Password</Button>
      </form>
    </div>
  )
}
