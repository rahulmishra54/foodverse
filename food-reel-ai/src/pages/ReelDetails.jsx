import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, MoreVertical, Play, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import { formatCount, getItemImage } from '@/utils/format'
import { createComment, getComments, getFoodById, toggleBookmark, toggleLike } from '@/services/foodService'
import * as authService from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

const normalizeRecipe = (item) => ({
  id: item?._id || item?.id,
  title: item?.name,
  description: item?.description,
  thumbnail: getItemImage(item),
  videoUrl: item?.video?.url,
  likes: item?.likes ?? 0,
  comments: item?.comments ?? 0,
  bookmarks: 0,
  chef: {
    avatar: item?.foodPartner?.profilePicture || 'https://i.pravatar.cc/150?img=12',
    name: item?.foodPartner?.name || item?.foodPartner?.restaurantName || item?.foodPartner?.ownerName || 'Food Partner',
    verified: true,
    id: item?.foodPartner?._id || item?.foodPartner?.id || item?.foodPartnerId || null,
  },
  ingredients: item?.ingredients ?? [],
  steps: item?.recipeSteps ?? [],
  calories: item?.calories ?? 0,
  cookingTime: item?.cookingTime || item?.prepTime || 'N/A',
  difficulty: item?.difficulty,
})

export default function ReelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [tab, setTab] = useState('ingredients')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [following, setFollowing] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [isCommenting, setIsCommenting] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getFoodById(id)
        const item = response?.data?.foodItem
        const normalizedRecipe = normalizeRecipe(item)
        setRecipe(normalizedRecipe)
        setLikeCount(response?.data?.likes ?? normalizedRecipe.likes ?? 0)
        setBookmarkCount(normalizedRecipe.bookmarks ?? 0)
        setCommentCount(response?.data?.comments ?? normalizedRecipe.comments ?? 0)

        // set liked/saved state from response
        setLiked(Boolean(response?.data?.isLiked))
        setSaved(Boolean(response?.data?.isSaved))
        setFollowing(Boolean(response?.data?.isFollowing))

        // fetch comments
        try {
          const commentsResp = await getComments(id)
          const serverComments = commentsResp?.data?.comments || []
          const mapped = serverComments.map((c) => ({
            id: c._id,
            user: c.user?.name || c.user?.username || 'User',
            message: c.comment,
            avatar: c.user?.profilePicture || null,
          }))
          setComments(mapped)
        } catch (err) {
          console.error('Failed to load comments', err)
        }

      } catch (error) {
        console.error('Recipe fetch failed', error)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  const handleLike = async () => {
    try {
      const resp = await toggleLike({ foodId: recipe.id })
      const action = resp?.data?.action
      const likes = resp?.data?.likes
      if (action === 'created') {
        setLiked(true)
        setLikeCount((current) => (typeof likes === 'number' ? likes : current + 1))
      } else if (action === 'removed') {
        setLiked(false)
        setLikeCount((current) => (typeof likes === 'number' ? likes : Math.max(0, current - 1)))
      } else {
        // fallback toggle
        setLiked((value) => !value)
      }
    } catch (error) {
      console.error('Like failed', error)
    }
  }

  const handleSave = async () => {
    try {
      await toggleBookmark({ foodId: recipe.id })
      setSaved((value) => {
        const nextValue = !value
        setBookmarkCount((count) => count + (nextValue ? 1 : -1))
        return nextValue
      })
    } catch (error) {
      console.error('Bookmark failed', error)
    }
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    const trimmedComment = commentText.trim()

    if (!trimmedComment || !recipe?.id) return

    setIsCommenting(true)

    try {
      const response = await createComment({ foodId: recipe.id, comment: trimmedComment })
      const createdComment = response?.data?.comment

      setComments((previousComments) => [
        ...previousComments,
        {
          id: createdComment?._id || Date.now(),
          user: createdComment?.user?.name || createdComment?.user?.username || user?.fullName || 'You',
          message: createdComment?.comment || trimmedComment,
          avatar: createdComment?.user?.profilePicture || null,
        },
      ])
      setCommentCount((count) => count + 1)
      setCommentText('')
    } catch (error) {
      console.error('Comment failed', error)
    } finally {
      setIsCommenting(false)
    }
  }

  if (loading) {
    return <div className="px-4 py-6 text-sm text-white/50">Loading reel...</div>
  }

  if (!recipe) {
    return <div className="px-4 py-6 text-sm text-white/50">Reel not found.</div>
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <video src={recipe.videoUrl} poster={recipe.thumbnail} className="h-[420px] w-full object-cover" controls playsInline autoPlay muted loop />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/10 to-black/40" />
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white shadow-lg shadow-black/30 transition hover:bg-white/10">
          <ChevronLeft size={20} />
        </button>
        <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white shadow-lg shadow-black/30 transition hover:bg-white/10">
          <MoreVertical size={18} />
        </button>
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white backdrop-blur">Video</span>
      </div>

      <div className="glass-card rounded-[32px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={recipe.chef.avatar} size={56} verified={recipe.chef.verified} ring />
            <div>
              <p className="text-xl font-semibold text-white">{recipe.title}</p>
              <p className="mt-1 text-sm text-white/60">{recipe.chef.name}</p>
            </div>
          </div>
          {recipe?.chef?.id && (
            <button onClick={async () => {
              try {
                const targetId = recipe?.chef?.id
                if (!targetId) return
                const resp = await authService.toggleFollow(targetId)
                const action = resp?.data?.action
                if (action === 'followed' || action === 'created') setFollowing(true)
                else if (action === 'unfollowed' || action === 'removed') setFollowing(false)
              } catch (err) {
                console.error('Follow failed', err)
              }
            }} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
              {following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
            <p className="text-base font-semibold text-white">{formatCount(likeCount)}</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">Likes</span>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
            <p className="text-base font-semibold text-white">{formatCount(commentCount)}</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">Comments</span>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
            <p className="text-base font-semibold text-white">{formatCount(bookmarkCount)}</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">Bookmarks</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={handleLike} className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <Heart size={18} className={liked ? 'mr-2 fill-[#FF7A00] text-[#FF7A00]' : 'mr-2 text-white'} /> Like
          </button>
          <button className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <MessageCircle size={18} className="mr-2 text-white" /> Comment
          </button>
          <button onClick={handleSave} className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <Bookmark size={18} className={saved ? 'mr-2 fill-[#FF7A00] text-[#FF7A00]' : 'mr-2 text-white'} /> Save
          </button>
          <button className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <Share2 size={18} className="mr-2 text-white" /> Share
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[32px] border border-white/10 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap gap-2 rounded-full bg-black/40 p-1 text-sm text-white/60">
          {['ingredients', 'steps', 'nutrition', 'comments'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 transition ${tab === t ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] text-black shadow-[0_10px_30px_rgba(255,122,0,0.24)]' : 'hover:bg-white/10'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {tab === 'ingredients' && (
            <ul className="space-y-2">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3 text-sm text-white/70">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF7A00]" /> {ing}
                </li>
              ))}
            </ul>
          )}
          {tab === 'steps' && (
            <ol className="space-y-3">
              {recipe.steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-3xl bg-white/5 p-4 text-sm text-white/70">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00]/15 text-xs text-[#FF7A00]">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          )}
          {tab === 'nutrition' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[['Calories', recipe.calories], ['Time', recipe.cookingTime], ['Difficulty', recipe.difficulty]].map(([k, v]) => (
                <div key={k} className="rounded-3xl bg-white/5 p-4 text-center text-sm text-white/70">
                  <p className="text-xl font-semibold text-white">{v}</p>
                  <p className="mt-2 uppercase tracking-[0.18em] text-xs text-white/50">{k}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'comments' && (
            <div className="space-y-4">
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={3}
                  placeholder="Write a comment..."
                  className="w-full rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF7A00]/40"
                />
                <Button type="submit" size="sm" full disabled={isCommenting}>
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
              <div className="space-y-3">
                {comments.length > 0 ? comments.map((comment) => (
                  <div key={comment.id} className="rounded-[28px] bg-white/5 p-4 text-sm text-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    <p className="text-sm font-semibold text-white">{comment.user}</p>
                    <p className="mt-2 leading-6">{comment.message}</p>
                  </div>
                )) : (
                  <div className="rounded-[28px] bg-white/5 p-4 text-sm text-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    No comments yet. Start the conversation.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Link to={`/recipe/${recipe.id}`}>
        <Button full size="lg">View Full Recipe</Button>
      </Link>
    </div>
  )
}
