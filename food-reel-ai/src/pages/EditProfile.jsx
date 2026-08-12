import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ChevronLeft, Camera } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { useAuth } from '@/context/AuthContext'
import * as authService from '@/services/authService'

export default function EditProfile() {
  const { user, login, dashboardData } = useAuth()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || user?.fullName || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  })
  const navigate = useNavigate()
  const fileRef = useRef()

  const onSubmit = async (data) => {
    try {
      // If a new profile picture file is selected, send FormData to backend
      const file = fileRef.current?.files?.[0]
      const formData = new FormData()

      if (file) formData.append('profilePicture', file)
      if (data.name) formData.append('name', data.name)
      if (data.username) formData.append('username', data.username)
      if (data.bio) formData.append('bio', data.bio)

      const resp = await authService.updateProfile(formData)
      const updatedUser = resp?.data?.user || resp?.data
      if (updatedUser) {
        // update AuthContext (preserve dashboardData)
        login(updatedUser, dashboardData)
      }

      toast.success('Profile updated')
      navigate('/profile')
    } catch (err) {
      console.error('Profile update failed', err)
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60"><ChevronLeft size={22} /></button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <img src={user?.profilePicture || 'https://i.pravatar.cc/150?img=12'} className="h-24 w-24 rounded-full object-cover" alt="Profile" />
          <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-white cursor-pointer">
            <Camera size={14} />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" {...register('name')} />
        <Input label="Username" {...register('username')} />
        <Input label="Description / Bio" {...register('bio')} />
        <Button type="submit" full size="lg">Save Changes</Button>
      </form>
    </div>
  )
}
