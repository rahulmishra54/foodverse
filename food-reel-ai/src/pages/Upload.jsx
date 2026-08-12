import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UploadCloud, ChevronLeft } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { createFood } from '@/services/foodService'

export default function Upload() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      ingredients: '',
      recipeSteps: '',
      cuisine: '',
      difficulty: 'Easy',
      prepTime: '',
      cookingTime: '',
      calories: '',
      tags: '',
      privacy: 'public',
    },
  })
  const navigate = useNavigate()
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedCover, setSelectedCover] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please select a video file')
      return
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
      }
    })
    formData.append('video', selectedFile)
    if (selectedCover) formData.append('coverImage', selectedCover)

    setUploading(true)

    try {
      await createFood(formData)
      setUploading(false)
      navigate('/upload-success')
    } catch (error) {
      setUploading(false)
      toast.error(error?.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60 transition hover:text-white"><ChevronLeft size={22} /></button>
        <h1 className="text-2xl font-semibold">Upload Your Reel</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            setFileName(file?.name)
            setSelectedFile(file)
          }}
          className={`flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed p-10 text-center transition-colors ${
            dragOver ? 'border-[#FF7A00] bg-[#FF7A00]/10' : 'border-white/10 bg-white/5'
          }`}
        >
          <UploadCloud size={36} className="text-[#FF7A00]" />
          <p className="text-sm text-white/70">{fileName || 'Drag & drop your video here'}</p>
          <p className="text-xs text-white/40">or</p>
          <label htmlFor="video-input" className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#FF7A00]/20 transition hover:brightness-110">
            Select Video
          </label>
          <input
            id="video-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0]
              setFileName(file?.name)
              setSelectedFile(file)
            }}
          />
        </div>

        <div className="glass-card rounded-[28px] border border-white/10 p-4 shadow-[0_25px_65px_rgba(0,0,0,0.18)]">
          <label className="text-sm text-white/60">Cover Image (optional)</label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="cover-input" className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
              Choose Cover
            </label>
            <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedCover(e.target.files?.[0])} />
            <span className="text-xs text-white/50">{selectedCover?.name || 'No cover chosen'}</span>
          </div>
        </div>

        <Input
          label="Recipe Name"
          placeholder="e.g. Spicy Garlic Noodles"
          {...register('name', { required: 'Recipe name is required' })}
          error={errors.name?.message}
        />
        <Input label="Description" placeholder="Short description..." {...register('description')} />
        <Input
          label="Ingredients"
          placeholder="Add ingredients (comma separated)"
          {...register('ingredients')}
        />
        <Input
          label="Recipe Steps"
          placeholder="Add steps (comma separated)"
          {...register('recipeSteps')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Cuisine</label>
            <input
              {...register('cuisine', { required: 'Cuisine is required' })}
              placeholder="e.g. Italian"
              className="w-full rounded-[24px] bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF7A00]/60"
            />
            {errors.cuisine && <span className="mt-1 block text-xs text-red-400">{errors.cuisine.message}</span>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Difficulty</label>
            <select
              {...register('difficulty', { required: 'Difficulty is required' })}
              className="w-full rounded-[24px] bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF7A00]/60"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {errors.difficulty && <span className="mt-1 block text-xs text-red-400">{errors.difficulty.message}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Prep Time" placeholder="e.g. 10 min" {...register('prepTime')} />
          <Input label="Cooking Time" placeholder="e.g. 20 min" {...register('cookingTime')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Calories" placeholder="e.g. 450" {...register('calories')} />
          <Input label="Tags" placeholder="e.g. pasta,garlic" {...register('tags')} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Privacy</label>
          <select
            {...register('privacy', { required: 'Privacy selection is required' })}
            className="w-full rounded-[24px] bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF7A00]/60"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {errors.privacy && <span className="mt-1 block text-xs text-red-400">{errors.privacy.message}</span>}
        </div>

        <Button type="submit" full size="lg" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </Button>
        <p className="text-center text-xs text-white/30">Your recipe reel will be live once the upload is complete.</p>
      </form>
    </div>
  )
}
