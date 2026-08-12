import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import { useAuth } from '@/context/AuthContext'
import { getFollowing, toggleFollow } from '@/services/authService'

export default function Following() {
  const navigate = useNavigate()
  const { user, login, dashboardData } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const userId = user?._id
        if (!userId) {
          setList([])
          return
        }
        const resp = await getFollowing(userId)
        const users = resp?.data?.following || []
        setList(users)
      } catch (err) {
        console.error('Failed to load following', err)
        setList([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  const handleUnfollow = async (targetId) => {
    try {
      const resp = await toggleFollow(targetId)
      // resp returns current user with updated following/followers; update AuthContext
      const updatedUser = resp?.data?.user
      if (updatedUser) {
        login(updatedUser, {
          ...(dashboardData || {}),
          followingCount: Array.isArray(updatedUser.following) ? updatedUser.following.length : (dashboardData?.followingCount ?? 0),
        })
      }
      // remove from local list optimistically
      setList((l) => l.filter(u => String(u._id) !== String(targetId)))
    } catch (err) {
      console.error('Unfollow failed', err)
    }
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/60 transition hover:text-white"><ChevronLeft size={22} /></button>
        <h1 className="text-2xl font-semibold">Following</h1>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">Loading...</div>
        ) : list.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">You are not following anyone yet.</div>
        ) : list.map((u) => (
          <div key={u._id} className="glass-card flex items-center gap-3 rounded-[28px] border border-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <Link to={`/profile/${u._id}`} className="flex items-center gap-3 flex-1">
              <Avatar src={u.profilePicture || 'https://i.pravatar.cc/150?img=12'} size={52} />
              <div>
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-white/50">@{u.username || u.name?.replace(/\s+/g, '').toLowerCase()}</p>
                {u.bio && <p className="mt-1 text-xs text-white/60">{u.bio}</p>}
              </div>
            </Link>
            <Button size="sm" variant="outline" className="rounded-full px-4 py-2" onClick={() => handleUnfollow(u._id)}>Unfollow</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
