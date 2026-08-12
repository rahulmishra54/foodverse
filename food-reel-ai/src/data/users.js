export const currentUser = {
  id: 'u1',
  name: 'Chef Arjun',
  username: '@chefarjun',
  avatar: 'https://i.pravatar.cc/150?img=12',
  banner: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200',
  bio: 'Food Creator | 50K+ Happy Followers. I love to create simple & delicious recipes!',
  verified: true,
  followers: 24500,
  following: 132,
  recipes: 128,
  achievements: ['Top Creator 2025', '1M Views Club', 'Verified Chef'],
}

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Priya Sharma',
    username: '@priyacooks',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bio: 'Home chef sharing quick healthy meals.',
    verified: true,
    followers: 18300,
    following: 90,
    recipes: 76,
  },
  {
    id: 'u3',
    name: 'Marco Rossi',
    username: '@marcocucina',
    avatar: 'https://i.pravatar.cc/150?img=51',
    bio: 'Italian cuisine specialist.',
    verified: false,
    followers: 9400,
    following: 210,
    recipes: 44,
  },
]

export const followers = Array.from({ length: 12 }).map((_, i) => ({
  id: `f${i}`,
  name: `Follower ${i + 1}`,
  username: `@follower${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  isFollowing: i % 3 === 0,
}))

export const following = Array.from({ length: 8 }).map((_, i) => ({
  id: `g${i}`,
  name: `Chef ${i + 1}`,
  username: `@chef${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
  isFollowing: true,
}))
