import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import { verifyOtp, forgotPassword } from '@/services/authService'

export default function OtpVerification() {
  const navigate = useNavigate()
  const inputs = useRef([])
  const [values, setValues] = useState(['', '', '', ''])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const email = sessionStorage.getItem('resetEmail')
    if (!email) {
      navigate('/forgot-password')
    }
  }, [navigate])

  const handleChange = (e, i) => {
    const nextValues = [...values]
    nextValues[i] = e.target.value.slice(0, 1)
    setValues(nextValues)
    if (e.target.value && i < 3) inputs.current[i + 1]?.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const code = values.join('')
    const email = sessionStorage.getItem('resetEmail')
    if (!email || code.length < 4) {
      toast.error('Please enter the full 4-digit code')
      return
    }

    setSubmitting(true)
    try {
      const response = await verifyOtp({ email, code })
      const resetToken = response?.data?.resetToken
      if (resetToken) {
        sessionStorage.setItem('resetToken', resetToken)
        toast.success('OTP verified')
        navigate('/reset-password')
      } else {
        toast.error('Unable to verify code')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Verify OTP</h2>
      <p className="mt-1 text-sm text-white/50">Enter the 4-digit code sent to your email.</p>
      <form onSubmit={onSubmit}>
        <div className="mt-6 flex justify-between gap-3">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              maxLength={1}
              value={values[i]}
              onChange={(e) => handleChange(e, i)}
              className="h-14 w-14 rounded-2xl border border-border bg-[#111] text-center text-xl outline-none focus:border-primary"
            />
          ))}
        </div>
        <Button type="submit" full size="lg" className="mt-6">{submitting ? 'Verifying...' : 'Verify'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Didn't receive code? <button
          type="button"
          className="text-primary"
          onClick={async () => {
            const email = sessionStorage.getItem('resetEmail')
            if (!email) {
              toast.error('Unable to resend code')
              return
            }
            try {
              await forgotPassword({ email })
              toast.success('Reset code resent')
            } catch (error) {
              toast.error(error?.response?.data?.message || 'Resend failed')
            }
          }}
        >
          Resend
        </button>
      </p>
    </div>
  )
}
