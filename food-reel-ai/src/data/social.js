export const comments = [
  { id: 'cm1', user: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=32', text: 'This looks amazing! Trying it tonight 😍', time: '2h', likes: 24 },
  { id: 'cm2', user: 'Marco Rossi', avatar: 'https://i.pravatar.cc/150?img=51', text: 'Perfect creamy texture, great recipe.', time: '5h', likes: 12 },
  { id: 'cm3', user: 'Ana Lopez', avatar: 'https://i.pravatar.cc/150?img=44', text: 'Can I use half and half instead of cream?', time: '1d', likes: 6 },
  { id: 'cm4', user: 'Ravi Kumar', avatar: 'https://i.pravatar.cc/150?img=15', text: 'Made this twice already, family loves it!', time: '2d', likes: 31 },
]

export const notifications = [
  { id: 'n1', type: 'like', user: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=32', text: 'liked your recipe "Chicken Alfredo Pasta"', time: '10m' },
  { id: 'n2', type: 'comment', user: 'Marco Rossi', avatar: 'https://i.pravatar.cc/150?img=51', text: 'commented on your reel', time: '1h' },
  { id: 'n3', type: 'follow', user: 'Ana Lopez', avatar: 'https://i.pravatar.cc/150?img=44', text: 'started following you', time: '3h' },
  { id: 'n4', type: 'approval', user: 'System', avatar: null, text: 'Your recipe "Cheese Burst Pizza" was approved ✅', time: '1d' },
  { id: 'n5', type: 'rejected', user: 'System', avatar: null, text: 'Your recipe "Spicy Tacos" needs revision ❌', time: '2d' },
  { id: 'n6', type: 'system', user: 'System', avatar: null, text: 'Your latest recipe upload is live and ready to share', time: '2d' },
]

export const bookmarkCollections = [
  { id: 'b1', name: 'Dinner', count: 12 },
  { id: 'b2', name: 'Breakfast', count: 8 },
  { id: 'b3', name: 'Dessert', count: 15 },
  { id: 'b4', name: 'Drinks', count: 5 },
]

export const stats = {
  totalViews: '2.4M',
  totalLikes: '184K',
  totalRecipes: 128,
  avgRating: 4.8,
}
