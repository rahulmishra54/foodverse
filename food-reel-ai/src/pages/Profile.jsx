import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Menu, Link2 } from 'lucide-react'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Card from '@/components/common/Card'
import clsx from 'clsx'
import { useAuth } from '@/context/AuthContext'
import { getUserProfile } from '@/services/authService'
import { deleteFood } from '@/services/foodService'
import { getItemImage } from '@/utils/format'
import Avatar from '@/components/common/Avatar'
export default function Profile() {
  const { id } = useParams()
  const [tab, setTab] = useState('reels')
  const { user, dashboardData, setDashboardData, login: setAuthUser } = useAuth()

  const [displayUser, setDisplayUser] = useState(user)
  const [displayDashboard, setDisplayDashboard] = useState(dashboardData)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setDisplayUser(null)
        setDisplayDashboard(null)
        return
      }

      const profileId = id || user._id
      setLoadingProfile(true)
      try {
        const resp = await getUserProfile(profileId)
        const fetchedUser = resp?.data?.user
        const fetchedDashboard = resp?.data?.dashboardData
        setDisplayUser(fetchedUser)
        setDisplayDashboard(fetchedDashboard)

        if (!id || profileId === user._id) {
          setDashboardData(fetchedDashboard)
        }
      } catch (err) {
        console.error('Failed to fetch profile', err)
        setDisplayUser(null)
        setDisplayDashboard(null)
      } finally {
        setLoadingProfile(false)
      }
    }

    load()
  }, [id, user?._id])

  const reels = Array.isArray(displayDashboard?.reels) ? displayDashboard.reels : []
  const likedReels = (displayDashboard?.likedVideos || []).map((item) => item?.food || item).filter(Boolean)
  const savedReels = (displayDashboard?.savedVideos || []).map((item) => item?.food || item).filter(Boolean)
  const activeItems = tab === 'liked' ? likedReels : reels

  const profileName = displayUser?.name || displayUser?.fullName || 'Food Creator'
  const profileImage = displayUser?.profilePicture || 'https://i.pravatar.cc/150?img=12'
  const bioText = displayUser?.bio || displayUser?.email || 'Food creator sharing recipe reels'

  const isOwn = !id || id === user?._id

  const handleDelete = async (foodId) => {
    try {
      await deleteFood(foodId)
      // update local dashboardData: remove from reels and decrement count
      if (isOwn) {
        const next = { ...dashboardData }
        next.reels = Array.isArray(next.reels) ? next.reels.filter(r => String(r._id || r.id) !== String(foodId)) : []
        next.reelsCount = Array.isArray(next.reels) ? next.reels.length : 0
        setDashboardData(next)
        setDisplayDashboard(next)
        // also update stored auth user dashboard data
        setAuthUser({ ...user, dashboardData: next })
      } else {
        // if viewing other user's profile, refresh their profile data
        const resp = await getUserProfile(id)
        setDisplayDashboard(resp?.data?.dashboardData)
      }
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  if (loadingProfile) return <div className="px-4 py-6 text-sm text-white/50">Loading profile...</div>

  if (!displayUser) return <div className="px-4 py-6 text-sm text-white/50">Profile not found.</div>

  return (
    <div className="space-y-6 pb-10">
      <div className="glass-card rounded-[32px] border border-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar src={profileImage} size={96} verified={displayUser?.verified} ring />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold text-white truncate">{profileName}</h1>
              <Badge variant="primary">Verified</Badge>
            </div>
            <p className="mt-3 max-w-xl text-sm text-white/60">{bioText}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Link to="/profile" className="rounded-3xl bg-white/5 px-4 py-4 transition hover:bg-white/10">
            <p className="text-lg font-semibold text-white">{displayDashboard?.reelsCount ?? (Array.isArray(displayDashboard?.reels) ? displayDashboard.reels.length : 0)}</p>
            <span className="text-xs uppercase tracking-[0.18em] text-white/50">Reels</span>
          </Link>
          <Link to="/followers" className="rounded-3xl bg-white/5 px-4 py-4 transition hover:bg-white/10">
            <p className="text-lg font-semibold text-white">{displayDashboard?.followersCount ?? (Array.isArray(displayUser?.followers) ? displayUser.followers.length : 0)}</p>
            <span className="text-xs uppercase tracking-[0.18em] text-white/50">Followers</span>
          </Link>
          <Link to="/following" className="rounded-3xl bg-white/5 px-4 py-4 transition hover:bg-white/10">
            <p className="text-lg font-semibold text-white">{displayDashboard?.followingCount ?? (Array.isArray(displayUser?.following) ? displayUser.following.length : 0)}</p>
            <span className="text-xs uppercase tracking-[0.18em] text-white/50">Following</span>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isOwn ? (
            <>
              <Link to="/edit-profile" className="w-full sm:w-auto">
                <Button full variant="outline" size="md">Edit Profile</Button>
              </Link>
              <Link to="/settings" className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                Settings
              </Link>
            </>
          ) : (
            <div className="w-full sm:w-auto" />
          )}
          <button className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto">
            Share Profile
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[32px] border border-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-3 overflow-hidden rounded-full bg-black/40 p-1">
          {['reels', 'liked'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${tab === item ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB07A] text-black shadow-[0_10px_30px_rgba(255,122,0,0.24)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              {item === 'reels' ? 'Reels' : 'Liked'}
            </button>
          ))}
        </div>
      </div>

      {activeItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {activeItems.map((item) => {
            const reel = item?.food || item
            const reelId = reel?._id || reel?.id
            const reelTitle = reel?.name || 'Recipe reel'
            const reelThumbnail = getItemImage(reel)

            return (
              <Link key={reelId} to={`/reel/${reelId}`} className="group relative overflow-hidden rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                <img src={reelThumbnail || 'https://via.placeholder.com/300?text=Recipe'} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105" alt={reelTitle} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white line-clamp-2">{reelTitle}</div>
                {isOwn && tab !== 'liked' && (
                  <button onClick={(e) => { e.preventDefault(); handleDelete(reelId) }} className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white transition hover:bg-white/10">
                    Delete
                  </button>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          No {tab === 'liked' ? 'liked' : 'uploaded'} reels yet.
        </div>
      )}
    </div>
  )
}
