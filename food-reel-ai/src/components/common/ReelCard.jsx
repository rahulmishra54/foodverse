import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck } from 'lucide-react'
import Avatar from './Avatar'
import { toggleBookmark, toggleLike } from '@/services/foodService'
import { toggleFollow } from '@/services/authService'

const ACTION_BUTTON_CLASS =
  'flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:bg-white/15 active:scale-95'

const STAT_CARD_CLASS = 'rounded-2xl bg-white/5 p-3 text-center'

export default function ReelCard({ recipe }) {
  const [liked, setLiked] = useState(Boolean(recipe?.isLiked))
  const [saved, setSaved] = useState(Boolean(recipe?.isSaved))
  const [likeCount, setLikeCount] = useState(recipe?.likes ?? 0)
  const [bookmarkCount, setBookmarkCount] = useState(recipe?.bookmarks ?? 0)
  const [following, setFollowing] = useState(Boolean(recipe?.isFollowing))

  useEffect(() => {
    setLiked(Boolean(recipe?.isLiked))
    setSaved(Boolean(recipe?.isSaved))
    setLikeCount(recipe?.likes ?? 0)
    setBookmarkCount(recipe?.bookmarks ?? 0)
    setFollowing(Boolean(recipe?.isFollowing))
  }, [recipe?.id, recipe?.likes, recipe?.bookmarks, recipe?.isLiked, recipe?.isSaved, recipe?.isFollowing])

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

  const handleFollow = async () => {
    try {
      const targetId = recipe.foodPartnerId || recipe?.foodPartner?._id || recipe?.chef?.id || recipe?.chefId
      if (!targetId) return
      const resp = await toggleFollow(targetId)
      const action = resp?.data?.action || resp?.data?.result || null
      if (action === 'followed' || action === 'created') setFollowing(true)
      else if (action === 'unfollowed' || action === 'removed') setFollowing(false)
      else setFollowing((v) => !v)
    } catch (err) {
      console.error('Follow action failed', err)
    }
  }

  const partnerId = recipe?.foodPartner?._id || recipe?.foodPartnerId || recipe?.chef?.id || recipe?.chefId || recipe?.chef?._id
  const partnerName = recipe?.foodPartner?.name || recipe?.chef?.name || recipe?.chefName || recipe?.ownerName
  const partnerAvatar = recipe?.foodPartner?.profilePicture || recipe?.chef?.avatar || recipe?.chefAvatar
  const partnerVerified = Boolean(recipe?.foodPartner?.verified)

  return (
    <div className="group relative mx-4 mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 sm:mx-0">
      {/* Video */}
      <Link to={`/reel/${recipe.id}`}>
        <div className="relative overflow-hidden rounded-t-[28px]">
          <video
            src={recipe.video?.url || recipe.videoUrl}
            poster={recipe.thumbnail || recipe.video?.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
      </Link>

      {/* Floating action column — vertically centered, never touches content */}
      <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6">
        <button onClick={handleLike} aria-label="Like" className={ACTION_BUTTON_CLASS}>
          <Heart size={26} className={liked ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-white'} />
        </button>

        <Link to={`/reel/${recipe.id}`} aria-label="Comments" className={ACTION_BUTTON_CLASS}>
          <MessageCircle size={26} />
        </Link>

        <button onClick={handleSave} aria-label="Save" className={ACTION_BUTTON_CLASS}>
          <Bookmark size={26} className={saved ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-white'} />
        </button>

        <button aria-label="Share" className={ACTION_BUTTON_CLASS}>
          <Share2 size={24} />
        </button>
      </div>

      {/* Content — right padding keeps it clear of the floating column */}
      <div className="p-5 pr-24 sm:pr-28">
        <div className="flex items-center justify-between gap-3">
          <Link to={partnerId ? `/profile/${partnerId}` : '/profile'} className="flex min-w-0 items-center gap-3">
            <Avatar src={partnerAvatar} size={40} verified={partnerVerified} />
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-sm font-semibold text-white">
                {partnerName || 'Unknown'}
                {partnerVerified && <BadgeCheck size={14} className="shrink-0 fill-[#FF7A00] text-black" />}
              </p>
              <p className="truncate text-xs text-white/50">{recipe?.foodPartner?.restaurantName || 'Food Creator'}</p>
            </div>
          </Link>

          {partnerId && (
            <button
              onClick={handleFollow}
              className={`h-9 w-[88px] shrink-0 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                following
                  ? 'border border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                  : 'bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] text-black hover:brightness-105'
              }`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <Link to={`/reel/${recipe.id}`}>
          <h3 className="mt-4 text-lg font-semibold text-white">{recipe.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/60">{recipe.description}</p>
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          {(recipe.hashtags || []).map((h) => (
            <span key={h} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">{h}</span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-white/50">
          <div className={STAT_CARD_CLASS}>
            <p className="text-sm font-semibold text-white">{recipe.cookingTime}</p>
            <span>Time</span>
          </div>
          <div className={STAT_CARD_CLASS}>
            <p className="text-sm font-semibold text-white">{recipe.rating}</p>
            <span>Rating</span>
          </div>
          <div className={STAT_CARD_CLASS}>
            <p className="text-sm font-semibold text-white">{recipe.calories} cal</p>
            <span>Calories</span>
          </div>
        </div>

        <Link to={`/recipe/${recipe.id}`}>
          <button className="mt-5 w-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-105">
            View Recipe
          </button>
        </Link>
      </div>
    </div>
  )
}